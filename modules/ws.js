// Módulo nativo ws — WebSocket (cliente e servidor)
function createWsModule(evaluator) {
    let WebSocket, WebSocketServer;
    try {
        WebSocket = require('ws').WebSocket;
        WebSocketServer = require('ws').WebSocketServer;
    } catch (e) {
        return new Proxy({}, {
            get: (target, prop) => {
                if (typeof prop === 'symbol' || prop === 'then' || prop === 'inspect') {
                    return undefined;
                }
                return () => {
                    throw new Error(`❌ Módulo "ws" requer ws. Execute: npm install ws`);
                };
            }
        });
    }

    return {
        // --- Servidor WebSocket ---
        criarServidor: () => {
            return {
                _wss: null,
                _callbackConexao: null,
                _callbackMensagem: null,
                _callbackFechar: null,
                _callbackErro: null,

                aoConectar: function(funcaoUsuario) {
                    this._callbackConexao = funcaoUsuario;
                    return this;
                },

                aoReceber: function(funcaoUsuario) {
                    this._callbackMensagem = funcaoUsuario;
                    return this;
                },

                aoFechar: function(funcaoUsuario) {
                    this._callbackFechar = funcaoUsuario;
                    return this;
                },

                aoErro: function(funcaoUsuario) {
                    this._callbackErro = funcaoUsuario;
                    return this;
                },

                escutar: function(porta) {
                    this._wss = new WebSocketServer({ port: porta });

                    this._wss.on('connection', (ws) => {
                        // Objeto cliente para enviar ao callback do usuário
                        const clienteMamba = {
                            enviar: (dados) => {
                                const msg = typeof dados === 'object' ? JSON.stringify(dados) : String(dados);
                                ws.send(msg);
                            },
                            fechar: () => ws.close(),
                            id: () => ws._socket ? ws._socket.remoteAddress : null,
                            ip: () => ws._socket ? ws._socket.remoteAddress : null
                        };

                        ws.on('message', (data) => {
                            let mensagem = data.toString();
                            try { mensagem = JSON.parse(mensagem); } catch {}

                            if (this._callbackMensagem && this._callbackMensagem._type === 'MambaFunction') {
                                evaluator.chamarFuncaoMamba(this._callbackMensagem, [mensagem, clienteMamba]);
                            }
                        });

                        ws.on('close', () => {
                            if (this._callbackFechar && this._callbackFechar._type === 'MambaFunction') {
                                evaluator.chamarFuncaoMamba(this._callbackFechar, [clienteMamba]);
                            }
                        });

                        ws.on('error', (err) => {
                            if (this._callbackErro && this._callbackErro._type === 'MambaFunction') {
                                evaluator.chamarFuncaoMamba(this._callbackErro, [err.message, clienteMamba]);
                            }
                        });

                        if (this._callbackConexao && this._callbackConexao._type === 'MambaFunction') {
                            evaluator.chamarFuncaoMamba(this._callbackConexao, [clienteMamba]);
                        }
                    });

                    console.log(`🔌 Servidor WebSocket ouvindo na porta ${porta}`);
                },

                fechar: function() {
                    if (this._wss) {
                        this._wss.close();
                        this._wss = null;
                    }
                },

                clientes: function() {
                    if (!this._wss) return 0;
                    let count = 0;
                    this._wss.clients.forEach(() => count++);
                    return count;
                },

                broadcast: function(dados) {
                    if (!this._wss) return;
                    const msg = typeof dados === 'object' ? JSON.stringify(dados) : String(dados);
                    this._wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(msg);
                        }
                    });
                }
            };
        },

        // --- Cliente WebSocket ---
        conectar: (url, opcoes) => {
            return new Promise((resolve, reject) => {
                try {
                    const ws = new WebSocket(url);
                    let callbackMensagem = null;
                    let callbackAberto = null;
                    let callbackFechar = null;
                    let callbackErro = null;

                    const clienteMamba = {
                        enviar: (dados) => {
                            const msg = typeof dados === 'object' ? JSON.stringify(dados) : String(dados);
                            ws.send(msg);
                        },
                        fechar: () => ws.close(),
                        estado: () => ws.readyState,
                        url: () => ws.url
                    };

                    ws.on('open', () => {
                        if (callbackAberto && callbackAberto._type === 'MambaFunction') {
                            evaluator.chamarFuncaoMamba(callbackAberto, [clienteMamba]);
                        }
                        resolve(clienteMamba);
                    });

                    ws.on('message', (data) => {
                        let mensagem = data.toString();
                        try { mensagem = JSON.parse(mensagem); } catch {}
                        if (callbackMensagem && callbackMensagem._type === 'MambaFunction') {
                            evaluator.chamarFuncaoMamba(callbackMensagem, [mensagem, clienteMamba]);
                        }
                    });

                    ws.on('close', () => {
                        if (callbackFechar && callbackFechar._type === 'MambaFunction') {
                            evaluator.chamarFuncaoMamba(callbackFechar, [clienteMamba]);
                        }
                    });

                    ws.on('error', (err) => {
                        if (callbackErro && callbackErro._type === 'MambaFunction') {
                            evaluator.chamarFuncaoMamba(callbackErro, [err.message, clienteMamba]);
                        }
                        reject(err);
                    });

                    // Expõe métodos para registar callbacks
                    clienteMamba.aoReceber = (funcao) => { callbackMensagem = funcao; return clienteMamba; };
                    clienteMamba.aoAbrir = (funcao) => { callbackAberto = funcao; return clienteMamba; };
                    clienteMamba.aoFechar = (funcao) => { callbackFechar = funcao; return clienteMamba; };
                    clienteMamba.aoErro = (funcao) => { callbackErro = funcao; return clienteMamba; };

                } catch (e) {
                    reject(e);
                }
            });
        }
    };
}

module.exports = createWsModule;
