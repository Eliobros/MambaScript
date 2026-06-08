# 🐍 MambaScript

**Linguagem de programação moçambicana — Rápida, poderosa e em português!**

[![npm version](https://img.shields.io/npm/v/mambascript-mz.svg)](https://www.npmjs.com/package/mambascript-mz)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D%2014-brightgreen.svg)](https://nodejs.org/)
[![GitHub](https://img.shields.io/github/stars/Eliobros/MambaScript?style=social)](https://github.com/Eliobros/MambaScript)

MambaScript é uma linguagem de programação criada em Moçambique, com sintaxe totalmente em português. Projetada para ser acessível, expressiva e poderosa, permite que programadores lusófonos escrevam código na sua língua materna.

---

## 📑 Índice

1. [Instalação](#-instalação)
2. [Início Rápido](#-início-rápido)
3. [Tipos de Dados](#-tipos-de-dados)
4. [Variáveis](#-variáveis)
5. [Operadores](#-operadores)
6. [Entrada e Saída](#-entrada-e-saída)
7. [Estruturas de Controle](#-estruturas-de-controle)
8. [Funções](#-funções)
9. [Tratamento de Erros](#-tratamento-de-erros)
10. [Strings](#-strings)
11. [Números](#-números)
12. [Arrays](#-arrays)
13. [Objectos](#-objectos)
14. [Sistema de Importação](#-sistema-de-importação)
15. [Módulos Built-in](#-módulos-built-in)
16. [Funções Built-in](#-funções-built-in)
17. [Servidor HTTP](#-servidor-http)
18. [Base de Dados MySQL](#-base-de-dados-mysql)
19. [Sistema de Pacotes](#-sistema-de-pacotes)
20. [Exemplos Completos](#-exemplos-completos)
21. [Contribuição](#-contribuição)
22. [Licença](#-licença)

---

## 📦 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 14 ou superior

### Via npm (recomendado)

```bash
npm install -g mambascript-mz
```

### Verificar instalação

```bash
mambas --versao
```

### Executar um programa

Crie um arquivo com a extensão `.ms` e execute com o comando `mambas`:

```bash
mambas meu_programa.ms
```

---

## 🚀 Início Rápido

Crie um arquivo chamado `ola.ms`:

```ms
# O meu primeiro programa em MambaScript!
escreva "Olá, Mundo! 🐍"

variavel nome = "Moçambique"
escreva "Bem-vindo ao MambaScript, " + nome + "!"
```

Execute:

```bash
mambas ola.ms
```

Saída:

```
Olá, Mundo! 🐍
Bem-vindo ao MambaScript, Moçambique!
```

---

## 📊 Tipos de Dados

MambaScript suporta os seguintes tipos de dados:

| Tipo | Exemplo | Descrição |
|------|---------|-----------|
| Número | `10`, `3.14` | Inteiros e decimais |
| String | `"olá"`, `'mundo'` | Texto entre aspas duplas ou simples |
| Booleano | `verdadeiro`, `falso` | Valores lógicos |
| Nulo | `nulo` | Ausência de valor |
| Array | `[1, 2, 3]` | Lista ordenada de valores |
| Objecto | `{nome: "Ana"}` | Coleção de pares chave-valor |

```ms
variavel inteiro = 42
variavel decimal = 3.14
variavel saudacao = "Olá!"
variavel ativo = verdadeiro
variavel vazio = nulo
variavel frutas = ["manga", "papaia", "coco"]
variavel pessoa = {nome: "Habibo", idade: 25}
```

---

## 📝 Variáveis

As variáveis são declaradas com a palavra-chave `variavel`:

```ms
variavel nome = "MambaScript"
variavel versao = 2
variavel ativo = verdadeiro

escreva nome
escreva versao
escreva ativo
```

As variáveis podem ser reatribuídas:

```ms
variavel contador = 0
contador = contador + 1
escreva contador
```

---

## ➕ Operadores

### Operadores Aritméticos

MambaScript permite usar **símbolos** ou **palavras-chave** em português:

| Operação | Símbolo | Palavra-chave | Exemplo |
|----------|---------|---------------|---------|
| Adição | `+` | `mais` | `5 + 3` ou `5 mais 3` |
| Subtração | `-` | `menos` | `10 - 4` ou `10 menos 4` |
| Multiplicação | `*` | `vezes` | `6 * 7` ou `6 vezes 7` |
| Divisão | `/` | `dividido` | `20 / 5` ou `20 dividido 5` |

```ms
escreva 10 + 5
escreva 10 mais 5
escreva 4 vezes 3
escreva 15 dividido 3
```

### Operadores de Comparação

| Operação | Símbolo | Palavra-chave |
|----------|---------|---------------|
| Igual | `==` | `igual` |
| Diferente | `!=` | — |
| Maior que | `>` | `maior` |
| Menor que | `<` | `menor` |
| Maior ou igual | `>=` | `maiorIgual` |
| Menor ou igual | `<=` | `menorIgual` |

```ms
variavel a = 10
variavel b = 20

escreva a == b
escreva a != b
escreva a > b
escreva a <= b
```

### Operadores Lógicos

| Operador | Descrição | Exemplo |
|----------|-----------|---------|
| `e` | E lógico (AND) | `verdadeiro e falso` |
| `ou` | OU lógico (OR) | `verdadeiro ou falso` |
| `nao` | Negação (NOT) | `nao verdadeiro` |

```ms
variavel temIdade = verdadeiro
variavel temDocumento = verdadeiro

se temIdade e temDocumento:
    escreva "Aprovado!"
fim
```

---

## 📡 Entrada e Saída

### Saída (escreva)

```ms
escreva "Olá, Mundo!"
escreva 42
escreva verdadeiro
```

### Entrada (ler)

```ms
escreva "Qual é o teu nome?"
variavel nome = ler()
escreva "Olá, " + nome + "!"
```

---

## 🔀 Estruturas de Controle

### Condicional (se / senao)

```ms
variavel idade = 18

se idade >= 18:
    escreva "É maior de idade."
senao:
    escreva "É menor de idade."
fim
```

### Condicionais Aninhadas (senao + se)

Para encadear múltiplas condições, use `senao` com um `se` dentro:

```ms
variavel nota = 85

se nota >= 90:
    escreva "Excelente!"
senao:
    se nota >= 70:
        escreva "Bom trabalho!"
    senao:
        se nota >= 50:
            escreva "Suficiente."
        senao:
            escreva "Precisa melhorar."
        fim
    fim
fim
```

### Escolha (escolha / caso / padrao)

Use `escolha` para comparar um valor com múltiplos casos:

```ms
variavel dia = 2

escolha dia:
    caso 1:
        escreva "Segunda-feira"
        parar
    caso 2:
        escreva "Terça-feira"
        parar
    caso 3:
        escreva "Quarta-feira"
        parar
    padrao:
        escreva "Outro dia"
fim
```

> ⚠️ Use `parar` ao final de cada caso para evitar que a execução continue nos próximos casos.

### Ciclo Enquanto

```ms
variavel contador = 1

enquanto contador <= 5:
    escreva "Contagem: " + contador
    contador = contador + 1
fim
```

### Ciclo Para

```ms
para i de 1 ate 10:
    escreva i
fim
```

Exemplo com cálculo:

```ms
# Tabuada do 7
para i de 1 ate 10:
    escreva "7 x " + i + " = " + (7 * i)
fim
```

### Ciclo Para Cada

```ms
variavel frutas = ["manga", "papaia", "banana", "coco"]

para cada fruta em frutas:
    escreva fruta
fim
Use para i de X ate Y quando precisas do índice numérico, e para cada quando só precisas dos valores diretamente.


### Controle de Ciclos (parar / continuar)

Use `parar` para sair de um ciclo e `continuar` para pular para a próxima iteração:

```ms
# parar — sai do ciclo quando i == 3
para i de 1 ate 10:
    se i == 3:
        parar
    fim
    escreva i
fim
# Saída: 1, 2

# continuar — pula i == 3
para i de 1 ate 5:
    se i == 3:
        continuar
    fim
    escreva i
fim
# Saída: 1, 2, 4, 5
```

---

## 🔧 Funções

Funções são declaradas com `funcao` e encerradas com `fim`:

```ms
funcao saudacao(nome):
    escreva "Olá, " + nome + "!"
fim

saudacao("Habibo")
```

### Funções com retorno

```ms
funcao soma(a, b):
    retorna a + b
fim

variavel resultado = soma(10, 20)
escreva resultado
```

### Funções como variáveis

As funções podem ser atribuídas a variáveis e passadas como argumentos:

```ms
variavel dobrar = funcao(x):
    retorna x * 2
fim

escreva dobrar(5)
```

### Funções recursivas

```ms
funcao fatorial(n):
    se n <= 1:
        retorna 1
    fim
    retorna n * fatorial(n - 1)
fim

escreva fatorial(5)
```

---

## 🛡️ Tratamento de Erros

Use `tentar` e `pegar` para lidar com erros em tempo de execução:

```ms
tentar:
    variavel dados = json_ler("ficheiro.json")
    escreva dados.nome
pegar erro:
    escreva "Ocorreu um erro: " + erro
fim
```

---

## 🔤 Strings

### Métodos de String

| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `.tamanho()` | Comprimento da string | `"olá".tamanho()` → `3` |
| `.maiuscula()` | Converte para maiúsculas | `"olá".maiuscula()` → `"OLÁ"` |
| `.minuscula()` | Converte para minúsculas | `"OLÁ".minuscula()` → `"olá"` |
| `.paraNumero()` | Converte string para número | `"42".paraNumero()` → `42` |
| `.dividir(sep)` | Divide em array pelo separador | `"a,b".dividir(",")` → `["a","b"]` |
| `.aparar()` | Remove espaços nas extremidades | `" olá ".aparar()` → `"olá"` |
| `.incluir(sub)` | Verifica se contém a substring | `"mamba".incluir("mb")` → `verdadeiro` |
| `.começa_com(sub)` | Verifica o início | `"mamba".começa_com("ma")` → `verdadeiro` |
| `.termina_com(sub)` | Verifica o fim | `"mamba".termina_com("ba")` → `verdadeiro` |
| `.substituir(de, para)` | Substitui parte da string | `"ola".substituir("o","O")` → `"Ola"` |
| `.fatiar(inicio, fim?)` | Extrai parte da string | `"mamba".fatiar(0, 3)` → `"mam"` |

```ms
variavel texto = "  mambascript  "

escreva texto.aparar()
escreva texto.aparar().maiuscula()
escreva texto.aparar().tamanho()
escreva texto.aparar().incluir("script")
escreva texto.aparar().começa_com("mamba")
escreva texto.aparar().substituir("mamba", "MAMBA")
escreva texto.aparar().fatiar(0, 5)

variavel partes = "Maputo,Beira,Nampula".dividir(",")
escreva partes[0]
escreva partes[1]
```

---

## 🔢 Números

### Métodos de Número

| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `.paraTexto()` | Converte número para string | `42.paraTexto()` → `"42"` |

```ms
variavel idade = 25
escreva "Idade: " + idade.paraTexto()
```

---

## 📚 Arrays

### Criação e Acesso

```ms
variavel frutas = ["manga", "papaia", "banana", "coco"]

escreva frutas[0]
escreva frutas[2]
```

### Métodos de Array

| Método | Descrição |
|--------|-----------|
| `.tamanho()` | Número de elementos |
| `.adicionar(item)` | Adiciona ao final |
| `.remover(indice)` | Remove pelo índice |
| `.pegar(indice)` | Obtém pelo índice |
| `.contem(item)` | Verifica se contém |
| `.juntar(separador)` | Junta em string |

```ms
variavel numeros = [10, 20, 30]

numeros.adicionar(40)
escreva numeros.tamanho()
escreva numeros.contem(20)
escreva numeros.juntar(" - ")
numeros.remover(0)
escreva numeros.pegar(0)
```

### Iterar sobre um Array

```ms
variavel cidades = ["Maputo", "Beira", "Nampula", "Quelimane"]

para i de 0 ate cidades.tamanho() - 1:
    escreva cidades[i]
fim
```

---

## 🏗️ Objectos

### Criação e Acesso

```ms
variavel pessoa = {
    nome: "Habibo",
    idade: 25,
    cidade: "Maputo"
}

escreva pessoa.nome
escreva pessoa.idade
```

### Modificação de Propriedades

```ms
pessoa.nome = "João"
pessoa.idade = 30
escreva pessoa.nome
```

### Objectos com Arrays

```ms
variavel turma = {
    nome: "Turma A",
    alunos: ["Ana", "Carlos", "Maria"],
    nota_media: 15.5
}

escreva turma.nome
escreva turma.alunos[0]
```

---

## 📦 Sistema de Importação

### Importar Módulo Completo

```ms
importar matematica de "matematica"
escreva matematica.PI
```

### Importar Nomes Específicos

Podes importar apenas o que precisas de um módulo:

```ms
importar { raiz, potencia } de "matematica"

escreva raiz(144)
escreva potencia(2, 8)
```

### Importar Módulos Locais

Crie um arquivo em `modulos_mambas/`:

```ms
# modulos_mambas/utils.ms
funcao dobro(n):
    retorna n * 2
fim
```

Importe no programa principal:

```ms
importar utils de "utils"
escreva utils.dobro(10)

# Ou com importação nomeada:
importar { dobro } de "utils"
escreva dobro(10)
```

### Módulos Built-in Disponíveis

```ms
importar matematica de "matematica"
importar fs de "fs"
importar caminho de "caminho"
importar http de "http"
importar bd de "mysql"
importar sistema de "sistema"
```

---

## 🔩 Módulos Built-in

### 📐 Módulo `matematica`

| Função / Constante | Descrição |
|---------------------|-----------|
| `PI` | Valor de π |
| `raiz(n)` | Raiz quadrada |
| `potencia(base, exp)` | Potenciação |
| `absoluto(n)` | Valor absoluto |
| `arredondar(n)` | Arredondamento |
| `teto(n)` | Arredondamento para cima |
| `chao(n)` | Arredondamento para baixo |
| `aleatorio()` | Número aleatório entre 0 e 1 |
| `aleatorio(min, max)` | Número inteiro aleatório entre min e max |
| `seno(n)` | Seno |
| `cosseno(n)` | Cosseno |

```ms
importar matematica de "matematica"

escreva matematica.PI
escreva matematica.raiz(144)
escreva matematica.potencia(2, 10)
escreva matematica.arredondar(3.7)
escreva matematica.aleatorio()
escreva matematica.aleatorio(1, 100)
```

### 📁 Módulo `fs`

| Função | Descrição |
|--------|-----------|
| `ler(arquivo)` | Lê o conteúdo de um arquivo |
| `escrever(arquivo, conteudo)` | Escreve num arquivo |
| `existe(arquivo)` | Verifica se o arquivo existe |
| `apagar(arquivo)` | Apaga um arquivo |

```ms
importar fs de "fs"

fs.escrever("dados.txt", "Olá, MambaScript!")
escreva fs.existe("dados.txt")
variavel conteudo = fs.ler("dados.txt")
escreva conteudo
fs.apagar("dados.txt")
```

### 📂 Módulo `caminho`

| Função | Descrição |
|--------|-----------|
| `juntar(...partes)` | Junta partes de um caminho |
| `diretorio(caminho)` | Retorna o diretório |
| `arquivo(caminho)` | Retorna o nome do arquivo |
| `extensao(caminho)` | Retorna a extensão |
| `absoluto(caminho)` | Retorna o caminho absoluto |

```ms
importar caminho de "caminho"

escreva caminho.juntar("pasta", "arquivo.ms")
escreva caminho.extensao("programa.ms")
escreva caminho.absoluto("programa.ms")
```

### 🖥️ Módulo `sistema`

Permite interagir com o sistema operativo e o ambiente de execução:

| Função | Descrição |
|--------|-----------|
| `plataforma()` | Retorna o sistema operativo (`linux`, `win32`, etc.) |
| `variavel(nome)` | Lê uma variável de ambiente |
| `executar(cmd)` | Executa um comando do sistema e retorna a saída |
| `sair(codigo?)` | Encerra o programa com um código de saída |
| `args()` | Retorna os argumentos passados na linha de comando |
| `pid()` | Retorna o ID do processo actual |
| `memoria()` | Retorna informação sobre o uso de memória |

```ms
importar sistema de "sistema"

escreva sistema.plataforma()
escreva sistema.pid()
escreva sistema.variavel("HOME")
escreva sistema.executar("echo Olá do sistema!")

variavel argumentos = sistema.args()
escreva argumentos

sistema.sair(0)
```

### 🌐 Módulo `http` — Cliente

| Função | Descrição |
|--------|-----------|
| `get(url, cabecalhos?)` | Requisição GET |
| `post(url, corpo, cabecalhos?)` | Requisição POST |
| `put(url, corpo, cabecalhos?)` | Requisição PUT |
| `apagar(url, cabecalhos?)` | Requisição DELETE |

Cada função retorna um objecto com:

| Propriedade | Descrição |
|-------------|-----------|
| `status` | Código HTTP da resposta |
| `corpo` | Corpo da resposta (JSON ou texto) |
| `texto` | Corpo como texto puro |
| `ok` | `verdadeiro` se status entre 200 e 299 |

```ms
importar http de "http"

variavel resposta = http.get("https://api.exemplo.com/dados")

se resposta.ok:
    escreva resposta.corpo
senao:
    escreva "Erro: " + resposta.status
fim

variavel resultado = http.post("https://api.exemplo.com/usuarios", {
    "nome": "Habibo",
    "email": "habibo@exemplo.com"
})
escreva resultado.status
```

---

## 🖥️ Servidor HTTP

```ms
importar http de "http"

variavel minhaFuncao = funcao(requisicao, resposta):
    se requisicao.url == "/":
        resposta.json(200, {"mensagem": "Bem-vindo!"})
    senao:
        resposta.json(404, {"erro": "Rota não encontrada"})
    fim
fim

variavel servidor = http.criarServidor()
servidor.aoReceber(minhaFuncao)
servidor.escutar(3000)
escreva "Servidor rodando na porta 3000!"
```

### Objecto `requisicao`

| Propriedade | Descrição |
|-------------|-----------|
| `url` | Caminho da rota (ex: `/api/usuarios`) |
| `metodo` | Método HTTP (`GET`, `POST`, etc.) |
| `corpo` | Corpo da requisição (JSON ou texto) |
| `params` | Query parameters (`?id=1&nome=Elio`) |
| `cabecalhos` | Headers da requisição |

### Objecto `resposta`

| Método | Descrição |
|--------|-----------|
| `enviar(status, conteudo)` | Envia texto ou JSON automaticamente |
| `json(status, conteudo)` | Envia resposta JSON explícita |
| `cabecalho(chave, valor)` | Define um header na resposta |
| `redirecionar(url)` | Redireciona para outra URL |

### Exemplo Completo de API

```ms
importar http de "http"

variavel handler = funcao(requisicao, resposta):
    variavel rota = requisicao.url

    resposta.cabecalho("X-Powered-By", "MambaScript")
    resposta.cabecalho("Access-Control-Allow-Origin", "*")

    se rota == "/":
        resposta.json(200, {
            "mensagem": "API MambaScript",
            "versao": "1.0",
            "status": "online"
        })
    senao:
        se rota == "/api/usuario":
            variavel nome = requisicao.params.nome
            resposta.json(200, {
                "nome": nome,
                "linguagem": "MambaScript"
            })
        senao:
            resposta.json(404, {
                "erro": "Rota não encontrada",
                "rota": rota
            })
        fim
    fim
fim

variavel servidor = http.criarServidor()
servidor.aoReceber(handler)
servidor.escutar(3000)
escreva "API rodando na porta 3000!"
```

---

## 🗄️ Base de Dados MySQL

### Pré-requisito

```bash
npm install mysql2
```

### Funções do Módulo `mysql`

| Função | Descrição |
|--------|-----------|
| `conectar(host, usuario, senha, base, porta?)` | Conecta ao banco de dados (porta padrão: 3306) |
| `consultar(sql, parametros?)` | Executa SELECT, retorna array |
| `executar(sql, parametros?)` | Executa INSERT/UPDATE/DELETE |
| `fechar()` | Fecha a conexão |

O método `executar` retorna:

| Propriedade | Descrição |
|-------------|-----------|
| `afetadas` | Número de linhas afetadas |
| `inseridoId` | ID do último registo inserido |
| `ok` | `verdadeiro` se afetou alguma linha |

```ms
importar bd de "mysql"

bd.conectar("localhost", "root", "senha", "minha_base")

variavel usuarios = bd.consultar("SELECT * FROM usuarios")
escreva usuarios

variavel user = bd.consultar("SELECT * FROM usuarios WHERE id = ?", [1])
escreva user

variavel resultado = bd.executar(
    "INSERT INTO usuarios (nome, email) VALUES (?, ?)",
    ["Habibo", "habibo@exemplo.com"]
)
escreva "ID inserido: " + resultado.inseridoId

bd.executar("UPDATE usuarios SET nome = ? WHERE id = ?", ["Elio", 1])
bd.executar("DELETE FROM usuarios WHERE id = ?", [1])

bd.fechar()
```

---

## ⚡ Funções Built-in

### 📅 `hoje()`

Retorna um objecto com a data e hora actuais:

| Método | Descrição |
|--------|-----------|
| `mostrarData()` | Data formatada |
| `mostrarHora()` | Hora formatada |
| `ano()` | Ano actual |
| `dia()` | Dia do mês |
| `horas()` | Horas |
| `minutos()` | Minutos |
| `segundos()` | Segundos |
| `mes()` | Objecto com `numero` e `nome` |
| `semana()` | Objecto com `numero` e `nome` |
| `timestamp()` | Timestamp Unix |
| `formatado()` | Data no formato `DD/MM/AAAA` |
| `horaFormatada()` | Hora no formato `HH:MM:SS` |

```ms
variavel data = hoje()
escreva data.mostrarData()
escreva data.mostrarHora()
escreva data.ano()
escreva data.mes().nome
escreva data.semana().nome
escreva data.formatado()
escreva data.timestamp()

# Com fuso horário
variavel dataMZ = hoje("Africa/Maputo")
escreva dataMZ.horaFormatada()
```

### 📄 Funções JSON

| Função | Descrição |
|--------|-----------|
| `json_ler(arquivo)` | Lê e analisa um arquivo JSON |
| `json_texto(string)` | Analisa uma string JSON |
| `json_escrever(arquivo, dados)` | Escreve dados num arquivo JSON |

```ms
variavel config = json_ler("config.json")
escreva config.nome

variavel dados = json_texto('{"nome": "Mamba", "versao": 2}')
escreva dados.nome

variavel info = {nome: "MambaScript", versao: 2}
json_escrever("saida.json", info)
```

---

## 📦 Sistema de Pacotes

### Estrutura de um Pacote

```
meu-pacote/
├── index.ms       ← código da biblioteca
└── pacote.json    ← metadados
```

### Ficheiro `pacote.json`

```json
{
  "nome": "meu-pacote",
  "versao": "1.0.0",
  "descricao": "Descrição do que o pacote faz",
  "autor": "teu-nome"
}
```

### Ficheiro `index.ms`

```ms
funcao saudacao(nome):
    retorna "Olá, " + nome + "!"
fim

funcao despedida(nome):
    retorna "Até logo, " + nome + "!"
fim
```

### Usar Localmente

```
meu-projeto/
├── main.ms
└── modulos_mambas/
    └── meu-pacote/
        ├── index.ms
        └── pacote.json
```

```ms
importar meuPacote de "meu-pacote"

escreva meuPacote.saudacao("Mundo")
escreva meuPacote.despedida("Mundo")
```

### Gestor de Pacotes

```bash
mambas instalar nome-do-pacote
mambas remover nome-do-pacote
mambas listar
mambas procurar
```

### Partilhar com a Comunidade

1. Garanta que tem `index.ms` e `pacote.json`
2. Teste localmente em `modulos_mambas/`
3. Abra uma Issue em: [github.com/Eliobros/mambascript-pacotes](https://github.com/Eliobros/mambascript-pacotes)
4. Use o título: `[Pacote] nome-do-pacote`
5. Cole o código do `index.ms` e `pacote.json`
6. Aguarda aprovação!

---

## 💡 Exemplos Completos

### Exemplo 1: Calculadora Simples

```ms
funcao calculadora(a, operacao, b):
    se operacao == "+":
        retorna a + b
    fim
    se operacao == "-":
        retorna a - b
    fim
    se operacao == "*":
        retorna a * b
    fim
    se operacao == "/":
        se b == 0:
            escreva "Erro: Divisão por zero!"
            retorna nulo
        fim
        retorna a / b
    fim
    retorna nulo
fim

escreva "5 + 3 = " + calculadora(5, "+", 3)
escreva "10 - 4 = " + calculadora(10, "-", 4)
escreva "6 * 7 = " + calculadora(6, "*", 7)
escreva "20 / 4 = " + calculadora(20, "/", 4)
```

### Exemplo 2: Gestão de Alunos

```ms
variavel alunos = []

funcao adicionarAluno(nome, nota):
    alunos.adicionar({nome: nome, nota: nota})
    escreva "Aluno " + nome + " adicionado!"
fim

funcao mostrarResultados():
    para i de 0 ate alunos.tamanho() - 1:
        variavel status = "Reprovado"
        se alunos[i].nota >= 10:
            status = "Aprovado"
        fim
        escreva alunos[i].nome + ": " + alunos[i].nota + " - " + status
    fim
fim

adicionarAluno("Ana", 18)
adicionarAluno("Carlos", 8)
adicionarAluno("Maria", 15)
mostrarResultados()
```

### Exemplo 3: Usando o Módulo Sistema

```ms
importar sistema de "sistema"

escreva "Plataforma: " + sistema.plataforma()
escreva "PID: " + sistema.pid()

variavel porta = sistema.variavel("PORTA")
se porta == nulo:
    porta = "3000"
fim
escreva "Usando porta: " + porta

variavel saida = sistema.executar("date")
escreva "Data do sistema: " + saida
```

### Exemplo 4: API REST Completa com MySQL

```ms
importar http de "http"
importar bd de "mysql"

bd.conectar("localhost", "root", "senha", "escola_db")

variavel handler = funcao(requisicao, resposta):
    variavel rota = requisicao.url

    resposta.cabecalho("Access-Control-Allow-Origin", "*")
    resposta.cabecalho("X-Powered-By", "MambaScript")

    se rota == "/":
        resposta.json(200, {
            "api": "Escola MambaScript",
            "versao": "1.0",
            "rotas": ["/alunos", "/alunos/adicionar"]
        })
    senao:
        se rota == "/alunos":
            variavel alunos = bd.consultar("SELECT * FROM alunos")
            resposta.json(200, {"alunos": alunos})
        senao:
            resposta.json(404, {"erro": "Rota não encontrada"})
        fim
    fim
fim

variavel servidor = http.criarServidor()
servidor.aoReceber(handler)
servidor.escutar(3000)
escreva "API Escola rodando na porta 3000!"
```

### Exemplo 5: Trabalhando com Strings e Arrays

```ms
variavel frase = "  Olá, Moçambique e o Mundo!  "

escreva frase.aparar()
escreva frase.aparar().maiuscula()
escreva frase.aparar().tamanho()
escreva frase.aparar().incluir("Moçambique")
escreva frase.aparar().substituir("Mundo", "MambaScript")

variavel palavras = frase.aparar().dividir(" ")
para i de 0 ate palavras.tamanho() - 1:
    escreva palavras[i]
fim
```

### Exemplo 6: Trabalhando com Ficheiros e Módulos

```ms
importar matematica de "matematica"
importar fs de "fs"

funcao gerarRelatorio():
    variavel relatorio = "=== Relatório Matemático ===\n"
    relatorio = relatorio + "PI: " + matematica.PI + "\n"
    relatorio = relatorio + "Raiz de 256: " + matematica.raiz(256) + "\n"
    relatorio = relatorio + "2^8: " + matematica.potencia(2, 8) + "\n"
    para i de 1 ate 10:
        relatorio = relatorio + "5 x " + i + " = " + (5 * i) + "\n"
    fim
    retorna relatorio
fim

variavel texto = gerarRelatorio()
escreva texto
fs.escrever("relatorio.txt", texto)
escreva "Relatório salvo!"

variavel agora = hoje()
escreva "Gerado em: " + agora.formatado() + " às " + agora.horaFormatada()
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch para a sua feature (`git checkout -b minha-feature`)
3. Faça commit das suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin minha-feature`)
5. Abra um Pull Request

### Reportar Problemas

Encontrou um bug? Abra uma [issue](https://github.com/Eliobros/MambaScript/issues) no GitHub.

---

## 📜 Licença

MambaScript é distribuído sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Feito com ❤️ em Moçambique por <a href="https://github.com/Eliobros">Habibo Salimo Julio</a>
</p>
<p align="center">
  <strong>MambaScript v2.1.0</strong> — 🐍 A linguagem de programação moçambicana
</p>
