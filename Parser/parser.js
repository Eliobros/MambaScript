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
            'LBRACE': '"{"',      // ✅ NOVO
            'RBRACE': '"}"',      // ✅ NOVO
            'COMMA': '","',       // ✅ NOVO
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
            'RBRACE': '💡 Dica: Você esqueceu de fechar a chave "}"?',    // ✅ NOVO
            'COMMA': '💡 Dica: Você esqueceu de separar os itens com vírgula?',  // ✅ NOVO
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
        case 'FOR':
            return this.forStatement();
        case 'FUNCTION':
            return this.functionDeclaration();
        case 'RETURN':
            return this.returnStatement();
        case 'IMPORT':
            return this.importStatement();
        case 'BREAK':
            return this.breakStatement();
        case 'CONTINUE':
            return this.continueStatement();
        case 'SWITCH':
            return this.switchStatement();
        case 'TENTE':
            return this.tryCatchStatement();

        case 'IDENTIFIER': {
            const savedPos = this.pos;
            const savedToken = this.currentToken;

            this.expect('IDENTIFIER');

            // resultado = valor
            if (this.currentToken && this.currentToken.type === 'ASSIGN') {
                this.pos = savedPos;
                this.currentToken = savedToken;
                return this.assignmentStatement();
            }

            // obj.prop = valor
            if (this.currentToken && this.currentToken.type === 'DOT') {
                this.advance();
                this.expect('IDENTIFIER');

                if (this.currentToken && this.currentToken.type === 'ASSIGN') {
                    this.pos = savedPos;
                    this.currentToken = savedToken;
                    return this.assignmentStatement();
                }

                this.pos = savedPos;
                this.currentToken = savedToken;
                const exprDot = this.expression();
                return { type: 'ExpressionStatement', expression: exprDot };
            }

            // resultado[chave] = valor
            if (this.currentToken && this.currentToken.type === 'LBRACKET') {
                this.advance();
                this.expression(); // consome o índice
                this.expect('RBRACKET');

                if (this.currentToken && this.currentToken.type === 'ASSIGN') {
                    this.pos = savedPos;
                    this.currentToken = savedToken;
                    return this.assignmentStatement();
                }

                this.pos = savedPos;
                this.currentToken = savedToken;
                const exprIdx = this.expression();
                return { type: 'ExpressionStatement', expression: exprIdx };
            }

            // Chamada de função ou expressão standalone
            this.pos = savedPos;
            this.currentToken = savedToken;
            const exprStmt = this.expression();
            return { type: 'ExpressionStatement', expression: exprStmt };
        }

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
    
    breakStatement() {
    this.advance(); // pular 'parar'
    return { type: 'Break' };
}

continueStatement() {
    this.advance(); // pular 'continuar'
    return { type: 'Continue' };
}

switchStatement() {
    this.advance(); // pular 'escolher'
    const value = this.expression();
    this.expect('COLON');

    const cases = [];
    let defaultBody = null;

    while (
        this.currentToken &&
        this.currentToken.type !== 'END' &&
        this.currentToken.type !== 'EOF'
    ) {
        if (this.currentToken.type === 'CASE') {
            this.advance(); // pular 'caso'
            const caseValue = this.expression();
            this.expect('COLON');

            const body = [];
            while (
                this.currentToken &&
                !['CASE', 'DEFAULT', 'END', 'EOF'].includes(this.currentToken.type)
            ) {
                body.push(this.statement());
            }

            cases.push({ value: caseValue, body });

        } else if (this.currentToken.type === 'DEFAULT') {
            this.advance(); // pular 'padrao'
            this.expect('COLON');

            defaultBody = [];
            while (
                this.currentToken &&
                !['CASE', 'END', 'EOF'].includes(this.currentToken.type)
            ) {
                defaultBody.push(this.statement());
            }
        } else {
            break;
        }
    }

    this.expect('END');

    return { type: 'Switch', value, cases, defaultBody };
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

    forStatement() {
    this.advance(); // pular 'para'

    // para cada item em lista:
    if (this.currentToken && this.currentToken.type === 'CADA') {
        this.advance(); // pular 'cada'
        const varName = this.expect('IDENTIFIER').value;
        this.expect('EM');
        const iterable = this.expression();
        this.expect('COLON');

        const body = [];
        while (this.currentToken && this.currentToken.type !== 'END' && this.currentToken.type !== 'EOF') {
            body.push(this.statement());
        }
        this.expect('END');
        return { type: 'ForEach', varName, iterable, body };
    }

    // para i de 1 ate 10: (lógica original)
    const varName = this.expect('IDENTIFIER').value;
    this.expect('DE');
    const start = this.expression();
    this.expect('ATE');
    const end = this.expression();
    this.expect('COLON');

    const body = [];
    while (this.currentToken && this.currentToken.type !== 'END' && this.currentToken.type !== 'EOF') {
        body.push(this.statement());
    }
    this.expect('END');
    return { type: 'For', varName, start, end, body };
}

    importStatement() {
    this.advance(); // pular 'importar'

    if (this.currentToken.type === 'LBRACE') {
        this.advance();
        const names = [];
        while (this.currentToken.type !== 'RBRACE') {
            names.push(this.expect('IDENTIFIER').value);
            if (this.currentToken.type === 'COMMA') {
                this.advance();
            }
        }
        this.advance();
        this.expect('DE');
        const source = this.expect('STRING').value;
        return { type: 'ImportNamed', names, source };
    }

    const name = this.expect('IDENTIFIER').value;
    this.expect('DE');
    const source = this.expect('STRING').value;
    return { type: 'Import', name, source };
}

    assignmentStatement() {
    const name = this.expect('IDENTIFIER').value;
    let target = { type: 'Identifier', name };

    // Suporta encadeamento de DOT e LBRACKET
    while (this.currentToken && (
        this.currentToken.type === 'DOT' ||
        this.currentToken.type === 'LBRACKET'
    )) {
        if (this.currentToken.type === 'DOT') {
            this.advance();
            const property = this.expect('IDENTIFIER').value;
            target = {
                type: 'PropertyAccess',
                object: target,
                property
            };
        } else if (this.currentToken.type === 'LBRACKET') {
            this.advance();
            const index = this.expression();
            this.expect('RBRACKET');
            target = {
                type: 'IndexAccess',
                object: target,
                index
            };
        }
    }

    this.expect('ASSIGN');
    const value = this.expression();
    return { type: 'Assignment', name: target, value };
}

    comparison() {
        let left = this.comparisonUnit();

        while (
            this.currentToken &&
            ['AND', 'OR'].includes(this.currentToken.type)
        ) {
            const operator = this.currentToken.type;
            this.advance();
            const right = this.comparisonUnit();
            left = { type: 'LogicalOp', operator, left, right };
        }

        return left;
    }

    comparisonUnit() {
        if (this.currentToken && this.currentToken.type === 'NOT') {
            this.advance();
            const operand = this.comparisonUnit();
            return { type: 'UnaryOp', operator: 'NOT', operand };
        }

        let left = this.expression();

        if (
            this.currentToken &&
            ['GT', 'LT', 'EQ', 'NEQ', 'GTE', 'LTE', 'KW_GT', 'KW_LT', 'KW_EQ', 'KW_GTE', 'KW_LTE'].includes(this.currentToken.type)
        ) {
            let operator = this.currentToken.type;
            const kwMap = { 'KW_GT': 'GT', 'KW_LT': 'LT', 'KW_EQ': 'EQ', 'KW_GTE': 'GTE', 'KW_LTE': 'LTE' };
            if (kwMap[operator]) operator = kwMap[operator];
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
            ['PLUS', 'MINUS', 'KW_PLUS', 'KW_MINUS'].includes(this.currentToken.type)
        ) {
            const op = this.currentToken.type;
            const operator = op === 'KW_PLUS' ? 'PLUS' : op === 'KW_MINUS' ? 'MINUS' : op;
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
            ['MULT', 'DIV', 'KW_MULT', 'KW_DIV'].includes(this.currentToken.type)
        ) {
            const op = this.currentToken.type;
            const operator = op === 'KW_MULT' ? 'MULT' : op === 'KW_DIV' ? 'DIV' : op;
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

        if (token.type === 'TRUE') {
            this.advance();
            return { type: 'Boolean', value: true };
        }

        if (token.type === 'FALSE') {
            this.advance();
            return { type: 'Boolean', value: false };
        }

        if (token.type === 'NULL') {
            this.advance();
            return { type: 'Null' };
        }

        // ARRAY LITERAL
        if (token.type === 'LBRACKET') {
            return this.arrayLiteral();
        }

        // ✅ OBJECT LITERAL - NOVO!
        if (token.type === 'LBRACE') {
            return this.objectLiteral();
        }
        
                // ✅ FUNÇÃO ANÔNIMA / CALLBACK - NOVO!
        if (token.type === 'FUNCTION') {
            this.advance(); // Pula o token 'funcao'
            
            this.expect('LPAREN'); // Espera o '('
            const params = [];
            while (this.currentToken && this.currentToken.type !== 'RPAREN') {
                params.push(this.expect('IDENTIFIER').value);
                if (this.currentToken.type === 'COMMA') {
                    this.advance();
                }
            }
            this.expect('RPAREN'); // Espera o ')'
            
            this.expect('COLON'); // Espera o ':' (ou mude para o caractere que sua linguagem usa após os parâmetros)

            const body = [];
            // Lê o corpo da função até encontrar o token 'fim'
            while (this.currentToken && this.currentToken.type !== 'END') { 
                body.push(this.statement());
            }
            this.expect('END'); // Consome o token 'fim'

            return {
                type: 'FunctionLiteral', // Nome exato que colocamos no passo anterior do seu Evaluator!
                params: params,
                body: body
            };
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

            // Property access e Method chaining
            while (this.currentToken && this.currentToken.type === 'DOT') {
                this.advance();
                const propertyOrMethod = this.expect('IDENTIFIER').value;

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

                    result = {
                        type: 'MethodCall',
                        object: result,
                        method: propertyOrMethod,
                        args
                    };
                } else {
                    result = {
                        type: 'PropertyAccess',
                        object: result,
                        property: propertyOrMethod
                    };
                }
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
    
    tryCatchStatement() {
    this.advance(); // pular 'tente'
    this.expect('COLON');

    const body = [];
    while (
        this.currentToken &&
        this.currentToken.type !== 'CAPTURAR' &&
        this.currentToken.type !== 'EOF'
    ) {
        body.push(this.statement());
    }

    this.expect('CAPTURAR');
    this.expect('LPAREN');
    const errorVar = this.expect('IDENTIFIER').value;
    this.expect('RPAREN');
    this.expect('COLON');

    const catchBody = [];
    while (
        this.currentToken &&
        this.currentToken.type !== 'END' &&
        this.currentToken.type !== 'EOF'
    ) {
        catchBody.push(this.statement());
    }

    this.expect('END');

    return { type: 'TryCatch', body, errorVar, catchBody };
}

    // Parse array literal [1, 2, 3]
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

    // ✅ NOVO: Parse object literal {chave: valor, ...}
    objectLiteral() {
        this.expect('LBRACE');  // {
        const properties = {};

        while (this.currentToken && this.currentToken.type !== 'RBRACE') {
            // Nome da propriedade (pode ser IDENTIFIER ou STRING)
            let key;
            
            if (this.currentToken.type === 'IDENTIFIER') {
                key = this.currentToken.value;
                this.advance();
            } else if (this.currentToken.type === 'STRING') {
                key = this.currentToken.value;
                this.advance();
            } else {
                throw new Error(
                    `❌ Erro na linha ${this.currentToken.line}: ` +
                    `Esperava nome de propriedade (identificador ou string), ` +
                    `mas encontrou ${this.currentToken.type}`
                );
            }

            // Dois pontos
            this.expect('COLON');

            // Valor da propriedade
            const value = this.expression();

            properties[key] = value;

            // Vírgula opcional entre propriedades
            if (this.currentToken && this.currentToken.type === 'COMMA') {
                this.advance();
            }
        }

        this.expect('RBRACE');  // }

        return { type: 'ObjectLiteral', properties };
    }
}

module.exports = Parser;
