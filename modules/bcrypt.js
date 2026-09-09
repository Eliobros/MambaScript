// Módulo nativo bcrypt — hashing de senhas com bcryptjs
function createBcryptModule() {
    let bcrypt;
    try {
        bcrypt = require('bcryptjs');
    } catch (e) {
        return new Proxy({}, {
            get: () => () => { throw new Error(`❌ Módulo "bcrypt" requer bcryptjs. Execute: npm install bcryptjs`); }
        });
    }
    return {
        hashSenha: (senha, rounds) => bcrypt.hashSync(senha, rounds || 10),
        verificar: (senha, hash) => bcrypt.compareSync(senha, hash),
        salt: (rounds) => bcrypt.genSaltSync(rounds || 10)
    };
}

module.exports = createBcryptModule;
