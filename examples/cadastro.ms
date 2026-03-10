escreva "==============="
escreva "CADASTRO ALAUDA API"
escreva "==============="

#pegar os dados do usuario

escreva "Digite o seu nome de Usuario"
variavel username = ler()

escreva "Digite o seu email"
variavel email = ler()

escreva "Digite o seu numero de celular com o prefixo +"
variavel numero = ler().paraNumero()

escreva "Digite a sua senha"
variavel senha = ler()

variavel dados = json_ler("usuarios.json")
escreva "Dados carregados......"

se dados == nulo:
  dados = []
fim 

dados.adicionar({
  username: username,
  email: email,
  numero: numero,
  senha: senha
})

json_escrever("usuarios.json", dados )
escreva "Dados cadastrados com sucesso na alauda api"


