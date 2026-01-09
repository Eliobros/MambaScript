const fs = require('fs');
const Lexer = require('./Lexer/lexer');
const Parser = require('./Parser/parser');
const Evaluator = require('./Evaluator/evaluate');

// Verifica se foi passado um arquivo
if (process.argv.length < 3) {
    console.log('Uso: node index.js <arquivo.ms>');
    process.exit(1);
}

// Lê o arquivo .ms
const filename = process.argv[2];
console.log('📁 Lendo arquivo:', filename);

const code = fs.readFileSync(filename, 'utf-8');
console.log('📄 Código lido:');
console.log(code);

try {
    // 1. Lexer: transforma código em tokens
    console.log('\n🔍 Iniciando Lexer...');
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    console.log('✅ Tokens gerados:', tokens.length);
    
    // 2. Parser: transforma tokens em AST
    console.log('\n🌳 Iniciando Parser...');
    const parser = new Parser(tokens);
    const ast = parser.parse();
    console.log('✅ AST gerada');
    
    // 3. Evaluator: executa a AST
    console.log('\n▶️ Executando código...\n');
    const evaluator = new Evaluator();
    evaluator.execute(ast);
    
    console.log('\n✅ Execução completa!');
    
} catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error.stack);
}
