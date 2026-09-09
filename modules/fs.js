// Módulo nativo fs — operações de arquivo do sistema
const fs = require('fs');

module.exports = {
    ler: (arquivo) => {
        try {
            return fs.readFileSync(arquivo, 'utf-8');
        } catch (e) {
            throw new Error(`❌ Erro ao ler arquivo: ${e.message}`);
        }
    },
    escrever: (arquivo, conteudo) => {
        try {
            fs.writeFileSync(arquivo, conteudo, 'utf-8');
        } catch (e) {
            throw new Error(`❌ Erro ao escrever arquivo: ${e.message}`);
        }
    },
    existe: (arquivo) => fs.existsSync(arquivo),
    apagar: (arquivo) => {
        try {
            fs.unlinkSync(arquivo);
        } catch (e) {
            throw new Error(`❌ Erro ao apagar arquivo: ${e.message}`);
        }
    }
};
