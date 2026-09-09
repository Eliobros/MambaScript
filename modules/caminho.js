// Módulo nativo caminho — manipulação de caminhos de arquivo
const path = require('path');

module.exports = {
    juntar: (...partes) => path.join(...partes),
    diretorio: (caminho) => path.dirname(caminho),
    arquivo: (caminho) => path.basename(caminho),
    extensao: (caminho) => path.extname(caminho),
    absoluto: (caminho) => path.resolve(caminho)
};
