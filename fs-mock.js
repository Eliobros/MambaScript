// fs-mock.js
// Esta variável global será alimentada pelo Kotlin com os arquivos salvos no celular
globalThis.sistemaDeArquivosVirtual = {};

module.exports = {
    existsSync(caminho) {
        // Verifica se o caminho existe dentro do nosso JSON virtual
        return caminho in globalThis.sistemaDeArquivosVirtual;
    },
    readFileSync(caminho, encoding) {
        if (caminho in globalThis.sistemaDeArquivosVirtual) {
            return globalThis.sistemaDeArquivosVirtual[caminho];
        }
        throw new Error(`Erro MambaScript: Arquivo não encontrado no sistema virtual: ${caminho}`);
    }
};
