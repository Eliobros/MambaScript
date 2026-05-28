const fs = require('fs');
const path = require('path');
const tar = require('tar');
const https = require('https');
const http = require('http');
const FormData = require('form-data');

const REGISTRY_URL = process.env.MAMBAS_REGISTRY || 'https://habibo-mambascript-registry.mozhost.shop';
const CONFIG_FILE = 'mamba.json';
const IGNORE_LIST = ['node_modules', '.git', 'modulos_mambas', '.env', '*.log'];

function lerConfig() {
    const configPath = path.join(process.cwd(), CONFIG_FILE);
    if (!fs.existsSync(configPath)) {
        console.error(`❌ Arquivo ${CONFIG_FILE} não encontrado.`);
        console.error(`💡 Crie um ${CONFIG_FILE} na raiz do seu pacote:`);
        console.error(`   { "nome": "meu-pacote", "versao": "1.0.0", "descricao": "..." }`);
        process.exit(1);
    }
    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch {
        console.error(`❌ Erro ao ler ${CONFIG_FILE} — verifique o JSON.`);
        process.exit(1);
    }
}

function deveIgnorar(filePath) {
    return IGNORE_LIST.some(ignorado => filePath.includes(ignorado));
}

async function criarTgz(config) {
    const tmpDir = path.join(require('os').tmpdir(), 'mambas-publish');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const tgzPath = path.join(tmpDir, `${config.nome}-${config.versao}.tgz`);

    // Coletar ficheiros a empacotar
    const ficheiros = [];
    function coletar(dir, base = '') {
        for (const item of fs.readdirSync(dir)) {
            const fullPath = path.join(dir, item);
            const relPath = base ? `${base}/${item}` : item;
            if (deveIgnorar(relPath)) continue;
            if (fs.statSync(fullPath).isDirectory()) {
                coletar(fullPath, relPath);
            } else {
                ficheiros.push(relPath);
            }
        }
    }
    coletar(process.cwd());

    console.log(`📦 Empacotando ${ficheiros.length} ficheiros...`);

    await tar.create(
        { gzip: true, file: tgzPath, cwd: process.cwd() },
        ficheiros
    );

    return tgzPath;
}

function obterToken() {
    const tokenPath = path.join(require('os').homedir(), '.mambas', 'token');
    if (!fs.existsSync(tokenPath)) {
        console.error('❌ Não autenticado.');
        console.error('💡 Use: mambas login <token>');
        process.exit(1);
    }
    return fs.readFileSync(tokenPath, 'utf-8').trim();
}

async function publicar() {
    const config = lerConfig();

    if (!config.nome || !config.versao) {
        console.error('❌ mamba.json precisa ter "nome" e "versao".');
        process.exit(1);
    }

    console.log(`🚀 Publicando ${config.nome}@${config.versao}...`);

    const tgzPath = await criarTgz(config);
    const token = obterToken();

    // Enviar pro registry
    const form = new FormData();
    form.append('nome', config.nome);
    form.append('versao', config.versao);
    form.append('descricao', config.descricao || '');
    form.append('arquivo', fs.createReadStream(tgzPath), {
        filename: path.basename(tgzPath),
        contentType: 'application/gzip'
    });

    const url = new URL(`${REGISTRY_URL}/pacotes/publicar`);
    const client = url.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
        const options = {
            hostname: url.hostname,
            port: url.port || (url.protocol === 'https:' ? 443 : 80),
            path: url.pathname,
            method: 'POST',
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        };

        const req = client.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.sucesso) {
                        console.log(`✅ ${result.mensagem}`);
                        console.log(`🌐 ${REGISTRY_URL}/pacotes/${config.nome}`);
                    } else {
                        console.error(`❌ Erro: ${result.erro}`);
                    }
                } catch {
                    console.error('❌ Resposta inválida do registry.');
                }
                // Limpar tgz temporário
                fs.unlinkSync(tgzPath);
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`❌ Erro de conexão: ${e.message}`);
            reject(e);
        });

        form.pipe(req);
    });
}

function salvarToken(token) {
    const dir = path.join(require('os').homedir(), '.mambas');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'token'), token);
    console.log('✅ Token salvo com sucesso!');
}

module.exports = { publicar, salvarToken };