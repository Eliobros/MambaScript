class Evaluator {
    constructor(filePath) {
        this.filePath = filePath || process.cwd();
        this.variables = {};
        this.functions = {};
        this.hasBreaked = false;
        this.hasContinued = false;
        this.returnValue = null;
        this.builtinFunctions = {
            'hoje': this.createDateObject.bind(this),
            'ler': this.lerInput.bind(this),
            'json_ler': this.jsonLer.bind(this),
            'json_texto': this.jsonTexto.bind(this),
            'json_escrever': this.jsonEscrever.bind(this)
        };
        this.builtinModules = {
            'fs': this.createFsModule(),
            'matematica': this.createMathModule(),
            'caminho': this.createPathModule(),
            'http': this.createHttpModule(this),
            'mysql': this.createMysqlModule()
        };
    }

    async execute(ast) {
        for (const statement of ast.body) {
            await this.executeStatement(statement);
        }
    }

    async chamarFuncaoMamba(func, argumentosPassados) {
        const oldVars = { ...this.variables };
        const oldReturnValue = this.returnValue;
        this.returnValue = null;
        this.hasReturned = false;

        for (let i = 0; i < func.params.length; i++) {
            this.variables[func.params[i]] = argumentosPassados[i];
        }

        for (const stmt of func.body) {
            await this.executeStatement(stmt);
            if (this.hasReturned) break;
        }

        const result = this.returnValue;
        this.variables = oldVars;
        this.returnValue = oldReturnValue;
        this.hasReturned = false;

        return result;
    }

    async executeStatement(node) {
        switch (node.type) {
            case 'Print':
                const printValue = await this.evaluate(node.value);
                if (printValue && printValue._type === 'DateObject') {
                    console.log(`Data: ${printValue.mostrarData()} às ${printValue.mostrarHora()}`);
                } else {
                    console.log(printValue);
                }
                break;
                
            case 'ImportNamed':
    await this.executeImportNamed(node);
    break;

            case 'VarDeclaration':
                const varValue = await this.evaluate(node.value);
                this.variables[node.name] = varValue;
                break;

            case 'Assignment': {
    const valor = await this.evaluate(node.value);

    if (node.name.type === 'IndexAccess') {
        const obj = await this.evaluate(node.name.object);
        const chave = await this.evaluate(node.name.index);
        obj[chave] = valor;
        return;
    }

    if (node.name.type === 'PropertyAccess') {
        const obj = await this.evaluate(node.name.object);
        obj[node.name.property] = valor;
        return;
    }

    if (node.name.type === 'Identifier') {
        this.variables[node.name.name] = valor;
        return;
    }

    if (typeof node.name === 'string') {
        this.variables[node.name] = valor;
        return;
    }

    throw new Error(`Assignment inválido`);
}
break
                
                case 'Break':
    this.hasBreaked = true;
    return;

case 'Continue':
    this.hasContinued = true;
    return;

case 'Switch':
    const switchValue = await this.evaluate(node.value);
    let matched = false;

    for (const caso of node.cases) {
        const caseValue = await this.evaluate(caso.value);
        if (switchValue === caseValue) matched = true;

        if (matched) {
            for (const stmt of caso.body) {
                await this.executeStatement(stmt);
                if (this.hasBreaked) { this.hasBreaked = false; return; }
                if (this.hasReturned) return;
            }
        }
    }

    if (!matched && node.defaultBody) {
        for (const stmt of node.defaultBody) {
            await this.executeStatement(stmt);
            if (this.hasBreaked) { this.hasBreaked = false; return; }
            if (this.hasReturned) return;
        }
    }
    break;

            case 'If':
                if (await this.evaluate(node.condition)) {
                    for (const stmt of node.body) {
                        await this.executeStatement(stmt);
                        if (this.hasReturned) return;
                    }
                } else if (node.elseBody) {
                    for (const stmt of node.elseBody) {
                        await this.executeStatement(stmt);
                        if (this.hasReturned) return;
                    }
                }
                break;

            case 'While':
    while (await this.evaluate(node.condition)) {
        for (const stmt of node.body) {
            await this.executeStatement(stmt);
            if (this.hasContinued) break; // sai do for interno, relança o while
            if (this.hasBreaked || this.hasReturned) break;
        }
        if (this.hasContinued) { this.hasContinued = false; continue; }
        if (this.hasBreaked) { this.hasBreaked = false; break; }
        if (this.hasReturned) return;
    }
    break;

            case 'FunctionDeclaration':
                this.functions[node.name] = {
                    params: node.params,
                    body: node.body
                };
                break;

            case 'Return':
                this.returnValue = await this.evaluate(node.value);
                this.hasReturned = true;
                break;

            case 'For':
    const startVal = await this.evaluate(node.start);
    const endVal = await this.evaluate(node.end);
    for (let i = startVal; i <= endVal; i++) {
        this.variables[node.varName] = i;
        for (const stmt of node.body) {
            await this.executeStatement(stmt);
            if (this.hasContinued) break;
            if (this.hasBreaked || this.hasReturned) break;
        }
        if (this.hasContinued) { this.hasContinued = false; continue; }
        if (this.hasBreaked) { this.hasBreaked = false; break; }
        if (this.hasReturned) return;
    }
    break;
            case 'Import':
                await this.executeImport(node);
                break;

            case 'ExpressionStatement':
                await this.evaluate(node.expression);
                break;

            case 'TryCatch':
                try {
                    for (const stmt of node.body) {
                        await this.executeStatement(stmt);
                        if (this.hasReturned) return;
                    }
                } catch (e) {
                    this.variables[node.errorVar] = e.message;
                    for (const stmt of node.catchBody) {
                        await this.executeStatement(stmt);
                        if (this.hasReturned) return;
                    }
                }
                break;

            default:
                throw new Error(`Statement desconhecido: ${node.type}`);
        }
    }

    async evaluate(node) {
        if (!node) throw new Error('Nó inválido');

        switch (node.type) {
            case 'Number':
                return node.value;

            case 'String':
                return node.value;

            case 'Boolean':
                return node.value;

            case 'Null':
                return null;

            case 'Identifier':
                if (!(node.name in this.variables)) {
                    throw new Error(`Variável não definida: ${node.name}`);
                }
                return this.variables[node.name];

            case 'ArrayLiteral':
                const elements = [];
                for (const el of node.elements) {
                    elements.push(await this.evaluate(el));
                }
                return elements;

            case 'ObjectLiteral':
                const objectLiteral = {};
                for (const [key, valueNode] of Object.entries(node.properties)) {
                    objectLiteral[key] = await this.evaluate(valueNode);
                }
                return objectLiteral;

            case 'FunctionLiteral':
                return {
                    _type: 'MambaFunction',
                    params: node.params,
                    body: node.body
                };

            case 'ArrayAccess': {
    const array = await this.evaluate(node.array);
    const index = await this.evaluate(node.index);

    if (Array.isArray(array)) {
        if (typeof index !== 'number') throw new Error('Índice deve ser um número');
        if (index < 0 || index >= array.length) throw new Error(`Índice ${index} fora dos limites`);
        return array[index];
    }

    if (typeof array === 'object' && array !== null) {
        return array[index];
    }

    throw new Error('Tentativa de acessar índice em não-array ou objeto');
}

            case 'PropertyAccess': {
    const object = await this.evaluate(node.object);

    if (object === null || object === undefined) {
        throw new Error(`Tentativa de acessar propriedade "${node.property}" em valor nulo`);
    }

    // Atalho para .tamanho em arrays e strings
    if (node.property === 'tamanho') {
        if (Array.isArray(object) || typeof object === 'string') {
            return object.length;
        }
    }

    if (typeof object === 'object' || typeof object === 'function') {
        return object[node.property];
    }

    return object[node.property];
}

            case 'BinaryOp':
                const left = await this.evaluate(node.left);
                const right = await this.evaluate(node.right);
                if (node.operator === 'PLUS') {
                    if (typeof left === 'number' && typeof right === 'number') return left + right;
                    if (typeof left === 'string' || typeof right === 'string') return String(left) + String(right);
                    throw new Error(`Erro de Tipo: Não é possível somar ${typeof left} com ${typeof right}.`);
                }
                if (typeof left !== 'number' || typeof right !== 'number') {
                    throw new Error(`Operação ${node.operator} permitida apenas entre números.`);
                }
                switch (node.operator) {
                    case 'MINUS': return left - right;
                    case 'MULT': return left * right;
                    case 'DIV': return left / right;
                    default: throw new Error(`Operador desconhecido: ${node.operator}`);
                }

            case 'Comparison':
    const leftComp = await this.evaluate(node.left);
    const rightComp = await this.evaluate(node.right);
    switch (node.operator) {
        case 'GT': case 'GREATER': return leftComp > rightComp;
        case 'LT': case 'LESS': return leftComp < rightComp;
        case 'EQ': case 'EQUALS_COMP': return leftComp === rightComp;
        case 'NEQ': return leftComp !== rightComp;
        case 'GTE': case 'GREATER_EQUAL': return leftComp >= rightComp;
        case 'LTE': case 'LESS_EQUAL': return leftComp <= rightComp;
        default: throw new Error(`Comparação desconhecida: ${node.operator}`);
    }
                
              

            case 'FunctionCall':
                if (node.name in this.builtinFunctions) {
                    const args = [];
                    for (const arg of node.args) args.push(await this.evaluate(arg));
                    return await this.builtinFunctions[node.name](...args);
                }
                if (!(node.name in this.functions)) {
                    throw new Error(`Função não definida: ${node.name}`);
                }
                const func = this.functions[node.name];
                const oldVars = { ...this.variables };
                const oldReturnValue = this.returnValue;
                this.returnValue = null;
                this.hasReturned = false;
                this.variables = { ...this.variables };
                for (let i = 0; i < func.params.length; i++) {
                    this.variables[func.params[i]] = await this.evaluate(node.args[i]);
                }
                for (const stmt of func.body) {
                    await this.executeStatement(stmt);
                    if (this.hasReturned) break;
                }
                const result = this.returnValue;
                this.variables = oldVars;
                this.returnValue = oldReturnValue;
                this.hasReturned = false;
                return result !== undefined ? result : undefined;

            case 'LogicalOp':
                if (node.operator === 'AND') return (await this.evaluate(node.left)) && (await this.evaluate(node.right));
                if (node.operator === 'OR') return (await this.evaluate(node.left)) || (await this.evaluate(node.right));
                throw new Error(`Operador lógico desconhecido: ${node.operator}`);

            case 'UnaryOp':
                if (node.operator === 'NOT') return !(await this.evaluate(node.operand));
                throw new Error(`Operador unário desconhecido: ${node.operator}`);

            case 'MethodCall':
                const obj = await this.evaluate(node.object);
                return await this.callMethod(obj, node.method, node.args);

            default:
                throw new Error(`Tipo de nó desconhecido: ${node.type}`);
        }
    }

    async callMethod(obj, methodName, args) {
        // STRING METHODS
        if (typeof obj === 'string') {
    if (methodName === 'paraNumero') {
        const n = Number(obj);
        if (isNaN(n)) throw new Error(`❌ "${obj}" não é um número válido.`);
        return n;
    }
    if (methodName === 'tamanho') return obj.length;
    if (methodName === 'maiuscula') return obj.toUpperCase();
    if (methodName === 'minuscula') return obj.toLowerCase();
    
    // NOVOS
    if (methodName === 'dividir') {
    const sep = args[0] ? await this.evaluate(args[0]) : '';
    
    const unescape = (s) => s
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t');
    
    return obj.split(unescape(sep));
}
    if (methodName === 'aparar') return obj.trim();
    if (methodName === 'incluir') {
        const sub = await this.evaluate(args[0]);
        return obj.includes(sub);
    }
    if (methodName === 'começa_com') {
        const sub = await this.evaluate(args[0]);
        return obj.startsWith(sub);
    }
    if (methodName === 'termina_com') {
        const sub = await this.evaluate(args[0]);
        return obj.endsWith(sub);
    }
    if (methodName === 'substituir') {
    const de = await this.evaluate(args[0]);
    const para = await this.evaluate(args[1]);
    
    // Interpreta escape sequences
    const unescape = (s) => s
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t');
    
    return obj.replace(unescape(de), unescape(para));
}
    if (methodName === 'fatiar') {
        const inicio = await this.evaluate(args[0]);
        const fim = args[1] ? await this.evaluate(args[1]) : undefined;
        return obj.slice(inicio, fim);
    }
}

        // NUMBER METHODS
        if (typeof obj === 'number') {
            if (methodName === 'paraTexto') return String(obj);
        }

        // ARRAY METHODS
        if (Array.isArray(obj)) {
            if (methodName === 'tamanho') return obj.length;
            if (methodName === 'adicionar') { obj.push(await this.evaluate(args[0])); return undefined; }
            if (methodName === 'remover') {
                const index = await this.evaluate(args[0]);
                if (typeof index !== 'number') throw new Error('Índice deve ser um número');
                if (index < 0 || index >= obj.length) throw new Error(`Índice ${index} fora dos limites`);
                obj.splice(index, 1);
                return undefined;
            }
            if (methodName === 'pegar') {
                const index = await this.evaluate(args[0]);
                if (typeof index !== 'number') throw new Error('Índice deve ser um número');
                if (index < 0 || index >= obj.length) throw new Error(`Índice ${index} fora dos limites`);
                return obj[index];
            }
            if (methodName === 'contem') { return obj.includes(await this.evaluate(args[0])); }
            if (methodName === 'juntar') {
                const separator = args[0] ? await this.evaluate(args[0]) : ',';
                return obj.join(separator);
            }
        }

        if (!obj || typeof obj !== 'object') {
            throw new Error(`O valor do tipo ${typeof obj} não possui o método "${methodName}"`);
        }
        if (!(methodName in obj)) {
            throw new Error(`Método não encontrado: ${methodName}`);
        }

        const method = obj[methodName];
        const evaluatedArgs = [];
        for (const arg of args) evaluatedArgs.push(await this.evaluate(arg));
        return await method.call(obj, ...evaluatedArgs);
    }
    
    async executeImportNamed(node) {
    const { names, source } = node;
    const tempName = `__temp_${source}__`;
    await this.executeImport({ name: tempName, source });
    const modulo = this.variables[tempName];
    delete this.variables[tempName];
    for (const nome of names) {
        if (!(nome in modulo)) {
            throw new Error(`❌ "${nome}" não existe no módulo "${source}"`);
        }
        this.variables[nome] = modulo[nome];
    }
}

    async executeImport(node) {
        const { name, source } = node;

        if (this.builtinModules[source]) {
            this.variables[name] = this.builtinModules[source];
            return;
        }

        const fs = require('fs');
        const path = require('path');
        const Lexer = require('../Lexer/lexer');
        const Parser = require('../Parser/parser');

        const baseDir = typeof this.filePath === 'string' && fs.existsSync(this.filePath) && fs.statSync(this.filePath).isFile()
            ? path.dirname(this.filePath)
            : this.filePath;

        let resolvedPath = null;
        const nomeNormalizado = source.endsWith('.ms') ? source : source + '.ms';
        const candidates = [
            path.resolve(baseDir, nomeNormalizado),
            path.resolve(baseDir, 'modulos_mambas', nomeNormalizado),
            path.resolve(baseDir, source, 'index.ms'),
            path.resolve(baseDir, 'modulos_mambas', source, 'index.ms'),
        ];

        for (const candidate of candidates) {
            if (fs.existsSync(candidate)) {
                resolvedPath = candidate;
                break;
            }
        }

        if (!resolvedPath) {
            throw new Error(`❌ Módulo não encontrado: "${source}"\n   Procurado em:\n   - ${candidates.join('\n   - ')}`);
        }

        const code = fs.readFileSync(resolvedPath, 'utf-8');
        const lexer = new Lexer(code);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();

        const moduleEvaluator = new Evaluator(resolvedPath);
        await moduleEvaluator.execute(ast);

        const moduleExports = {};
        for (const [key] of Object.entries(moduleEvaluator.functions)) {
            moduleExports[key] = async (...args) => {
                const evalCopy = new Evaluator(resolvedPath);
                evalCopy.functions = { ...moduleEvaluator.functions };
                evalCopy.variables = { ...moduleEvaluator.variables };
                evalCopy.returnValue = null;
                const func = evalCopy.functions[key];
                for (let i = 0; i < func.params.length; i++) {
                    evalCopy.variables[func.params[i]] = args[i];
                }
                for (const stmt of func.body) {
                    await evalCopy.executeStatement(stmt);
                    if (evalCopy.hasReturned) break;
                }
                return evalCopy.returnValue;
            };
        }
        for (const [key, value] of Object.entries(moduleEvaluator.variables)) {
            moduleExports[key] = value;
        }

        this.variables[name] = moduleExports;
    }
    
    

    createFsModule() {
        const fs = require('fs');
        return {
            ler: (arquivo) => { try { return fs.readFileSync(arquivo, 'utf-8'); } catch (e) { throw new Error(`❌ Erro ao ler arquivo: ${e.message}`); } },
            escrever: (arquivo, conteudo) => { try { fs.writeFileSync(arquivo, conteudo, 'utf-8'); } catch (e) { throw new Error(`❌ Erro ao escrever arquivo: ${e.message}`); } },
            existe: (arquivo) => fs.existsSync(arquivo),
            apagar: (arquivo) => { try { fs.unlinkSync(arquivo); } catch (e) { throw new Error(`❌ Erro ao apagar arquivo: ${e.message}`); } }
        };
    }

    createMathModule() {
        return {
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
}
,
            seno: (n) => Math.sin(n),
            cosseno: (n) => Math.cos(n)
        };
    }

    createPathModule() {
        const path = require('path');
        return {
            juntar: (...partes) => path.join(...partes),
            diretorio: (caminho) => path.dirname(caminho),
            arquivo: (caminho) => path.basename(caminho),
            extensao: (caminho) => path.extname(caminho),
            absoluto: (caminho) => path.resolve(caminho)
        };
    }

    createMysqlModule() {
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
                    conexao = await mysql2.createConnection({ host, user: usuario, password: senha, database: base,
                    port: porta});
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
                if (conexao) { await conexao.end(); conexao = null; }
            }
        };
    }

    createHttpModule(evaluator) {
        const { execSync } = require('child_process');

        const request = (method, url, corpo, cabecalhos) => {
            try {
                let cmd = `curl -s -w "\\n__STATUS__%{http_code}" -X ${method}`;
                if (cabecalhos && typeof cabecalhos === 'object') {
                    for (const [key, val] of Object.entries(cabecalhos)) cmd += ` -H "${key}: ${val}"`;
                }
                if (corpo) {
                    const corpoStr = typeof corpo === 'object' ? JSON.stringify(corpo) : String(corpo);
                    cmd += ` -d '${corpoStr.replace(/'/g, "'\\''")}'`;
                    if (!cabecalhos || !cabecalhos['Content-Type']) cmd += ` -H "Content-Type: application/json"`;
                }
                cmd += ` "${url}"`;
                const output = execSync(cmd, { encoding: 'utf-8' });
                const parts = output.split('\n__STATUS__');
                const status = parseInt(parts[1]) || 0;
                const corpoResposta = parts[0].trim();
                let dados = corpoResposta;
                try { dados = JSON.parse(corpoResposta); } catch {}
                return { status, corpo: dados, texto: corpoResposta, ok: status >= 200 && status < 300 };
            } catch (e) {
                throw new Error(`❌ Erro HTTP: ${e.message}`);
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
                                let corpoParseado = corpoRequisicao;
                                try { corpoParseado = JSON.parse(corpoRequisicao); } catch {}

                                const urlObj = new URL(req.url, `http://localhost:${porta}`);
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
                            });
                        });
                        servidorNode.listen(porta);
                    }
                };
            }
        };
    }

    createDateObject(timezone) {
        const now = new Date();
        const getLocalDate = () => {
            if (!timezone) return now;
            const parts = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            }).formatToParts(now);
            const get = (type) => parseInt(parts.find(p => p.type === type).value);
            return new Date(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
        };
        const localDate = getLocalDate();
        const nomesMeses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
        const nomesSemana = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
        return {
            _type: 'DateObject',
            mostrarHora: () => localDate.toLocaleTimeString('pt-BR'),
            mostrarData: () => localDate.toLocaleDateString('pt-BR'),
            ano: () => localDate.getFullYear(),
            dia: () => localDate.getDate(),
            horas: () => localDate.getHours(),
            minutos: () => localDate.getMinutes(),
            segundos: () => localDate.getSeconds(),
            mes: () => ({ numero: localDate.getMonth() + 1, nome: nomesMeses[localDate.getMonth()] }),
            semana: () => ({ numero: localDate.getDay(), nome: nomesSemana[localDate.getDay()] }),
            timestamp: () => now.getTime(),
            formatado: () => `${String(localDate.getDate()).padStart(2,'0')}/${String(localDate.getMonth()+1).padStart(2,'0')}/${localDate.getFullYear()}`,
            horaFormatada: () => `${String(localDate.getHours()).padStart(2,'0')}:${String(localDate.getMinutes()).padStart(2,'0')}:${String(localDate.getSeconds()).padStart(2,'0')}`
        };
    }

    lerInput() {
        const prompt = require('prompt-sync')({ sigint: true });
        return prompt('');
    }

    jsonLer(arquivo) {
        const fs = require('fs');
        try { return JSON.parse(fs.readFileSync(arquivo, 'utf-8')); }
        catch (e) { throw new Error(`❌ Erro ao ler JSON: ${e.message}`); }
    }

    jsonTexto(textoJson) {
        try { return JSON.parse(textoJson); }
        catch (e) { throw new Error(`❌ Erro ao parsear JSON: ${e.message}`); }
    }

    jsonEscrever(arquivo, dados) {
        const fs = require('fs');
        try { fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2), 'utf-8'); }
        catch (e) { throw new Error(`❌ Erro ao escrever JSON: ${e.message}`); }
    }
}

module.exports = Evaluator;