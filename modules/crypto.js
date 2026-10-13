// Módulo nativo crypto — hash e criptografia básica
function createCryptoModule() {
    const crypto = require('crypto');

    const ordenar = (v) => {
        if (Array.isArray(v)) return v.map(ordenar);
        if (v && typeof v === 'object') {
            return Object.keys(v).sort().reduce((o, k) => { o[k] = ordenar(v[k]); return o; }, {});
        }
        return v;
    };

    return {
        hash: (texto, algoritmo) => {
            return crypto.createHash(algoritmo || 'sha256').update(texto).digest('hex');
        },
        md5: (texto) => crypto.createHash('md5').update(texto).digest('hex'),
        sha256: (texto) => crypto.createHash('sha256').update(texto).digest('hex'),
        sha512: (texto) => crypto.createHash('sha512').update(texto).digest('hex'),
        aleatorio: (tamanho) => crypto.randomBytes(tamanho || 16).toString('hex'),

        hmac: (texto, segredo, algoritmo) => {
            return crypto.createHmac(algoritmo || 'sha256', String(segredo)).update(texto).digest('hex');
        },

        assinaturaValida: (corpo, assinatura, segredo) => {
            if (!corpo || !assinatura || !segredo) return false;
            const canonico = JSON.stringify(ordenar(corpo));
            const esperado = crypto.createHmac('sha256', String(segredo)).update(canonico).digest('hex');
            const a = Buffer.from(esperado);
            const b = Buffer.from(String(assinatura));
            return a.length === b.length && crypto.timingSafeEqual(a, b);
        }
    };
}

module.exports = createCryptoModule;
