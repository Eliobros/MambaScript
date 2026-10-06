// Módulo nativo criptografia — bcrypt + utilitários (base64 e HMAC)
const crypto = require('crypto');

const utilitarios = {
    paraBase64: (texto) =>
        Buffer.from(String(texto), 'utf8').toString('base64'),

    deBase64: (b64) =>
        Buffer.from(String(b64), 'base64').toString('utf8'),

    hmacSha256: (dados, segredo) => {
        if (segredo === undefined || segredo === null || segredo === '') {
            throw new Error("❌ hmacSha256 requer um segredo.");
        }
        return crypto
            .createHmac('sha256', String(segredo))
            .update(String(dados))
            .digest('base64');
    }
};

function createCriptografiaModule() {
    let bcrypt;
    try {
        bcrypt = require('bcrypt');
    } catch (e) {
        return new Proxy(utilitarios, {
            get: (target, prop) => {
                if (prop in target) return target[prop];
                if (typeof prop === 'symbol' || prop === 'then' || prop === 'inspect') {
                    return undefined;
                }
                return () => {
                    throw new Error(`❌ Módulo "criptografia" requer bcrypt. Execute: npm install bcrypt`);
                };
            }
        });
    }

    const CUSTO_MIN = 4;
    const CUSTO_MAX = 15;
    const CUSTO_PADRAO = 10;

    function validarCusto(custo) {
        const n = Number(custo);
        if (!Number.isInteger(n) || n < CUSTO_MIN || n > CUSTO_MAX) {
            throw new Error(`❌ Custo inválido. Use um número inteiro entre ${CUSTO_MIN} e ${CUSTO_MAX}.`);
        }
        return n;
    }

    function validarSenha(senha) {
        if (senha === undefined || senha === null || senha === '') {
            throw new Error("Senha é obrigatória.");
        }
    }

    return {
        ...utilitarios,

        // --- Versões assíncronas (recomendadas) ---
        gerarHash: async (senha, custo = CUSTO_PADRAO) => {
            try {
                validarSenha(senha);
                const custoFinal = validarCusto(custo);
                return await bcrypt.hash(String(senha), custoFinal);
            } catch (e) {
                throw new Error(`❌ Erro ao gerar hash de criptografia: ${e.message}`);
            }
        },

        comparar: async (senha, hash) => {
            try {
                if (!senha || !hash) {
                    throw new Error("Senha e Hash são obrigatórios para a comparação.");
                }
                return await bcrypt.compare(String(senha), String(hash));
            } catch (e) {
                throw new Error(`❌ Erro ao comparar criptografia: ${e.message}`);
            }
        },

        // --- Versões síncronas (bloqueiam o event loop) ---
        gerarHashSincrono: (senha, custo = CUSTO_PADRAO) => {
            try {
                validarSenha(senha);
                const custoFinal = validarCusto(custo);
                return bcrypt.hashSync(String(senha), custoFinal);
            } catch (e) {
                throw new Error(`❌ Erro ao gerar hash síncrono: ${e.message}`);
            }
        },

	paraBase64Url: (texto) =>
        Buffer.from(String(texto), 'utf8').toString('base64url'),

    hmacSha256Url: (dados, segredo) => {
        if (segredo === undefined || segredo === null || segredo === '') {
            throw new Error("❌ hmacSha256Url requer um segredo.");
        }
        return crypto
            .createHmac('sha256', String(segredo))
            .update(String(dados))
            .digest('base64url');
    },

        compararSincrono: (senha, hash) => {
            try {
                if (!senha || !hash) {
                    throw new Error("Senha e Hash são obrigatórios para a comparação.");
                }
                return bcrypt.compareSync(String(senha), String(hash));
            } catch (e) {
                throw new Error(`❌ Erro ao comparar síncrono: ${e.message}`);
            }
        }
    };
}

module.exports = createCriptografiaModule;
