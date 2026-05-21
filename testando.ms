tente:
    variavel x = json_ler("nao_existe.json")
capturar (erro):
    escreva "Capturado: " + erro
fim

# 2. Escopo de variáveis
variavel contador = 0
funcao incrementar():
    contador = contador + 1
fim
incrementar()
escreva contador  # deve imprimir 1

# 3. Try dentro de função
funcao lerConfig(arquivo):
    tente:
        retorna json_ler(arquivo)
    capturar (erro):
        retorna nulo
    fim
fim
