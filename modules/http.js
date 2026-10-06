// Módulo nativo http — requisições HTTP e servidor
function createHttpModule(evaluator) {
    let fetch;
    try {
        fetch = globalThis.fetch || require('node-fetch');
    } catch (e) {
        fetch = null;
    }

    if (!fetch) {
        return new Proxy({}, {
            get: (target, prop) => {
                if (typeof prop === 'symbol' || prop === 'then' || prop === 'inspect') {
                    return undefined;
                }
                return () => {
                    throw new Error(`❌ Módulo "http" requer node-fetch. Execute: npm install node-fetch`);
                };
            }
        });
    }

    const validarUrl = (url) => {
        try {
            const urlObj = new URL(url);
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                throw new Error(`Protocolo "${urlObj.protocol}" não permitido. Use http: ou https:.`);
            }
            return urlObj;
        } catch (e) {
            if (e.message.includes('Protocolo')) throw e;
            throw new Error(`URL inválida: "${url}" — ${e.message}`);
        }
    };

    const request = async (method, url, corpo, cabecalhos) => {
        validarUrl(url);

        const headers = {};
        if (cabecalhos && typeof cabecalhos === 'object') {
            for (const [k, v] of Object.entries(cabecalhos)) headers[k] = v;
        }

        const options = { method, headers };
        if (corpo !== undefined && corpo !== null) {
            options.body = typeof corpo === 'object' ? JSON.stringify(corpo) : String(corpo);
            if (!headers['Content-Type'] && !headers['content-type']) {
                headers['Content-Type'] = 'application/json';
            }
        }

        try {
            const resposta = await fetch(url, options);
            const texto = await resposta.text();
            let dados;
            try { dados = JSON.parse(texto); } catch { dados = texto; }
            return { status: resposta.status, corpo: dados, texto, ok: resposta.ok };
        } catch (e) {
            throw new Error(`Erro HTTP ao ${method} ${url}: ${e.message}`);
        }
    };

    return {
        get: (url, cabecalhos) => request('GET', url, null, cabecalhos),
        post: (url, corpo, cabecalhos) => request('POST', url, corpo, cabecalhos),
        put: (url, corpo, cabecalhos) => request('PUT', url, corpo, cabecalhos),
        apagar: (url, cabecalhos) => request('DELETE', url, null, cabecalhos),

        criarServidor: () => {
            return {
                callbackMamba: null,
                aoReceber: function(funcaoUsuario) { this.callbackMamba = funcaoUsuario; },
                escutar: function(porta) {
                    const httpNativo = require('http');
                    const servidorNode = httpNativo.createServer((req, res) => {
                        let corpoRequisicao = '';
                        req.on('data', chunk => { corpoRequisicao += chunk; });
                        req.on('end', async () => {
                            try {
                                let corpoParseado = corpoRequisicao;
                                try { corpoParseado = JSON.parse(corpoRequisicao); } catch {}

                                // Normaliza "//" ou "///x" para "/" ou "/x"
                                const caminhoBruto = (req.url || '/').replace(/^\/{2,}/, '/');

                                let urlObj;
                                try {
                                    urlObj = new URL(caminhoBruto, `http://localhost:${porta}`);
                                } catch (e) {
                                    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                                    res.end('Bad Request');
                                    return;
                                }

                                const params = {};
                                urlObj.searchParams.forEach((val, chave) => { params[chave] = val; });

                                const requisicaoMamba = {
                                    url: urlObj.pathname,
                                    metodo: req.method,
                                    corpo: corpoParseado,
                                    params: params,
                                    cabecalhos: req.headers
                                };

                                const respostaMamba = {
                                    enviar: (status, conteudo) => {
                                        const tipo = typeof conteudo === 'object' ? 'application/json' : 'text/plain; charset=utf-8';
                                        const saida = typeof conteudo === 'object' ? JSON.stringify(conteudo) : String(conteudo);
                                        res.writeHead(status, { 'Content-Type': tipo });
                                        res.end(saida);
                                    },
                                    json: (status, conteudo) => {
                                        res.writeHead(status, { 'Content-Type': 'application/json' });
                                        res.end(JSON.stringify(conteudo));
                                    },
                                    cabecalho: (chave, valor) => { res.setHeader(chave, valor); },
                                    redirecionar: (url) => { res.writeHead(302, { 'Location': url }); res.end(); }
                                };

                                if (this.callbackMamba && this.callbackMamba._type === 'MambaFunction') {
                                    await evaluator.chamarFuncaoMamba(this.callbackMamba, [requisicaoMamba, respostaMamba]);
                                }
                            } catch (e) {
                                console.error('[HTTP] Erro ao processar pedido:', e.message);
                                if (!res.headersSent) {
                                    res.writeHead(500, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ erro: 'Erro interno do servidor' }));
                                } else {
                                    res.end();
                                }
                            }
                        });
                    });

                    // Pedidos malformados não derrubam o servidor
                    servidorNode.on('clientError', (err, socket) => {
                        if (socket.writable) {
                            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
                        } else {
                            socket.destroy();
                        }
                    });

                    servidorNode.listen(porta);
                }
            };
        }
    };
}

module.exports = createHttpModule;
