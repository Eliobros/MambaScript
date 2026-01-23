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
        if (!node) throw new Error('Nó inválido');

        switch (node.type) {
            case 'Number': return node.value;
            case 'String': return node.value;

            case 'Identifier':
                if (!(node.name in this.variables)) {
                    throw new Error(`Variável não definida: ${node.name}`);
                }
                return this.variables[node.name];

            case 'BinaryOp':
                const left = this.evaluate(node.left);
                const right = this.evaluate(node.right);

                if (node.operator === 'PLUS') {
                    // SOMA: Ambos precisam ser números
                    if (typeof left === 'number' && typeof right === 'number') {
                        return left + right;
                    }
                    // CONCATENAÇÃO: Ambos precisam ser strings
                    if (typeof left === 'string' && typeof right === 'string') {
                        return left + right;
                    }
                    // ERRO: Tipos misturados
                    throw new Error(`Erro de Tipo: Não é possível somar ${typeof left} com ${typeof right}. Use .paraTexto() ou .paraNumero().`);
                }

                // Outras operações aritméticas (sempre esperam números)
                if (typeof left !== 'number' || typeof right !== 'number') {
                    throw new Error(`Operação ${node.operator} permitida apenas entre números.`);
                }

                switch (node.operator) {
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
        // --- TRATAMENTO DE TIPOS PRIMITIVOS (Bridge) ---
        if (typeof obj === 'string') {
            if (methodName === 'paraNumero') {
                const n = Number(obj);
                if (isNaN(n)) throw new Error(`"${obj}" não é um número válido.`);
                return n;
            }
        }
        if (typeof obj === 'number') {
            if (methodName === 'paraTexto') {
                return String(obj);
            }
        }

        // --- TRATAMENTO DE OBJETOS (como DateObject) ---
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
}

module.exports = Evaluator;

