// Módulo nativo mysql — conexão e consulta MySQL
function createMysqlModule() {
    let mysql2;

    try {
        mysql2 = require("mysql2/promise");
    } catch (e) {
        return new Proxy(
            {},
            {
                get: () => () => {
                    throw new Error(
                        '❌ Módulo "mysql" requer mysql2. Execute: npm install mysql2'
                    );
                }
            }
        );
    }

    let conexao = null;

    function garantirConexao() {
        if (!conexao) {
            throw new Error(
                "❌ Nenhuma conexão ativa. Chame bd.conectar() antes desta operação."
            );
        }
    }

    return {
        // conectar(host, usuario, senha, base, porta = 3306)
        conectar: async (host, usuario, senha, base, porta = 3306) => {
            try {
                // Fecha uma conexão anterior antes de abrir outra.
                if (conexao) {
                    await conexao.end();
                    conexao = null;
                }

                conexao = await mysql2.createConnection({
                    host,
                    user: usuario,
                    password: senha,
                    database: base,
                    port: Number(porta),
                    connectTimeout: 10000
                });

                return {
                    ok: true,
                    mensagem: "Conexão MySQL estabelecida!"
                };
            } catch (e) {
                conexao = null;

                return {
                    ok: false,
                    erro: `Erro ao conectar ao MySQL: ${e.message}`
                };
            }
        },

        // consultar(sql, parametros)
        // Use para SELECT e outras consultas que retornam linhas.
        consultar: async (sql, parametros = []) => {
            garantirConexao();

            try {
                const [linhas] = await conexao.execute(sql, parametros);
                return linhas;
            } catch (e) {
                throw new Error(`❌ Erro na consulta MySQL: ${e.message}`);
            }
        },

        // executar(sql, parametros)
        // Use para INSERT, UPDATE, DELETE e operações que alteram dados.
        executar: async (sql, parametros = []) => {
            garantirConexao();

            try {
                const [resultado] = await conexao.execute(sql, parametros);

                return {
                    ok: true,
                    afetadas: resultado.affectedRows || 0,
                    inseridoId: resultado.insertId || 0,
                    alteradas: resultado.changedRows || 0
                };
            } catch (e) {
                throw new Error(`❌ Erro ao executar comando MySQL: ${e.message}`);
            }
        },

        // verificarConexao()
        verificarConexao: async () => {
            if (!conexao) {
                return false;
            }

            try {
                await conexao.ping();
                return true;
            } catch (e) {
                conexao = null;
                return false;
            }
        },

        // fechar()
        fechar: async () => {
            if (!conexao) {
                return {
                    ok: true,
                    mensagem: "Não havia conexão MySQL ativa."
                };
            }

            try {
                await conexao.end();
                conexao = null;

                return {
                    ok: true,
                    mensagem: "Conexão MySQL encerrada."
                };
            } catch (e) {
                conexao = null;

                return {
                    ok: false,
                    erro: `Erro ao fechar conexão MySQL: ${e.message}`
                };
            }
        }
    };
}

module.exports = createMysqlModule;
