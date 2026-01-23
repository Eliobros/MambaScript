# Teste completo de arrays

escreva "=== ARRAYS EM MAMBASCRIPT ==="
escreva ""

# 1. Criar array
variavel numeros = [10, 20, 30, 40, 50]
escreva "Array criado: [10, 20, 30, 40, 50]"

# 2. Acesso por índice
escreva ""
escreva "numeros[0] = " + numeros[0].paraTexto()
escreva "numeros[2] = " + numeros[2].paraTexto()
escreva "numeros[4] = " + numeros[4].paraTexto()

# 3. Tamanho
escreva ""
escreva "Tamanho: " + numeros.tamanho().paraTexto()

# 4. Adicionar elemento
escreva ""
escreva "Adicionando 60..."
numeros.adicionar(60)
escreva "Novo tamanho: " + numeros.tamanho().paraTexto()
escreva "Último elemento: " + numeros[5].paraTexto()

# 5. Iterar com enquanto
escreva ""
escreva "Todos os elementos:"
variavel i = 0
enquanto i < numeros.tamanho():
  escreva "  [" + i.paraTexto() + "] = " + numeros[i].paraTexto()
  i = i + 1
fim

# 6. Verificar se contém
escreva ""
se numeros.contem(30) == 1:
  escreva "✅ Array contém 30"
fim

se numeros.contem(100) == 0:
  escreva "❌ Array não contém 100"
fim

# 7. Juntar elementos
escreva ""
escreva "Juntar com '-': " + numeros.juntar(" - ")

# 8. Remover elemento
escreva ""
escreva "Removendo índice 2..."
numeros.remover(2)
escreva "Novo tamanho: " + numeros.tamanho().paraTexto()

# 9. Array de strings
escreva ""
variavel nomes = ["Habibo", "Mary", "Uzui"]
escreva "Nomes: " + nomes.juntar(", ")

escreva ""
escreva "🎉 Arrays funcionando perfeitamente!"
