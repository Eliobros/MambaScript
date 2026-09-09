// Módulo nativo sistema — informações e comandos do sistema
function createSistemaModule() {
    const { execSync } = require('child_process');
    return {
        plataforma: () => process.platform,
        variavel: (nome) => process.env[nome] || null,
        executar: (cmd) => {
            try {
                return execSync(cmd, { encoding: 'utf-8' }).trim();
            } catch (e) {
                throw new Error(`❌ Erro ao executar comando: ${e.message}`);
            }
        },
        sair: (codigo) => process.exit(codigo || 0),
        args: () => process.argv.slice(2),
        pid: () => process.pid,
        memoria: () => process.memoryUsage()
    };
}

module.exports = createSistemaModule;
