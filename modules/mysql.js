// Módulo nativo mysql — conexão e consulta MySQL
function createMysqlModule() {
    let mysql2;
    try {
        mysql2 = require('mysql2/promise');
    } catch (e) {
        return new Proxy({}, {
            get: () => () => { throw new Error(`❌ Módulo "mysql" requer mysql2. Execute: npm install mysql2`); }
        });
    }

    let conexao = null;

    return {
        conectar: async (host, usuario, senha, base, porta = 3306) => {
            try {
                conexao = await mysql2.createConnection({
                    host,
                    user: usuario,
                    password: senha,
                    database: base,
                    port: porta
                });
                return { ok: true, mensagem: "Conexão estabelecida!" };
            } catch (e) {
                throw new Error(`❌ Erro ao conectar ao MySQL: ${e.message}`);
            }
        },

        consultar: async (sql, parametros) => {
            if (!conexao) throw new Error(`❌ Chame bd.conectar() antes de consultar`);
            try {
                const [linhas] = await conexao.execute(sql, parametros || []);
                return linhas;
            } catch (e) {
                throw new Error(`❌ Erro na consulta: ${e.message}`);
            }
        },

        executar: async (sql, parametros) => {
            if (!conexao) throw new Error(`❌ Chame bd.executar() antes de executar`);
            try {
                const [resultado] = await conexao.execute(sql, parametros || []);
                return {
                    afetadas: resultado.affectedRows,
                    inseridoId: resultado.insertId,
                    ok: resultado.affectedRows > 0
                };
            } catch (e) {
                throw new Error(`❌ Erro ao executar: ${e.message}`);
            }
        },

        fechar: async () => {
            if (conexao) {
                await conexao.end();
                conexao = null;
            }
        }
    };
}

module.exports = createMysqlModule;
