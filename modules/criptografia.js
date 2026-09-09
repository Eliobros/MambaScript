// Módulo nativo criptografia — hash de senhas avançado com bcrypt
function createCriptografiaModule() {
    let bcrypt;
    try {
        bcrypt = require('bcrypt');
    } catch (e) {
        return new Proxy({}, {
            get: (target, prop) => {
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
        // --- Versões assíncronas (recomendadas, não bloqueiam o event loop) ---
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

        // --- Versões síncronas (⚠️ bloqueiam o event loop, evite em rotas de alto tráfego) ---
        gerarHashSincrono: (senha, custo = CUSTO_PADRAO) => {
            try {
                validarSenha(senha);
                const custoFinal = validarCusto(custo);
                return bcrypt.hashSync(String(senha), custoFinal);
            } catch (e) {
                throw new Error(`❌ Erro ao gerar hash síncrono: ${e.message}`);
            }
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
