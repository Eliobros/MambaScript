// Módulo nativo psql — conexão e consulta PostgreSQL
function createPostgresModule() {
    let pg;
    try {
        pg = require('pg');
    } catch (e) {
        return new Proxy({}, {
            get: (target, prop) => {
                if (typeof prop === 'symbol' || prop === 'then' || prop === 'inspect') {
                    return undefined;
                }
                return () => {
                    throw new Error(`❌ Módulo "psql" requer pg. Execute: npm install pg`);
                };
            }
        });
    }

    let cliente = null;

    return {
        conectar: async (...args) => {
            try {
                let config;
                if (args.length === 1 && typeof args[0] === 'string') {
                    config = { connectionString: args[0] };
                } else {
                    const [host, usuario, senha, base, porta = 5432] = args;
                    config = { host, user: usuario, password: senha, database: base, port: porta };
                }
                cliente = new pg.Client(config);
                await cliente.connect();
                return { ok: true, mensagem: "Conexão estabelecida!" };
            } catch (e) {
                throw new Error(`❌ Erro ao conectar ao PostgreSQL: ${e.message}`);
            }
        },

        consultar: async (sql, parametros) => {
            if (!cliente) throw new Error(`❌ Chame bd.conectar() antes de consultar`);
            try {
                const resultado = await cliente.query(sql, parametros || []);
                return resultado.rows;
            } catch (e) {
                throw new Error(`❌ Erro na consulta: ${e.message}`);
            }
        },

        executar: async (sql, parametros) => {
            if (!cliente) throw new Error(`❌ Chame bd.conectar() antes de executar`);
            try {
                const resultado = await cliente.query(sql, parametros || []);
                return {
                    afetadas: resultado.rowCount || 0,
                    linhas: resultado.rows,
                    ok: (resultado.rowCount || 0) > 0
                };
            } catch (e) {
                throw new Error(`❌ Erro ao executar: ${e.message}`);
            }
        },

        fechar: async () => {
            if (cliente) {
                await cliente.end();
                cliente = null;
            }
        }
    };
}

module.exports = createPostgresModule;
