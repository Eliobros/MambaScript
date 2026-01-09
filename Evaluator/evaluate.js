class Evaluator {
    constructor() {
        this.variables = {};
        this.functions = {};
        this.returnValue = null;
        this.builtinFunctions = {
            'hoje': this.createDateObject.bind(this),
	    'ler': this.lerInput.bind(this) 
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
                // Se for um objeto de data, mostra representação amigável
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

            case 'FunctionDeclaration':
                this.functions[node.name] = {
                    params: node.params,
                    body: node.body
                };
                break;

            case 'Return':
                this.returnValue = this.evaluate(node.value);
                break;

            default:
                throw new Error(`Statement desconhecido: ${node.type}`);
        }
    }

    evaluate(node) {
        if (!node) {
            throw new Error('Nó inválido: undefined');
        }

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

            case 'BinaryOp':
                const left = this.evaluate(node.left);
                const right = this.evaluate(node.right);

                switch (node.operator) {
                    case 'PLUS': return left + right;
                    case 'MINUS': return left - right;
                    case 'MULTIPLY': return left * right;
                    case 'DIVIDE': return left / right;
                    default: throw new Error(`Operador desconhecido: ${node.operator}`);
                }

            case 'Comparison':
                const leftComp = this.evaluate(node.left);
                const rightComp = this.evaluate(node.right);

                switch (node.operator) {
                    case 'GREATER': return leftComp > rightComp;
                    case 'LESS': return leftComp < rightComp;
                    case 'EQUALS_COMP': return leftComp === rightComp;
                    case 'GREATER_EQUAL': return leftComp >= rightComp;
                    case 'LESS_EQUAL': return leftComp <= rightComp;
                    default: throw new Error(`Comparação desconhecida: ${node.operator}`);
                }

            case 'FunctionCall':
                // Verifica se é função built-in
                if (node.name in this.builtinFunctions) {
                    const args = node.args.map(arg => this.evaluate(arg));
                    return this.builtinFunctions[node.name](...args);
                }
                
                if (!(node.name in this.functions)) {
                    throw new Error(`Função não definida: ${node.name}`);
                }
                
                const func = this.functions[node.name];
                
                // Salva o estado atual
                const oldVars = {...this.variables};
                const oldReturnValue = this.returnValue;
                this.returnValue = null;
                
                // Atribui argumentos aos parâmetros
                for (let i = 0; i < func.params.length; i++) {
                    this.variables[func.params[i]] = this.evaluate(node.args[i]);
                }
                
                // Executa corpo da função
                for (const stmt of func.body) {
                    this.executeStatement(stmt);
                    if (this.returnValue !== null) break;
                }
                
                // Captura o resultado
                const result = this.returnValue;
                
                // Restaura o estado
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

    createDateObject(timezone) {
        const now = new Date();
        
        // Opções de formatação com timezone
        const options = timezone ? { timeZone: timezone } : {};
        
        // Função helper para converter data no timezone correto
        const getDateInTimezone = () => {
            if (timezone) {
                // Cria string ISO no timezone e converte de volta para Date
                const isoString = now.toLocaleString('en-US', { timeZone: timezone });
                return new Date(isoString);
            }
            return now;
        };
        
        const localDate = getDateInTimezone();
        
        return {
            _type: 'DateObject',
            _date: now,
            _timezone: timezone || 'Local',
            mostrarHora: () => {
                return now.toLocaleTimeString('pt-BR', options);
            },
            mostrarData: () => {
                return now.toLocaleDateString('pt-BR', options);
            },
            dia: () => {
                return localDate.getDate();
            },
            mes: () => {
                return localDate.getMonth() + 1;
            },
            ano: () => {
                return localDate.getFullYear();
            },
            hora: () => {
                return localDate.getHours();
            },
            minuto: () => {
                return localDate.getMinutes();
            },
            segundo: () => {
                return localDate.getSeconds();
            },
            timezone: () => {
                return timezone || 'Local';
            }
        };
    }


	lerInput() {
        const prompt = require('prompt-sync')({ sigint: true });
        return prompt('');
    }

    callMethod(obj, methodName, args) {
        if (!obj || typeof obj !== 'object') {
            throw new Error(`Tentando chamar método em valor não-objeto`);
        }

        if (!(methodName in obj)) {
            throw new Error(`Método não encontrado: ${methodName}`);
        }

        const method = obj[methodName];
        
        if (typeof method !== 'function') {
            throw new Error(`${methodName} não é um método`);
        }

        // Avalia os argumentos
        const evaluatedArgs = args.map(arg => this.evaluate(arg));
        
        return method(...evaluatedArgs);
    }
}

module.exports = Evaluator;
