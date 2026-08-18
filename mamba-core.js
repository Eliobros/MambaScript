// mamba-core.js
const Lexer     = require('./Lexer/lexer');
const Parser    = require('./Parser/parser');
const Evaluator = require('./Evaluator/evaluate');

// Função que o Kotlin vai chamar passando o caminho do arquivo (ex: "/root/index.ms")
globalThis.executarMamba = async function(caminhoArquivoPrincipal) {
    try {
        // Buscamos o código fonte usando o nosso fs-mock injetado
        const fs = require('fs');
        const code = fs.readFileSync(caminhoArquivoPrincipal, 'utf-8');

        const lexer     = new Lexer(code);
        const tokens    = lexer.tokenize();
        const parser    = new Parser(tokens);
        const ast       = parser.parse();
        
        // Passamos o caminho para o Evaluator manter o contexto de imports relativos
        const evaluator = new Evaluator(caminhoArquivoPrincipal);
        
        await evaluator.execute(ast);
        return JSON.stringify({ sucesso: true });
    } catch (error) {
        return JSON.stringify({ 
            sucesso: false, 
            erro: error.message || 'Erro desconhecido na execução.' 
        });
    }
};
