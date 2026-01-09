class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class Lexer {
    constructor(code) {
        this.code = code;
        this.pos = 0;
        this.currentChar = this.code[this.pos];
    }

    advance() {
        this.pos++;
        this.currentChar = this.pos < this.code.length ? this.code[this.pos] : null;
    }

    skipWhitespace() {
        while (this.currentChar && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    skipComment() {
        if (this.currentChar === '#') {
            while (this.currentChar && this.currentChar !== '\n') {
                this.advance();
            }
        }
    }

    readNumber() {
        let num = '';
        while (this.currentChar && /[0-9.]/.test(this.currentChar)) {
            num += this.currentChar;
            this.advance();
        }
        return parseFloat(num);
    }

    readString() {
        let str = '';
        this.advance(); // pula a aspas inicial
        
        while (this.currentChar && this.currentChar !== '"') {
            str += this.currentChar;
            this.advance();
        }
        
        this.advance(); // pula a aspas final
        return str;
    }

    readIdentifier() {
        let id = '';
        while (this.currentChar && /[a-záàãâéêíóôõúçA-Z_]/.test(this.currentChar)) {
            id += this.currentChar;
            this.advance();
        }
        return id;
    }

    tokenize() {
        const tokens = [];

        while (this.currentChar) {
            // Ignora espaços e comentários
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            if (this.currentChar === '#') {
                this.skipComment();
                continue;
            }

            // Números
            if (/[0-9]/.test(this.currentChar)) {
                tokens.push(new Token('NUMBER', this.readNumber()));
                continue;
            }

            // Strings
            if (this.currentChar === '"') {
                tokens.push(new Token('STRING', this.readString()));
                continue;
            }

            // Operadores
            if (this.currentChar === '+') {
                tokens.push(new Token('PLUS', '+'));
                this.advance();
                continue;
            }

            if (this.currentChar === '-') {
                tokens.push(new Token('MINUS', '-'));
                this.advance();
                continue;
            }

            if (this.currentChar === '*') {
                tokens.push(new Token('MULTIPLY', '*'));
                this.advance();
                continue;
            }

            if (this.currentChar === '/') {
                tokens.push(new Token('DIVIDE', '/'));
                this.advance();
                continue;
            }

            if (this.currentChar === '(') {
                tokens.push(new Token('LPAREN', '('));
                this.advance();
                continue;
            }

            if (this.currentChar === ')') {
                tokens.push(new Token('RPAREN', ')'));
                this.advance();
                continue;
            }

            if (this.currentChar === '=') {
                tokens.push(new Token('EQUALS', '='));
                this.advance();
                continue;
            }

            if (this.currentChar === ':') {
                tokens.push(new Token('COLON', ':'));
                this.advance();
                continue;
            }

            if (this.currentChar === ',') {
                tokens.push(new Token('COMMA', ','));
                this.advance();
                continue;
            }

            if (this.currentChar === '.') {
                tokens.push(new Token('DOT', '.'));
                this.advance();
                continue;
            }

            if (this.currentChar === '>') {
                this.advance();
                if (this.currentChar === '=') {
                    tokens.push(new Token('GREATER_EQUAL', '>='));
                    this.advance();
                } else {
                    tokens.push(new Token('GREATER', '>'));
                }
                continue;
            }

            if (this.currentChar === '<') {
                this.advance();
                if (this.currentChar === '=') {
                    tokens.push(new Token('LESS_EQUAL', '<='));
                    this.advance();
                } else {
                    tokens.push(new Token('LESS', '<'));
                }
                continue;
            }

            // Palavras-chave e identificadores
            if (/[a-záàãâéêíóôõúçA-Z_]/.test(this.currentChar)) {
                const id = this.readIdentifier();
                
                // Palavras-chave em português
                const keywords = {
                    'escreva': 'PRINT',
                    'variavel': 'VAR',
                    'se': 'IF',
                    'senao': 'ELSE',
                    'enquanto': 'WHILE',
                    'funcao': 'FUNCTION',
                    'retorna': 'RETURN',
                    'maior': 'GREATER',
                    'menor': 'LESS',
                    'igual': 'EQUALS_COMP',
                    'maiorIgual': 'GREATER_EQUAL',
                    'menorIgual': 'LESS_EQUAL',
                    'mais': 'PLUS',
                    'menos': 'MINUS',
                    'vezes': 'MULTIPLY',
                    'dividido': 'DIVIDE'
                };

                const tokenType = keywords[id] || 'IDENTIFIER';
                tokens.push(new Token(tokenType, id));
                continue;
            }

            throw new Error(`Caractere inválido: ${this.currentChar}`);
        }

        tokens.push(new Token('EOF', null));
        return tokens;
    }
}

module.exports = Lexer;
