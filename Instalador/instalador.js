#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Repositório central de pacotes no GitHub
const REPO_BASE = 'https://raw.githubusercontent.com/Eliobros/mambascript-pacotes/master/pacotes';
const REPO_API  = 'https://api.github.com/repos/Eliobros/mambascript-pacotes/contents/pacotes';

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

function get(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: { 'User-Agent': 'MambaScript-Instalador' }
        };
        https.get(url, options, (res) => {
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

    // Busca metadados do pacote
    let meta;
    try {
        const metaRaw = await get(`${REPO_BASE}/${nomePacote}/pacote.json`);
        meta = JSON.parse(metaRaw);
    } catch {
        console.error(`❌ Pacote "${nomePacote}" não encontrado no repositório.`);
        console.error(`💡 Use "mambas procurar" para ver pacotes disponíveis.`);
        process.exit(1);
    }

    // Baixa o index.ms do pacote
    let codigo;
    try {
        codigo = await get(`${REPO_BASE}/${nomePacote}/index.ms`);
    } catch {
        console.error(`❌ Erro ao baixar o código do pacote "${nomePacote}".`);
        process.exit(1);
    }

    // Salva na pasta modulos_mambas
    const destino = path.join(MODULOS_DIR, `${nomePacote}.ms`);
    fs.writeFileSync(destino, codigo);

    // Atualiza registro
    const registro = carregarRegistro();
    registro[nomePacote] = {
        versao: meta.versao || '1.0.0',
        descricao: meta.descricao || '',
        autor: meta.autor || '',
        instaladoEm: new Date().toISOString()
    };
    salvarRegistro(registro);

    console.log(`✅ Pacote "${nomePacote}" v${meta.versao} instalado com sucesso!`);
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
        console.log('💡 Use "mambas procurar" para ver pacotes disponíveis.');
        return;
    }

    console.log(`📦 Pacotes instalados (${pacotes.length}):\n`);
    for (const nome of pacotes) {
        const info = registro[nome];
        console.log(`  • ${nome} v${info.versao} — ${info.descricao}`);
    }
}

async function procurar() {
    console.log('🔍 Buscando pacotes disponíveis...\n');

    let conteudo;
    try {
        const raw = await get(REPO_API);
        conteudo = JSON.parse(raw);
    } catch {
        console.error('❌ Não foi possível conectar ao repositório de pacotes.');
        console.error('💡 Verifique sua conexão com a internet.');
        process.exit(1);
    }

    if (!Array.isArray(conteudo) || conteudo.length === 0) {
        console.log('📭 Nenhum pacote disponível ainda.');
        return;
    }

    const registro = carregarRegistro();
    console.log(`📦 Pacotes disponíveis (${conteudo.length}):\n`);

    for (const item of conteudo) {
        if (item.type === 'dir') {
            const instalado = registro[item.name] ? ' ✅ instalado' : '';
            // Tenta buscar metadados
            try {
                const metaRaw = await get(`${REPO_BASE}/${item.name}/pacote.json`);
                const meta = JSON.parse(metaRaw);
                console.log(`  • ${item.name} v${meta.versao} — ${meta.descricao}${instalado}`);
            } catch {
                console.log(`  • ${item.name}${instalado}`);
            }
        }
    }
}

function ajuda() {
    console.log(`
🐍 MambaScript — Gestor de Pacotes

Uso:
  mambas <arquivo.ms>          Executa um arquivo MambaScript
  mambas instalar <pacote>     Instala um pacote
  mambas remover <pacote>      Remove um pacote instalado
  mambas listar                Lista pacotes instalados
  mambas procurar              Lista pacotes disponíveis no repositório
  mambas ajuda                 Mostra esta mensagem
    `);
}

// ─────────────────────────────────────────────
// Exporta os comandos
// ─────────────────────────────────────────────

module.exports = { instalar, remover, listar, procurar, ajuda };
