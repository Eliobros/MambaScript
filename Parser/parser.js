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
        if (!this.currentToken) {
            throw new Error(`❌ Fim inesperado do código. Esperava ${this.translateToken(type)}.`);
        }
        if (this.currentToken.type !== type) {
            throw new Error(
                `❌ Erro na linha ${this.currentToken.line}, coluna ${this.currentToken.column}:\n` +
                `   Esperado ${this.translateToken(type)}, mas encontrado ${this.translateToken(this.currentToken.type)}\n` +
                `   ${this.getHint(type)}`
            );
        }
        const token = this.currentToken;
        this.advance();
        return token;
    }

    translateToken(type) {
        const translations = {
            'END': '"fim"',
            'COLON': '":"',
            'LPAREN': '"("',
            'RPAREN': '")"',
            'LBRACKET': '"["',
            'RBRACKET': '"]"',
            'IF': '"se"',
            'ELSE': '"senao"',
            'WHILE': '"enquanto"',
            'FUNCTION': '"funcao"',
            'PRINT': '"escreva"',
            'VAR': '"variavel"',
            'RETURN': '"retorna"',
        };
        return translations[type] || type;
    }

    getHint(type) {
        const hints = {
            'END': '💡 Dica: Você esqueceu de fechar o bloco com "fim"?',
            'COLON': '💡 Dica: Você esqueceu de colocar ":" depois da condição?',
            'RPAREN': '💡 Dica: Você esqueceu de fechar o parêntese ")"?',
            'RBRACKET': '💡 Dica: Você esqueceu de fechar o colchete "]"?',
        };
        return hints[type] || '';
    }

    parse() {
        const statements = [];
        while (this.currentToken && this.currentToken.type !== 'EOF') {
            statements.push(this.statement());
        }
        return { type: 'Program', body: statements };
    }

    statement() {
        switch (this.currentToken.type) {
            case 'PRINT':
                return this.printStatement();
            case 'VAR':
                return this.varStatement();
            case 'IF':
                return this.ifStatement();
            case 'WHILE':
                return this.whileStatement();
            case 'FUNCTION':
                return this.functionDeclaration();
            case 'RETURN':
                return this.returnStatement();
	    case 'IDENTIFIER':
            return this.assignmentStatement
            default:
                throw new Error(
                    `❌ Erro na linha ${this.currentToken.line}: ` +
                    `Statement inválido: ${this.currentToken.type}`
                );
        }
    }

    printStatement() {
        this.advance();
        const value = this.expression();
        return { type: 'Print', value };
    }

    varStatement() {
        this.advance();
        const name = this.expect('IDENTIFIER').value;
        this.expect('ASSIGN');
        const value = this.expression();
        return { type: 'VarDeclaration', name, value };
    }

    ifStatement() {
        this.advance();
        const condition = this.comparison();
        this.expect('COLON');

        const body = [];
        while (
            this.currentToken &&
            !['ELSE', 'END', 'EOF'].includes(this.currentToken.type)
        ) {
            body.push(this.statement());
        }

        let elseBody = null;

        if (this.currentToken && this.currentToken.type === 'ELSE') {
            this.advance();
            this.expect('COLON');
            elseBody = [];

            while (
                this.currentToken &&
                this.currentToken.type !== 'END' &&
                this.currentToken.type !== 'EOF'
            ) {
                elseBody.push(this.statement());
            }
        }

        this.expect('END');

        return { type: 'If', condition, body, elseBody };
    }

    whileStatement() {
        this.advance();
        const condition = this.comparison();
        this.expect('COLON');

        const body = [];
        while (
            this.currentToken &&
            this.currentToken.type !== 'END' &&
            this.currentToken.type !== 'EOF'
        ) {
            body.push(this.statement());
        }

        this.expect('END');

        return { type: 'While', condition, body };
    }

    functionDeclaration() {
        this.advance();
        const name = this.expect('IDENTIFIER').value;
        this.expect('LPAREN');

        const params = [];
        while (this.currentToken && this.currentToken.type !== 'RPAREN') {
            params.push(this.expect('IDENTIFIER').value);
            if (this.currentToken.type === 'COMMA') {
                this.advance();
            }
        }

        this.expect('RPAREN');
        this.expect('COLON');

        const body = [];
        while (
            this.currentToken &&
            this.currentToken.type !== 'END' &&
            this.currentToken.type !== 'EOF'
        ) {
            body.push(this.statement());
        }

        this.expect('END');

        return { type: 'FunctionDeclaration', name, params, body };
    }

    returnStatement() {
        this.advance();
        const value = this.expression();
        return { type: 'Return', value };
    }

    assignmentStatement() {
    const name = this.expect('IDENTIFIER').value;
    this.expect('ASSIGN');
    const value = this.expression();
    return { type: 'Assignment', name, value };
}

    comparison() {
        let left = this.expression();

        if (
            this.currentToken &&
            ['GT', 'LT', 'EQ', 'GTE', 'LTE'].includes(this.currentToken.type)
        ) {
            const operator = this.currentToken.type;
            this.advance();
            const right = this.expression();
            return { type: 'Comparison', operator, left, right };
        }

        return left;
    }

    expression() {
        let result = this.term();

        while (
            this.currentToken &&
            ['PLUS', 'MINUS'].includes(this.currentToken.type)
        ) {
            const operator = this.currentToken.type;
            this.advance();
            const right = this.term();
            result = { type: 'BinaryOp', operator, left: result, right };
        }

        return result;
    }

    term() {
        let result = this.factor();

        while (
            this.currentToken &&
            ['MULT', 'DIV'].includes(this.currentToken.type)
        ) {
            const operator = this.currentToken.type;
            this.advance();
            const right = this.factor();
            result = { type: 'BinaryOp', operator, left: result, right };
        }

        return result;
    }

    factor() {
        const token = this.currentToken;

        if (!token) {
            throw new Error('❌ Expressão incompleta');
        }

        if (token.type === 'NUMBER') {
            this.advance();
            return { type: 'Number', value: token.value };
        }

        if (token.type === 'STRING') {
            this.advance();
            return { type: 'String', value: token.value };
        }

        // ARRAY LITERAL
        if (token.type === 'LBRACKET') {
            return this.arrayLiteral();
        }

        if (token.type === 'IDENTIFIER') {
            let result = { type: 'Identifier', name: token.value };
            this.advance();

            // Function call
            if (this.currentToken && this.currentToken.type === 'LPAREN') {
                this.advance();
                const args = [];

                while (this.currentToken.type !== 'RPAREN') {
                    args.push(this.expression());
                    if (this.currentToken.type === 'COMMA') {
                        this.advance();
                    }
                }
                this.expect('RPAREN');

                result = { type: 'FunctionCall', name: result.name, args };
            }

            // ARRAY ACCESS
            if (this.currentToken && this.currentToken.type === 'LBRACKET') {
                this.advance();
                const index = this.expression();
                this.expect('RBRACKET');
                result = { type: 'ArrayAccess', array: result, index };
            }

            // Method chaining
            while (this.currentToken && this.currentToken.type === 'DOT') {
                this.advance();
                const method = this.expect('IDENTIFIER').value;
                this.expect('LPAREN');

                const args = [];
                while (this.currentToken.type !== 'RPAREN') {
                    args.push(this.expression());
                    if (this.currentToken.type === 'COMMA') {
                        this.advance();
                    }
                }
                this.expect('RPAREN');

                result = {
                    type: 'MethodCall',
                    object: result,
                    method,
                    args
                };
            }

            return result;
        }

        if (token.type === 'LPAREN') {
            this.advance();
            const expr = this.expression();
            this.expect('RPAREN');
            return expr;
        }

        throw new Error(
            `❌ Erro na linha ${token.line}, coluna ${token.column}: ` +
            `Token inesperado: ${token.type}`
        );
    }

    // NOVO: Parse array literal [1, 2, 3]
    arrayLiteral() {
        this.expect('LBRACKET');
        const elements = [];

        while (this.currentToken && this.currentToken.type !== 'RBRACKET') {
            elements.push(this.expression());
            if (this.currentToken.type === 'COMMA') {
                this.advance();
            }
        }

        this.expect('RBRACKET');

        return { type: 'ArrayLiteral', elements };
    }
}

module.exports = Parser;
