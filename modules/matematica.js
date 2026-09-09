// Módulo nativo matematica — funções matemáticas
module.exports = {
    PI: Math.PI,
    raiz: (n) => Math.sqrt(n),
    potencia: (base, exp) => Math.pow(base, exp),
    absoluto: (n) => Math.abs(n),
    arredondar: (n) => Math.round(n),
    teto: (n) => Math.ceil(n),
    chao: (n) => Math.floor(n),
    aleatorio: (min, max) => {
        if (min !== undefined && max !== undefined) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return Math.random();
    },
    seno: (n) => Math.sin(n),
    cosseno: (n) => Math.cos(n)
};
