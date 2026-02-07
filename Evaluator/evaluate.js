class Evaluator {
    constructor() {
        this.variables = {};
        this.functions = {};
        this.returnValue = null;
        this.builtinFunctions = {
            'hoje': this.createDateObject.bind(this),
            'ler': this.lerInput.bind(this),
            'json_ler': this.jsonLer.bind(this),
            'json_texto': this.jsonTexto.bind(this),
            'json_escrever': this.jsonEscrever.bind(this)
        };
    }

    execute(ast) {
        for (const statement of ast.body) {
            this.executeStatement(statement);
        }
    }

    executeStatement(node) {
        switch (node.type) {
            case 'Print':
                const printValue = this.evaluate(node.value);
                if (printValue && printValue._type === 'DateObject') {
                    console.log(`Data: ${printValue.mostrarData()} às ${printValue.mostrarHora()}`);
                } else {
                    console.log(printValue);
                }
                break;

            case 'VarDeclaration':
                const varValue = this.evaluate(node.value);
                this.variables[node.name] = varValue;
                break;

            case 'Assignment':
                // Atribuição simples (variável)
                if (typeof node.name === 'string') {
                    if (!(node.name in this.variables)) {
                        throw new Error(`Variável não definida: ${node.name}`);
                    }
                    this.variables[node.name] = this.evaluate(node.value);
                } 
                // Atribuição em propriedade (dados.nome = "João")
                else if (node.name.type === 'PropertyAccess') {
                    const obj = this.evaluate(node.name.object);
                    if (typeof obj !== 'object' || obj === null) {
                        throw new Error('Tentativa de atribuir propriedade em não-objeto');
                    }
                    obj[node.name.property] = this.evaluate(node.value);
                }
                // Atribuição para Identifier (compatibilidade)
                else if (node.name.type === 'Identifier') {
                    if (!(node.name.name in this.variables)) {
                        throw new Error(`Variável não definida: ${node.name.name}`);
                    }
                    this.variables[node.name.name] = this.evaluate(node.value);
                }
                break;

            case 'If':
                if (this.evaluate(node.condition)) {
                    for (const stmt of node.body) {
                        this.executeStatement(stmt);
                        if (this.returnValue !== null) return;
                    }
                } else if (node.elseBody) {
                    for (const stmt of node.elseBody) {
                        this.executeStatement(stmt);
                        if (this.returnValue !== null) return;
                    }
                }
                break;

            case 'While':
                while (this.evaluate(node.condition)) {
                    for (const stmt of node.body) {
                        this.executeStatement(stmt);
                        if (this.returnValue !== null) return;
                    }
                }
                break;

            case 'FunctionDeclaration':
                this.functions[node.name] = {
                    params: node.params,
                    body: node.body
                };
                break;

            case 'Return':
                this.returnValue = this.evaluate(node.value);
                break;

	    case 'ExpressionStatement':
    this.evaluate(node.expression);
    break

            default:
                throw new Error(`Statement desconhecido: ${node.type}`);
        }
    }

    evaluate(node) {
        if (!node) throw new Error('Nó inválido');

        switch (node.type) {
            case 'Number':
                return node.value;

            case 'String':
                return node.value;

            case 'Identifier':
                if (!(node.name in this.variables)) {
                    throw new Error(`Variável não definida: ${node.name}`);
                }
                return this.variables[node.name];

            case 'ArrayLiteral':
                return node.elements.map(el => this.evaluate(el));

            case 'ArrayAccess':
                const array = this.evaluate(node.array);
                const index = this.evaluate(node.index);

                if (!Array.isArray(array)) {
                    throw new Error('Tentativa de acessar índice em não-array');
                }
                if (typeof index !== 'number') {
                    throw new Error('Índice deve ser um número');
                }
                if (index < 0 || index >= array.length) {
                    throw new Error(`Índice ${index} fora dos limites (tamanho: ${array.length})`);
                }

                return array[index];

            case 'PropertyAccess':
                const object = this.evaluate(node.object);
                
                if (object === null || object === undefined) {
                    throw new Error(`Tentativa de acessar propriedade "${node.property}" em valor nulo`);
                }
                
                // Se for objeto JavaScript (JSON)
                if (typeof object === 'object' && !Array.isArray(object) && !object._type) {
                    if (!(node.property in object)) {
                        throw new Error(`Propriedade "${node.property}" não existe no objeto`);
                    }
                    return object[node.property];
                }
                
                throw new Error(`O tipo ${typeof object} não possui propriedades acessíveis`);

            case 'BinaryOp':
                const left = this.evaluate(node.left);
                const right = this.evaluate(node.right);

                if (node.operator === 'PLUS') {
                    if (typeof left === 'number' && typeof right === 'number') {
                        return left + right;
                    }
                    if (typeof left === 'string' && typeof right === 'string') {
                        return left + right;
                    }
                    throw new Error(`Erro de Tipo: Não é possível somar ${typeof left} com ${typeof right}. Use .paraTexto() ou .paraNumero().`);
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
                const leftComp = this.evaluate(node.left);
                const rightComp = this.evaluate(node.right);

                switch (node.operator) {
                    case 'GT':
                    case 'GREATER':
                        return leftComp > rightComp;

                    case 'LT':
                    case 'LESS':
                        return leftComp < rightComp;

                    case 'EQ':
                    case 'EQUALS_COMP':
                        return leftComp === rightComp;

                    case 'GTE':
                    case 'GREATER_EQUAL':
                        return leftComp >= rightComp;

                    case 'LTE':
                    case 'LESS_EQUAL':
                        return leftComp <= rightComp;

                    default:
                        throw new Error(`Comparação desconhecida: ${node.operator}`);
                }

            case 'FunctionCall':
                if (node.name in this.builtinFunctions) {
                    const args = node.args.map(arg => this.evaluate(arg));
                    return this.builtinFunctions[node.name](...args);
                }
                if (!(node.name in this.functions)) {
                    throw new Error(`Função não definida: ${node.name}`);
                }
                const func = this.functions[node.name];
                const oldVars = {...this.variables};
                const oldReturnValue = this.returnValue;
                this.returnValue = null;

                for (let i = 0; i < func.params.length; i++) {
                    this.variables[func.params[i]] = this.evaluate(node.args[i]);
                }
                for (const stmt of func.body) {
                    this.executeStatement(stmt);
                    if (this.returnValue !== null) break;
                }
                const result = this.returnValue;
                this.returnValue = oldReturnValue;
                this.variables = oldVars;
                return result !== null ? result : undefined;

            case 'MethodCall':
                const obj = this.evaluate(node.object);
                return this.callMethod(obj, node.method, node.args);

            default:
                throw new Error(`Tipo de nó desconhecido: ${node.type}`);
        }
    }

    callMethod(obj, methodName, args) {
        // STRING METHODS
        if (typeof obj === 'string') {
            if (methodName === 'paraNumero') {
                const n = Number(obj);
                if (isNaN(n)) throw new Error(`❌ Erro MambaScript: "${obj}" não é um número válido.`);
                return n;
            }
            if (methodName === 'tamanho') {
                return obj.length;
            }
            if (methodName === 'maiuscula') {
                return obj.toUpperCase();
            }
            if (methodName === 'minuscula') {
                return obj.toLowerCase();
            }
        }

        // NUMBER METHODS
        if (typeof obj === 'number') {
            if (methodName === 'paraTexto') {
                return String(obj);
            }
        }

        // ARRAY METHODS
        if (Array.isArray(obj)) {
            if (methodName === 'tamanho') {
                return obj.length;
            }
            if (methodName === 'adicionar') {
                const item = this.evaluate(args[0]);
                obj.push(item);
                return undefined;
            }
            if (methodName === 'remover') {
                const index = this.evaluate(args[0]);
                if (typeof index !== 'number') {
                    throw new Error('Índice deve ser um número');
                }
                if (index < 0 || index >= obj.length) {
                    throw new Error(`Índice ${index} fora dos limites`);
                }
                obj.splice(index, 1);
                return undefined;
            }
            if (methodName === 'pegar') {
                const index = this.evaluate(args[0]);
                if (typeof index !== 'number') {
                    throw new Error('Índice deve ser um número');
                }
                if (index < 0 || index >= obj.length) {
                    throw new Error(`Índice ${index} fora dos limites`);
                }
                return obj[index];
            }
            if (methodName === 'contem') {
                const item = this.evaluate(args[0]);
                return obj.includes(item);
            }
            if (methodName === 'juntar') {
                const separator = args[0] ? this.evaluate(args[0]) : ',';
                return obj.join(separator);
            }
        }

        // DATEOBJECT METHODS
        if (!obj || typeof obj !== 'object') {
            throw new Error(`O valor do tipo ${typeof obj} não possui o método "${methodName}"`);
        }

        if (!(methodName in obj)) {
            throw new Error(`Método não encontrado: ${methodName}`);
        }

        const method = obj[methodName];
        const evaluatedArgs = args.map(arg => this.evaluate(arg));
        return method(...evaluatedArgs);
    }

    createDateObject(timezone) {
        const now = new Date();
        const options = timezone ? { timeZone: timezone } : {};
        const getDateInTimezone = () => {
            if (timezone) {
                const isoString = now.toLocaleString('en-US', { timeZone: timezone });
                return new Date(isoString);
            }
            return now;
        };
        const localDate = getDateInTimezone();

        return {
            _type: 'DateObject',
            mostrarHora: () => now.toLocaleTimeString('pt-BR', options),
            mostrarData: () => now.toLocaleDateString('pt-BR', options),
            ano: () => localDate.getFullYear()
        };
    }

    lerInput() {
        const prompt = require('prompt-sync')({ sigint: true });
        return prompt('');
    }

    jsonLer(arquivo) {
        const fs = require('fs');
        try {
            const conteudo = fs.readFileSync(arquivo, 'utf-8');
            return JSON.parse(conteudo);
        } catch (erro) {
            throw new Error(`❌ Erro ao ler JSON: ${erro.message}`);
        }
    }

    jsonTexto(textoJson) {
        try {
            return JSON.parse(textoJson);
        } catch (erro) {
            throw new Error(`❌ Erro ao parsear JSON: ${erro.message}`);
        }
    }

    jsonEscrever(arquivo, dados) {
        const fs = require('fs');
        try {
            fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2), 'utf-8');
            return undefined;
        } catch (erro) {
            throw new Error(`❌ Erro ao escrever JSON: ${erro.message}`);
        }
    }
}

module.exports = Evaluator;

