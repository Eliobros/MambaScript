#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');
const http = require('http');
const { spawnSync } = require('child_process');

// ======================== CONFIGURAÇÕES ========================
const NPM_URL    = 'https://registry.npmjs.org/mambascript-mz/latest';
const GITHUB_URL = 'https://api.github.com/repos/Eliobros/MambaScript/releases/latest';
const USER_AGENT = 'MambaScript-Atualizador';

const CACHE_FILE   = path.join(os.homedir(), '.mambas', '.ultima_verificacao');
const INTERVALO_MS = 24 * 60 * 60 * 1000; // verifica no máximo 1x por dia

// ======================== UTILITÁRIOS ========================

function limparVersao(v) {
    if (!v) return null;
    return String(v).trim().replace(/^v/i, '');
}

// Comparação de SemVer (major.minor.patch)
function compararVersao(v1, v2) {
    const a = limparVersao(v1).split('.').map(Number);
    const b = limparVersao(v2).split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        const x = a[i] || 0;
        const y = b[i] || 0;
        if (x > y) return 1;
        if (x < y) return -1;
    }
    return 0;
}

function maiorVersao(...versoes) {
    let maior = null;
    for (const v of versoes) {
        if (!v) continue;
        if (!maior || compararVersao(v, maior) > 0) maior = v;
    }
    return maior;
}

function obterVersaoAtual() {
    try { return require('../package.json').version; } catch (e) {}
    try { return require('../../package.json').version; } catch (e) {}
    try { return require('./package.json').version; } catch (e) {}
    return null;
}

function get(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return get(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) resolve(data);
                else reject(new Error(`HTTP ${res.statusCode}`));
            });
        }).on('error', reject);
    });
}

function getJson(url) {
    return get(url).then(JSON.parse);
}

function download(url, destino) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return download(res.headers.location, destino).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));

            const file = fs.createWriteStream(destino);
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
            file.on('error', reject);
        }).on('error', reject);
    });
}

// ======================== CONSULTAS ========================

async function ultimaVersaoNpm() {
    const data = await getJson(NPM_URL);
    return data && data.version ? limparVersao(data.version) : null;
}

async function ultimoReleaseGithub() {
    const data = await getJson(GITHUB_URL);
    return data || null;
}

// ======================== ESCOLHA DO BINÁRIO ========================

function candidatosAsset(platform = process.platform, arch = process.arch) {
    if (platform === 'linux') {
        if (arch === 'arm64') return ['mambas-linux-arm64', 'mambas-linux', 'mambas'];
        return ['mambas-linux-x64', 'mambas-linux', 'mambas'];
    }
    if (platform === 'darwin') {
        if (arch === 'arm64') return ['mambas-macos-arm64', 'mambas-macos', 'mambas-macos-x64'];
        return ['mambas-macos-x64', 'mambas-macos'];
    }
    if (platform === 'win32') {
        return ['mambas-win.exe', 'mambascript-mz-win.exe'];
    }
    return [];
}

function escolherAsset(assets) {
    if (!Array.isArray(assets) || assets.length === 0) return null;
    for (const nome of candidatosAsset()) {
        const encontrado = assets.find(a => a.name === nome);
        if (encontrado && encontrado.browser_download_url) return encontrado;
    }
    return null;
}

// ======================== ATUALIZAÇÃO ========================

function confirmar() {
    const resposta = process.env.MAMBAS_ATUALIZAR_SIM === '1';
    if (resposta) return true;

    let prompt;
    try { prompt = require('prompt-sync')(); } catch (e) { return false; }

    const r = prompt('Deseja atualizar agora? (s/N): ');
    return /^(s|sim|y|yes)$/i.test(String(r || '').trim());
}

function atualizarViaNpm() {
    console.log('\n📦 Atualizando via npm (pode demorar um pouco)...\n');

    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const res = spawnSync(npm, ['install', '-g', 'mambascript-mz@latest'], { stdio: 'inherit' });

    if (res.status === 0) {
        console.log('\n✅ MambaScript atualizado com sucesso!');
        process.exit(0);
    }

    console.error('\n❌ Falha ao atualizar via npm.');
    console.error('💡 Tente manualmente: npm install -g mambascript-mz@latest');
    process.exit(1);
}

async function atualizarBinario(release) {
    if (!release || !Array.isArray(release.assets)) {
        console.error('\n❌ Não foi possível obter os binários do GitHub.');
        console.error('💡 Baixe manualmente em: https://github.com/Eliobros/MambaScript/releases/latest');
        process.exit(1);
    }

    const asset = escolherAsset(release.assets);
    if (!asset) {
        console.error('\n❌ Nenhum binário compatível encontrado para este sistema.');
        console.error('💡 Baixe manualmente em: https://github.com/Eliobros/MambaScript/releases/latest');
        process.exit(1);
    }

    const destino = process.execPath;
    const temporario = path.join(os.tmpdir(), `mambas-${limparVersao(release.tag_name)}.download`);

    console.log(`\n⬇️  Baixando ${asset.name} (${(asset.size / 1024 / 1024).toFixed(1)} MB)...`);
    try {
        await download(asset.browser_download_url, temporario);
    } catch (e) {
        console.error(`❌ Erro ao baixar: ${e.message}`);
        try { fs.unlinkSync(temporario); } catch (err) {}
        process.exit(1);
    }

    console.log('🔧 Substituindo o executável...');
    try {
        if (process.platform !== 'win32') {
            fs.chmodSync(temporario, 0o755);
        }
        fs.renameSync(temporario, destino);
        console.log(`\n✅ MambaScript atualizado com sucesso em: ${destino}`);
        console.log('💡 Reinicie o terminal (ou rode "mambas --versao") para confirmar.');
        process.exit(0);
    } catch (e) {
        console.error(`❌ Não foi possível substituir o executável: ${e.message}`);
        console.error(`💡 O novo binário foi baixado em: ${temporario}`);
        console.error('💡 Substitua manualmente ou use: npm install -g mambascript-mz');
        process.exit(1);
    }
}

// ======================== VERIFICAÇÃO AUTOMÁTICA ========================

function lerUltimaVerificacao() {
    try {
        const n = parseInt(fs.readFileSync(CACHE_FILE, 'utf-8'), 10);
        return Number.isFinite(n) ? n : 0;
    } catch (e) {
        return 0;
    }
}

function gravarUltimaVerificacao() {
    try {
        fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
        fs.writeFileSync(CACHE_FILE, String(Date.now()));
    } catch (e) {}
}

async function verificarAtualizacao() {
    if (process.env.MAMBAS_SEM_VERIFICACAO === '1') return;

    try {
        if (Date.now() - lerUltimaVerificacao() < INTERVALO_MS) return;

        let versaoNova = null;
        try { versaoNova = await ultimaVersaoNpm(); } catch (e) {}
        if (!versaoNova) {
            try {
                const r = await ultimoReleaseGithub();
                versaoNova = r && r.tag_name ? limparVersao(r.tag_name) : null;
            } catch (e) {}
        }

        gravarUltimaVerificacao();
        if (!versaoNova) return;

        const atual = obterVersaoAtual();
        if (atual && compararVersao(versaoNova, atual) > 0) {
            console.error(`\nℹ️  Nova versão do MambaScript disponível: v${versaoNova} (atual: v${atual})`);
            console.error('💡 Atualize com: mambas atualizar\n');
        }
    } catch (e) {
        // falha silenciosa (ex.: sem internet)
    }
}

// ======================== COMANDO PRINCIPAL ========================

async function atualizar() {
    const atual = obterVersaoAtual();
    console.log(`🐍 MambaScript v${atual || '?'} — verificando atualizações...\n`);

    let versaoNpm = null;
    let versaoGithub = null;
    let release = null;

    try {
        versaoNpm = await ultimaVersaoNpm();
    } catch (e) {
        console.warn('⚠️  Não foi possível consultar o npm.');
    }

    try {
        release = await ultimoReleaseGithub();
        versaoGithub = release && release.tag_name ? limparVersao(release.tag_name) : null;
    } catch (e) {
        console.warn('⚠️  Não foi possível consultar o GitHub.');
    }

    const versaoNova = maiorVersao(versaoNpm, versaoGithub);
    if (!versaoNova) {
        console.error('❌ Não foi possível determinar a versão mais recente.');
        console.error('💡 Verifique sua conexão e tente novamente.');
        process.exit(1);
    }

    console.log(`📌 Versão atual   : v${atual || '?'}`);
    if (versaoNpm)    console.log(`📦 Última no npm  : v${versaoNpm}`);
    if (versaoGithub) console.log(`🐙 Última no GitHub: v${versaoGithub}`);

    if (!atual || compararVersao(versaoNova, atual) <= 0) {
        console.log('\n✅ Você já está na versão mais recente!');
        process.exit(0);
    }

    console.log(`\n🆕 Nova versão disponível: v${versaoNova}\n`);

    if (!confirmar()) {
        console.log('💡 Atualização cancelada. Rode "mambas atualizar" quando quiser.');
        process.exit(0);
    }

    if (process.pkg) {
        await atualizarBinario(release);
    } else {
        atualizarViaNpm();
    }
}

module.exports = { atualizar, verificarAtualizacao };
