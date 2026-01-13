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
            throw new Error(`Fim inesperado do código, esperado ${type}`);
        }
        if (this.currentToken.type !== type) {
            throw new Error(
                `Esperado ${type}, mas encontrado ${this.currentToken.type}`
            );
        }
        const token = this.currentToken;
        this.advance();
        return token;
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

            case 'FUNCTION':
                return this.functionDeclaration();

            case 'RETURN':
                return this.returnStatement();

            default:
                throw new Error(`Statement inválido: ${this.currentToken.type}`);
        }
    }

    // escreva expr
    printStatement() {
        this.advance(); // PRINT
        const value = this.expression();
        return { type: 'Print', value };
    }

    // variavel x = expr
    varStatement() {
        this.advance(); // VAR
        const name = this.expect('IDENTIFIER').value;
        this.expect('ASSIGN');
        const value = this.expression();
        return { type: 'VarDeclaration', name, value };
    }

    // se condicao:
    ifStatement() {
        this.advance(); // IF
        const condition = this.comparison();
        this.expect('COLON');

        const body = [];
        while (
            this.currentToken &&
            !['ELSE', 'EOF'].includes(this.currentToken.type)
        ) {
            body.push(this.statement());
        }

        let elseBody = null;

        if (this.currentToken && this.currentToken.type === 'ELSE') {
            this.advance(); // ELSE
            this.expect('COLON');
            elseBody = [];

            while (
                this.currentToken &&
                this.currentToken.type !== 'EOF'
            ) {
                elseBody.push(this.statement());
            }
        }

        return { type: 'If', condition, body, elseBody };
    }

    // funcao nome(a, b):
    functionDeclaration() {
        this.advance(); // FUNCTION
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
            this.currentToken.type !== 'EOF'
        ) {
            body.push(this.statement());
        }

        return { type: 'FunctionDeclaration', name, params, body };
    }

    // retorna expr
    returnStatement() {
        this.advance(); // RETURN
        const value = this.expression();
        return { type: 'Return', value };
    }

    // expr (GT | LT | EQ | GTE | LTE) expr
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

    // soma / sub
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

    // mult / div
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
            throw new Error('Expressão incompleta');
        }

        // Número
        if (token.type === 'NUMBER') {
            this.advance();
            return { type: 'Number', value: token.value };
        }

        // String
        if (token.type === 'STRING') {
            this.advance();
            return { type: 'String', value: token.value };
        }

        // Identificador / função / método
        if (token.type === 'IDENTIFIER') {
            let result = { type: 'Identifier', name: token.value };
            this.advance();

            // Chamada de função
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

            // Encadeamento de métodos
            while (this.currentToken && this.currentToken.type === 'DOT') {
                this.advance(); // DOT
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

        // (expr)
        if (token.type === 'LPAREN') {
            this.advance();
            const expr = this.expression();
            this.expect('RPAREN');
            return expr;
        }

        throw new Error(`Token inesperado: ${token.type}`);
    }
}

module.exports = Parser;
