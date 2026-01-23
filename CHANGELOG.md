# Changelog

## [2.0.1] - 2026-01-24

### Corrigido
- **CRÍTICO**: Operadores de comparação (`==`, `>`, `<`, `>=`, `<=`) não funcionavam corretamente
- Evaluator agora reconhece tokens `EQ`, `GT`, `LT`, `GTE`, `LTE`
- Mantém compatibilidade com nomes de tokens antigos

## [2.0.0] - 2026-01-24

### 💥 BREAKING CHANGES
- **Blocos agora exigem `fim`**: Todos os blocos `se`, `senao`, `enquanto` e `funcao` devem ser fechados com a palavra-chave `fim`.

### Adicionado
- Keyword `fim` para delimitar blocos
- Mensagens de erro com dicas contextuais
- Tradução de tokens em português nas mensagens de erro

### Melhorado
- Parser mais robusto e confiável
- Detecção de erros de sintaxe mais clara

## [1.1.0] - 2026-01-13

### Adicionado
- Função `hoje()` com suporte a timezone
- Métodos `.mostrarData()`, `.mostrarHora()`, `.ano()`
- Error handling melhorado

## [1.0.0] - 2026-01-XX

### Adicionado
- Lançamento inicial! 🎉
- Variáveis, funções, condicionais, loops
- Input/Output, operadores matemáticos
- Comentários
