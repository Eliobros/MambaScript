#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const tar = require('tar');
const os = require('os');



// Registry oficial MambaScript
//7const REGISTRY_URL = process.env.MAMBAS_REGISTRY || 'http://localhost:3004';

const REGISTRY_URL = process.env.MAMBAS_REGISTRY || 'https://habibo-mambascript-registry.mozhost.shop';

// Pasta de módulos do projeto atual
const MODULOS_DIR = path.join(process.cwd(), 'modulos_mambas');

// Arquivo de registro de pacotes instalados
const REGISTRO_PATH = path.join(MODULOS_DIR, '.registro.json');

// ─────────────────────────────────────────────
// Utilitários
// ─────────────────────────────────────────────

function garantirPasta() {
    if (!fs.existsSync(MODULOS_DIR)) {
        fs.mkdirSync(MODULOS_DIR, { recursive: true });
    }
}

function carregarRegistro() {
    if (!fs.existsSync(REGISTRO_PATH)) return {};
    try {
        return JSON.parse(fs.readFileSync(REGISTRO_PATH, 'utf-8'));
    } catch {
        return {};
    }
}

function salvarRegistro(registro) {
    fs.writeFileSync(REGISTRO_PATH, JSON.stringify(registro, null, 2));
}

function get(url, token = null) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const headers = { 'User-Agent': 'MambaScript-Instalador' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const options = { headers };
        client.get(url, options, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return get(res.headers.location, token).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(data);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
        }).on('error', reject);
    });
}

function download(url, destino) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: { 'User-Agent': 'MambaScript-Instalador' }
        };
        client.get(url, options, (res) => {
            // Seguir redirects
            if (res.statusCode === 301 || res.statusCode === 302) {
                return download(res.headers.location, destino).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            const file = fs.createWriteStream(destino);
            res.pipe(file);
            file.on('finish', () => file.close(resolve));
            file.on('error', reject);
        }).on('error', reject);
    });
}

// ─────────────────────────────────────────────
// Comandos
// ─────────────────────────────────────────────

async function instalar(nomePacote) {
    if (!nomePacote) {
        console.error('❌ Uso: mambas instalar <pacote>');
        process.exit(1);
    }

    console.log(`📦 Instalando pacote: ${nomePacote}...`);
    garantirPasta();

    // Buscar metadados
    let meta = { versao: '1.0.0', descricao: '' };
    try {
        const lista = JSON.parse(await get(`${REGISTRY_URL}/pacotes`));
        const encontrado = lista.find(p => p.nome === nomePacote);
        if (!encontrado) {
            console.error(`❌ Pacote "${nomePacote}" não encontrado.`);
            console.error(`💡 Use "mambas procurar" para ver pacotes disponíveis.`);
            process.exit(1);
        }
        meta = encontrado;
    } catch (e) {
        console.error(`❌ Não foi possível conectar ao registry: ${e.message}`);
        process.exit(1);
    }

    // Baixar .tgz
    const tmpPath = path.join(os.tmpdir(), `${nomePacote}.tgz`);
    try {
        await download(`${REGISTRY_URL}/pacotes/${nomePacote}/download`, tmpPath);
    } catch (e) {
        console.error(`❌ Erro ao baixar: ${e.message}`);
        process.exit(1);
    }

    // Extrair em modulos_mambas/<nome>/
    const destino = path.join(MODULOS_DIR, nomePacote);
    fs.mkdirSync(destino, { recursive: true });

    try {
        await tar.extract({ file: tmpPath, cwd: destino });
        fs.unlinkSync(tmpPath);
    } catch (e) {
        console.error(`❌ Erro ao extrair: ${e.message}`);
        process.exit(1);
    }

    // Atualizar registro
    const registro = carregarRegistro();
    registro[nomePacote] = {
        versao: meta.versao || '1.0.0',
        descricao: meta.descricao || '',
        instaladoEm: new Date().toISOString()
    };
    salvarRegistro(registro);

    console.log(`✅ Pacote "${nomePacote}" v${meta.versao} instalado!`);
    console.log(`💡 Use: importar ${nomePacote} de "${nomePacote}"`);
}

async function remover(nomePacote) {
    if (!nomePacote) {
        console.error('❌ Uso: mambas remover <pacote>');
        process.exit(1);
    }

    const registro = carregarRegistro();

    if (!registro[nomePacote]) {
        console.error(`❌ Pacote "${nomePacote}" não está instalado.`);
        process.exit(1);
    }

    const ficheiro = path.join(MODULOS_DIR, `${nomePacote}.ms`);
    if (fs.existsSync(ficheiro)) {
        fs.unlinkSync(ficheiro);
    }

    delete registro[nomePacote];
    salvarRegistro(registro);

    console.log(`🗑️  Pacote "${nomePacote}" removido com sucesso!`);
}

function listar() {
    const registro = carregarRegistro();
    const pacotes = Object.keys(registro);

    if (pacotes.length === 0) {
        console.log('📭 Nenhum pacote instalado.');
        console.log('💡 Use "mambas procurar" para ver pacotes disponíveis no registry.');
        return;
    }

    console.log(`📦 Pacotes instalados (${pacotes.length}):\n`);
    for (const nome of pacotes) {
        const info = registro[nome];
        console.log(`  • ${nome} v${info.versao} — ${info.descricao}`);
    }
}

async function procurar(termo) {
    console.log('🔍 Buscando pacotes disponíveis...\n');

    let pacotes;
    try {
        pacotes = JSON.parse(await get(`${REGISTRY_URL}/pacotes`));
    } catch (e) {
        console.error(`❌ Não foi possível conectar ao registry: ${e.message}`);
        console.error('💡 Verifique sua conexão com a internet.');
        process.exit(1);
    }

    if (!pacotes || pacotes.length === 0) {
        console.log('📭 Nenhum pacote disponível ainda.');
        return;
    }

    // Filtrar por termo de busca se fornecido
    const resultado = termo
        ? pacotes.filter(p =>
            p.nome.includes(termo) ||
            (p.descricao && p.descricao.includes(termo))
          )
        : pacotes;

    if (resultado.length === 0) {
        console.log(`📭 Nenhum pacote encontrado para "${termo}".`);
        return;
    }

    const registro = carregarRegistro();
    console.log(`📦 Pacotes disponíveis (${resultado.length}):\n`);
    for (const p of resultado) {
        const instalado = registro[p.nome] ? ' ✅ instalado' : '';
        console.log(`  • ${p.nome} v${p.versao} — ${p.descricao}${instalado}`);
    }
}

async function whoami() {
    const tokenPath = path.join(require('os').homedir(), '.mambas', 'token');
    if (!fs.existsSync(tokenPath)) {
        console.error('❌ Não autenticado.');
        console.error('💡 Use: mambas login <token>');
        process.exit(1);
    }

    const token = fs.readFileSync(tokenPath, 'utf-8').trim();

    try {
        const raw = await get(`${REGISTRY_URL}/me`, token);
        const data = JSON.parse(raw);
        console.log(`👤 Username : ${data.username}`);
        console.log(`📧 Email    : ${data.email}`);
        console.log(`📅 Membro desde: ${new Date(data.criadoEm).toLocaleDateString('pt-BR')}`);
    } catch (e) {
        console.error(`❌ Erro: ${e.message}`);
    }
}

function ajuda() {
    console.log(`
🐍 MambaScript — Gestor de Pacotes

Uso:
  mambas <arquivo.ms>              Executa um arquivo MambaScript
  mambas instalar <pacote>         Instala um pacote do registry
  mambas remover <pacote>          Remove um pacote instalado
  mambas listar                    Lista pacotes instalados localmente
  mambas procurar [termo]          Busca pacotes no registry
  mambas ajuda                     Mostra esta mensagem

Registry atual: ${REGISTRY_URL}
💡 Para usar outro registry: MAMBAS_REGISTRY=https://... mambas instalar <pacote>
    `);
}

// ─────────────────────────────────────────────
// Exporta os comandos
// ─────────────────────────────────────────────

module.exports = { instalar, remover, listar, procurar, ajuda, whoami };
