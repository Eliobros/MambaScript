// Módulo nativo crypto — hash e criptografia básica
function createCryptoModule() {
    const crypto = require('crypto');
    return {
        hash: (texto, algoritmo) => {
            return crypto.createHash(algoritmo || 'sha256').update(texto).digest('hex');
        },
        md5: (texto) => crypto.createHash('md5').update(texto).digest('hex'),
        sha256: (texto) => crypto.createHash('sha256').update(texto).digest('hex'),
        sha512: (texto) => crypto.createHash('sha512').update(texto).digest('hex'),
        aleatorio: (tamanho) => crypto.randomBytes(tamanho || 16).toString('hex')
    };
}

module.exports = createCryptoModule;
