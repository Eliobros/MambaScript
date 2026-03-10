# ============================
# Teste das novas features
# ============================

escreva "=== 1. PARA loop ==="
para i de 1 ate 5:
    escreva i
fim

escreva ""
escreva "=== 2. Verdadeiro / Falso / Nulo ==="
variavel ativo = verdadeiro
variavel bloqueado = falso
variavel dados = nulo
escreva ativo
escreva bloqueado
escreva dados

escreva ""
escreva "=== 3. Operadores lógicos (e / ou / nao) ==="
variavel idade = 20
variavel temCartao = verdadeiro

se idade > 18 e temCartao == verdadeiro:
    escreva "Acesso permitido!"
fim

se idade > 30 ou temCartao == verdadeiro:
    escreva "Pelo menos uma condição é verdadeira!"
fim

se nao bloqueado:
    escreva "Utilizador não está bloqueado!"
fim

escreva ""
escreva "=== 4. Objectos (bug corrigido) ==="
variavel pessoa = {nome: "Habibo", idade: 25, cidade: "Maputo"}
escreva pessoa.nome
escreva pessoa.idade
escreva pessoa.cidade

escreva ""
escreva "=== 5. Importar módulo local ==="
importar utils de "utils"
escreva utils.saudacao("Habibo")
escreva utils.dobro(21)
escreva utils.versao

escreva ""
escreva "=== 6. Importar módulo built-in (matematica) ==="
importar mat de "matematica"
escreva mat.PI
escreva mat.raiz(144)
escreva mat.potencia(2, 10)

escreva ""
escreva "✅ Todas as novas features funcionam!"
