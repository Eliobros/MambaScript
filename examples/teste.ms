# Teste completo de JSON em MambaScript

escreva("=== TESTE 1: Ler JSON de arquivo ===")
variavel dados = json_ler("pessoa.json")
escreva("Dados carregados:")
escreva(dados)

escreva("")
escreva("=== TESTE 2: Acessar propriedades ===")
escreva("Nome:")
escreva(dados.nome)
escreva("Idade:")
escreva(dados.idade)
escreva("Cidade:")
escreva(dados.cidade)

escreva("")
escreva("=== TESTE 3: Modificar propriedades ===")
dados.nome = "João Silva"
dados.idade = 30
dados.cidade = "São Paulo"
escreva("Dados modificados:")
escreva(dados.nome)
escreva(dados.idade)
escreva(dados.cidade)

escreva("")
escreva("=== TESTE 4: Salvar JSON ===")
json_escrever("pessoa_atualizada.json", dados)
escreva("Arquivo salvo: pessoa_atualizada.json")

escreva("")
escreva("=== TESTE 5: Parsear string JSON ===")
variavel textoJson = '{"produto":"Notebook","preco":2500,"estoque":10}'
variavel produto = json_texto(textoJson)
escreva("Produto:")
escreva(produto.produto)
escreva("Preço:")
escreva(produto.preco)
escreva("Estoque:")
escreva(produto.estoque)

escreva("")
escreva("=== TESTE 6: Criar e salvar novo JSON ===")
variavel config = json_texto('{"tema":"escuro","idioma":"pt-BR","versao":1.0}')
escreva("Configuração:")
escreva(config)
json_escrever("config.json", config)
escreva("Arquivo config.json criado!")

escreva("")
escreva("✅ Todos os testes completados com sucesso!")
