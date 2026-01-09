class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
        this.currentToken = this.tokens[this.pos];
    }

    advance() {
        this.pos++;
        this.currentToken = this.pos < this.tokens.length ? this.tokens[this.pos] : null;
    }

    expect(type) {
        if (this.currentToken.type !== type) {
            throw new Error(`Esperado ${type}, mas encontrado ${this.currentToken.type}`);
        }
        const token = this.currentToken;
        this.advance();
        return token;
    }

    parse() {
        const statements = [];
        
        while (this.currentToken.type !== 'EOF') {
            statements.push(this.statement());
        }
        
        return { type: 'Program', body: statements };
    }

    statement() {
        // escreva "texto"
        if (this.currentToken.type === 'PRINT') {
            return this.printStatement();
        }

        // variavel x = 10
        if (this.currentToken.type === 'VAR') {
            return this.varStatement();
        }

        // se condicao:
        if (this.currentToken.type === 'IF') {
            return this.ifStatement();
        }

        // funcao nome(param1, param2):
        if (this.currentToken.type === 'FUNCTION') {
            return this.functionDeclaration();
        }

        // retorna valor
        if (this.currentToken.type === 'RETURN') {
            return this.returnStatement();
        }

        throw new Error(`Statement inválido: ${this.currentToken.type}`);
    }

    printStatement() {
        this.advance(); // pula 'escreva'
        const value = this.expression();
        return { type: 'Print', value };
    }

    varStatement() {
        this.advance(); // pula 'variavel'
        const name = this.expect('IDENTIFIER').value;
        this.expect('EQUALS');
        const value = this.expression();
        return { type: 'VarDeclaration', name, value };
    }

    ifStatement() {
        this.advance(); // pula 'se'
        const condition = this.comparison();
        this.expect('COLON');
        const body = [];
        
        // Lê statements do if
        body.push(this.statement());
        
        let elseBody = null;
        
        // Verifica se tem 'senao'
        if (this.currentToken && this.currentToken.type === 'ELSE') {
            this.advance(); // pula 'senao'
            this.expect('COLON');
            elseBody = [];
            elseBody.push(this.statement());
        }
        
        return { type: 'If', condition, body, elseBody };
    }

    functionDeclaration() {
        this.advance(); // pula 'funcao'
        const name = this.expect('IDENTIFIER').value;
        this.expect('LPAREN');
        
        // Lê parâmetros
        const params = [];
        while (this.currentToken.type !== 'RPAREN') {
            params.push(this.expect('IDENTIFIER').value);
            if (this.currentToken.type === 'COMMA') {
                this.advance();
            }
        }
        this.expect('RPAREN');
        this.expect('COLON');
        
        // Lê corpo da função
        const body = [];
        body.push(this.statement());
        
        return { type: 'FunctionDeclaration', name, params, body };
    }

    returnStatement() {
        this.advance(); // pula 'retorna'
        const value = this.expression();
        return { type: 'Return', value };
    }

    comparison() {
        let left = this.expression();

        if (['GREATER', 'LESS', 'EQUALS_COMP', 'GREATER_EQUAL', 'LESS_EQUAL'].includes(this.currentToken.type)) {
            const operator = this.currentToken.type;
            this.advance();
            const right = this.expression();
            return { type: 'Comparison', operator, left, right };
        }

        return left;
    }

    expression() {
        let result = this.term();

        while (['PLUS', 'MINUS'].includes(this.currentToken.type)) {
            const operator = this.currentToken.type;
            this.advance();
            const right = this.term();
            result = { type: 'BinaryOp', operator, left: result, right };
        }

        return result;
    }

    term() {
        let result = this.factor();

        while (['MULTIPLY', 'DIVIDE'].includes(this.currentToken.type)) {
            const operator = this.currentToken.type;
            this.advance();
            const right = this.factor();
            result = { type: 'BinaryOp', operator, left: result, right };
        }

        return result;
    }

    factor() {
        const token = this.currentToken;

        if (token.type === 'NUMBER') {
            this.advance();
            return { type: 'Number', value: token.value };
        }

        if (token.type === 'STRING') {
            this.advance();
            return { type: 'String', value: token.value };
        }

        if (token.type === 'IDENTIFIER') {
            const name = token.value;
            this.advance();
            
            // Verifica se é chamada de função
            if (this.currentToken && this.currentToken.type === 'LPAREN') {
                this.advance(); // pula '('
                const args = [];
                
                while (this.currentToken.type !== 'RPAREN') {
                    args.push(this.expression());
                    if (this.currentToken.type === 'COMMA') {
                        this.advance();
                    }
                }
                this.expect('RPAREN');
                
                let result = { type: 'FunctionCall', name, args };
                
                // Verifica se tem acesso a método (.)
                while (this.currentToken && this.currentToken.type === 'DOT') {
                    this.advance(); // pula '.'
                    const methodName = this.expect('IDENTIFIER').value;
                    this.expect('LPAREN');
                    
                    const methodArgs = [];
                    while (this.currentToken.type !== 'RPAREN') {
                        methodArgs.push(this.expression());
                        if (this.currentToken.type === 'COMMA') {
                            this.advance();
                        }
                    }
                    this.expect('RPAREN');
                    
                    result = { type: 'MethodCall', object: result, method: methodName, args: methodArgs };
                }
                
                return result;
            }
            
            // Verifica se tem acesso a método em variável
            if (this.currentToken && this.currentToken.type === 'DOT') {
                let result = { type: 'Identifier', name };
                
                while (this.currentToken && this.currentToken.type === 'DOT') {
                    this.advance(); // pula '.'
                    const methodName = this.expect('IDENTIFIER').value;
                    this.expect('LPAREN');
                    
                    const methodArgs = [];
                    while (this.currentToken.type !== 'RPAREN') {
                        methodArgs.push(this.expression());
                        if (this.currentToken.type === 'COMMA') {
                            this.advance();
                        }
                    }
                    this.expect('RPAREN');
                    
                    result = { type: 'MethodCall', object: result, method: methodName, args: methodArgs };
                }
                
                return result;
            }
            
            return { type: 'Identifier', name };
        }

        if (token.type === 'LPAREN') {
            this.advance();
            const result = this.expression();
            this.expect('RPAREN');
            return result;
        }

        throw new Error(`Token inesperado: ${token.type}`);
    }
}

module.exports = Parser;
