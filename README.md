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
9. [Strings](#-strings)
10. [Números](#-números)
11. [Arrays](#-arrays)
12. [Objectos](#-objectos)
13. [Sistema de Importação](#-sistema-de-importação)
14. [Módulos Built-in](#-módulos-built-in)
15. [Funções Built-in](#-funções-built-in)
16. [Exemplos Completos](#-exemplos-completos)
17. [Contribuição](#-contribuição)
18. [Licença](#-licença)

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

```mambascript
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

### Exemplos

```mambascript
# Números
variavel inteiro = 42
variavel decimal = 3.14

# Strings
variavel saudacao = "Olá!"
variavel cidade = 'Maputo'

# Booleanos
variavel ativo = verdadeiro
variavel desligado = falso

# Nulo
variavel vazio = nulo

# Array
variavel frutas = ["manga", "papaia", "coco"]

# Objecto
variavel pessoa = {nome: "Habibo", idade: 25}
```

---

## 📝 Variáveis

As variáveis são declaradas com a palavra-chave `variavel`:

```mambascript
variavel nome = "MambaScript"
variavel versao = 2
variavel ativo = verdadeiro

escreva nome
escreva versao
escreva ativo
```

As variáveis podem ser reatribuídas:

```mambascript
variavel contador = 0
contador = contador + 1
escreva contador
```

---

## ➕ Operadores

### Operadores Aritméticos

MambaScript permite usar **símbolos** ou **palavras-chave** em português para operações aritméticas:

| Operação | Símbolo | Palavra-chave | Exemplo |
|----------|---------|---------------|---------|
| Adição | `+` | `mais` | `5 + 3` ou `5 mais 3` |
| Subtração | `-` | `menos` | `10 - 4` ou `10 menos 4` |
| Multiplicação | `*` | `vezes` | `6 * 7` ou `6 vezes 7` |
| Divisão | `/` | `dividido` | `20 / 5` ou `20 dividido 5` |

```mambascript
# Usando símbolos
escreva 10 + 5
escreva 20 - 8
escreva 4 * 3
escreva 15 / 3

# Usando palavras-chave em português
escreva 10 mais 5
escreva 20 menos 8
escreva 4 vezes 3
escreva 15 dividido 3
```

### Operadores de Comparação

| Operação | Símbolo | Palavra-chave | Exemplo |
|----------|---------|---------------|---------|
| Igual | `==` | `igual` | `a == b` ou `a igual b` |
| Maior que | `>` | `maior` | `a > b` ou `a maior b` |
| Menor que | `<` | `menor` | `a < b` ou `a menor b` |
| Maior ou igual | `>=` | `maiorIgual` | `a >= b` ou `a maiorIgual b` |
| Menor ou igual | `<=` | `menorIgual` | `a <= b` ou `a menorIgual b` |

```mambascript
variavel a = 10
variavel b = 5

escreva a maior b
escreva a igual b
escreva a menorIgual 10
```

### Operadores Lógicos

| Operador | Descrição | Exemplo |
|----------|-----------|---------|
| `e` | E lógico (AND) | `verdadeiro e falso` |
| `ou` | OU lógico (OR) | `verdadeiro ou falso` |
| `nao` | Negação (NOT) | `nao verdadeiro` |

```mambascript
variavel temIdade = verdadeiro
variavel temDocumento = verdadeiro

se temIdade e temDocumento:
    escreva "Aprovado!"
fim

variavel chovendo = falso
se nao chovendo:
    escreva "Pode sair!"
fim
```

---

## 📡 Entrada e Saída

### Saída (escreva)

Use `escreva` para imprimir valores na tela:

```mambascript
escreva "Olá, Mundo!"
escreva 42
escreva verdadeiro

variavel nome = "MambaScript"
escreva nome
escreva "A linguagem é: " + nome
```

### Entrada (ler)

Use `ler()` para ler dados do utilizador:

```mambascript
escreva "Qual é o teu nome?"
variavel nome = ler()
escreva "Olá, " + nome + "!"

escreva "Qual é a tua idade?"
variavel idade = ler()
escreva "Tens " + idade + " anos."
```

---

## 🔀 Estruturas de Controle

### Condicional (se / senao)

```mambascript
variavel idade = 18

se idade >= 18:
    escreva "É maior de idade."
senao:
    escreva "É menor de idade."
fim
```

Condicionais encadeadas:

```mambascript
variavel nota = 85

se nota >= 90:
    escreva "Excelente!"
senao:
    se nota >= 70:
        escreva "Bom trabalho!"
    senao:
        escreva "Precisa melhorar."
    fim
fim
```

### Ciclo Enquanto (while)

```mambascript
variavel contador = 1

enquanto contador <= 5:
    escreva "Contagem: " + contador
    contador = contador + 1
fim
```

### Ciclo Para (for)

```mambascript
para i de 1 ate 10:
    escreva i
fim
```

Exemplo com cálculo:

```mambascript
# Tabuada do 7
para i de 1 ate 10:
    escreva "7 x " + i + " = " + (7 * i)
fim
```

---

## 🔧 Funções

Funções são declaradas com a palavra-chave `funcao` e encerradas com `fim`:

```mambascript
funcao saudacao(nome):
    escreva "Olá, " + nome + "!"
fim

saudacao("Habibo")
saudacao("Maria")
```

### Funções com retorno

```mambascript
funcao soma(a, b):
    retorna a + b
fim

variavel resultado = soma(10, 20)
escreva resultado
```

### Funções com múltiplos parâmetros

```mambascript
funcao calcularMedia(nota1, nota2, nota3):
    variavel total = nota1 + nota2 + nota3
    retorna total / 3
fim

variavel media = calcularMedia(15, 18, 12)
escreva "Média: " + media
```

### Funções recursivas

```mambascript
funcao fatorial(n):
    se n <= 1:
        retorna 1
    fim
    retorna n * fatorial(n - 1)
fim

escreva fatorial(5)
```

---

## 🔤 Strings

### Criação de Strings

```mambascript
variavel texto1 = "Olá, Mundo!"
variavel texto2 = 'MambaScript'
```

### Concatenação

```mambascript
variavel nome = "Habibo"
variavel saudacao = "Olá, " + nome + "!"
escreva saudacao
```

### Métodos de String

| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `.tamanho()` | Retorna o comprimento da string | `"olá".tamanho()` → `3` |
| `.maiuscula()` | Converte para maiúsculas | `"olá".maiuscula()` → `"OLÁ"` |
| `.minuscula()` | Converte para minúsculas | `"OLÁ".minuscula()` → `"olá"` |
| `.paraNumero()` | Converte string para número | `"42".paraNumero()` → `42` |

```mambascript
variavel texto = "mambascript"

escreva texto.tamanho()
escreva texto.maiuscula()
escreva texto.minuscula()

variavel numeroTexto = "123"
variavel numero = numeroTexto.paraNumero()
escreva numero + 7
```

---

## 🔢 Números

### Métodos de Número

| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `.paraTexto()` | Converte número para string | `42.paraTexto()` → `"42"` |

```mambascript
variavel idade = 25
variavel idadeTexto = idade.paraTexto()
escreva "Idade: " + idadeTexto
```

---

## 📚 Arrays

### Criação e Acesso

```mambascript
variavel frutas = ["manga", "papaia", "banana", "coco"]

# Acesso por índice (começa em 0)
escreva frutas[0]
escreva frutas[2]
```

### Métodos de Array

| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `.tamanho()` | Retorna o número de elementos | `frutas.tamanho()` |
| `.adicionar(item)` | Adiciona um item ao final | `frutas.adicionar("limão")` |
| `.remover(indice)` | Remove o item no índice | `frutas.remover(0)` |
| `.pegar(indice)` | Obtém o item no índice | `frutas.pegar(1)` |
| `.contem(item)` | Verifica se contém o item | `frutas.contem("manga")` |
| `.juntar(separador)` | Junta elementos numa string | `frutas.juntar(", ")` |

```mambascript
variavel numeros = [10, 20, 30]

# Tamanho
escreva numeros.tamanho()

# Adicionar
numeros.adicionar(40)
escreva numeros

# Verificar
escreva numeros.contem(20)

# Pegar
escreva numeros.pegar(2)

# Juntar
escreva numeros.juntar(" - ")

# Remover
numeros.remover(0)
escreva numeros
```

### Iterar sobre um Array

```mambascript
variavel cidades = ["Maputo", "Beira", "Nampula", "Quelimane"]

para i de 0 ate cidades.tamanho() - 1:
    escreva cidades[i]
fim
```

---

## 🏗️ Objectos

### Criação de Objectos

```mambascript
variavel pessoa = {
    nome: "Habibo",
    idade: 25,
    cidade: "Maputo"
}
```

### Acesso a Propriedades

```mambascript
escreva pessoa.nome
escreva pessoa.idade
escreva pessoa.cidade
```

### Modificação de Propriedades

```mambascript
pessoa.nome = "João"
pessoa.idade = 30
escreva pessoa.nome
escreva pessoa.idade
```

### Objectos com Arrays

```mambascript
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

### Importar Módulos Locais

Crie um arquivo `utils.ms` na pasta `modulos_mambas/`:

```mambascript
# modulos_mambas/utils.ms
funcao dobro(n):
    retorna n * 2
fim
```

Importe no seu programa principal:

```mambascript
importar utils de "utils"
```

### Importar Módulos de Arquivo

```mambascript
importar modulo de "arquivo"
```

### Importar Módulos Built-in

```mambascript
importar matematica de "matematica"
importar fs de "fs"
importar caminho de "caminho"
```

---

## 🧰 Módulos Built-in

### 📐 Módulo `matematica`

Funções e constantes matemáticas:

| Função / Constante | Descrição |
|---------------------|-----------|
| `PI` | Valor de π (3.14159...) |
| `raiz(n)` | Raiz quadrada |
| `potencia(base, exp)` | Potenciação |
| `absoluto(n)` | Valor absoluto |
| `arredondar(n)` | Arredondamento |
| `teto(n)` | Arredondamento para cima |
| `chao(n)` | Arredondamento para baixo |
| `aleatorio()` | Número aleatório entre 0 e 1 |
| `seno(n)` | Seno |
| `cosseno(n)` | Cosseno |

```mambascript
importar matematica de "matematica"

escreva matematica.PI
escreva matematica.raiz(144)
escreva matematica.potencia(2, 10)
escreva matematica.absoluto(-42)
escreva matematica.arredondar(3.7)
escreva matematica.teto(3.2)
escreva matematica.chao(3.9)
escreva matematica.aleatorio()
```

### 📁 Módulo `fs`

Operações com o sistema de arquivos:

| Função | Descrição |
|--------|-----------|
| `ler(arquivo)` | Lê o conteúdo de um arquivo |
| `escrever(arquivo, conteudo)` | Escreve conteúdo num arquivo |
| `existe(arquivo)` | Verifica se o arquivo existe |
| `apagar(arquivo)` | Apaga um arquivo |

```mambascript
importar fs de "fs"

# Escrever num arquivo
fs.escrever("dados.txt", "Olá, MambaScript!")

# Verificar se existe
escreva fs.existe("dados.txt")

# Ler o conteúdo
variavel conteudo = fs.ler("dados.txt")
escreva conteudo

# Apagar o arquivo
fs.apagar("dados.txt")
```

### 📂 Módulo `caminho`

Utilitários para manipulação de caminhos:

| Função | Descrição |
|--------|-----------|
| `juntar(...partes)` | Junta partes do caminho |
| `diretorio(caminho)` | Retorna o diretório |
| `arquivo(caminho)` | Retorna o nome do arquivo |
| `extensao(caminho)` | Retorna a extensão |
| `absoluto(caminho)` | Retorna o caminho absoluto |

```mambascript
importar caminho de "caminho"

escreva caminho.juntar("pasta", "arquivo.ms")
escreva caminho.diretorio("/home/user/programa.ms")
escreva caminho.arquivo("/home/user/programa.ms")
escreva caminho.extensao("programa.ms")
escreva caminho.absoluto("programa.ms")
```

---

## ⚡ Funções Built-in

### 📅 Função `hoje()`

Retorna um objecto com a data e hora actuais:

```mambascript
variavel data = hoje()

escreva data.mostrarData()
escreva data.mostrarHora()
escreva data.ano()
```

Com fuso horário:

```mambascript
variavel data = hoje("Africa/Maputo")
escreva data.mostrarData()
escreva data.mostrarHora()
```

### 📖 Função `ler()`

Lê entrada do utilizador:

```mambascript
escreva "Digite o seu nome:"
variavel nome = ler()
escreva "Olá, " + nome
```

### 📄 Funções JSON

| Função | Descrição |
|--------|-----------|
| `json_ler(arquivo)` | Lê e analisa um arquivo JSON |
| `json_texto(string)` | Analisa uma string JSON |
| `json_escrever(arquivo, dados)` | Escreve dados num arquivo JSON |

```mambascript
# Ler um arquivo JSON
variavel config = json_ler("config.json")
escreva config.nome

# Analisar uma string JSON
variavel dados = json_texto('{"nome": "Mamba", "versao": 2}')
escreva dados.nome

# Escrever um arquivo JSON
variavel info = {nome: "MambaScript", versao: 2}
json_escrever("saida.json", info)
```

---

## 💡 Exemplos Completos

### Exemplo 1: Calculadora Simples

```mambascript
# Calculadora Simples em MambaScript

funcao calculadora(a, operacao, b):
    se operacao igual "+":
        retorna a + b
    fim
    se operacao igual "-":
        retorna a - b
    fim
    se operacao igual "*":
        retorna a * b
    fim
    se operacao igual "/":
        se b igual 0:
            escreva "Erro: Divisão por zero!"
            retorna nulo
        fim
        retorna a / b
    fim
    escreva "Operação desconhecida!"
    retorna nulo
fim

escreva "=== Calculadora MambaScript ==="
escreva "5 + 3 = " + calculadora(5, "+", 3)
escreva "10 - 4 = " + calculadora(10, "-", 4)
escreva "6 * 7 = " + calculadora(6, "*", 7)
escreva "20 / 4 = " + calculadora(20, "/", 4)
```

### Exemplo 2: Gestão de Alunos

```mambascript
# Sistema de Gestão de Alunos

variavel alunos = []

funcao adicionarAluno(nome, nota):
    variavel aluno = {nome: nome, nota: nota}
    alunos.adicionar(aluno)
    escreva "Aluno " + nome + " adicionado com sucesso!"
fim

funcao calcularMedia():
    variavel soma = 0
    para i de 0 ate alunos.tamanho() - 1:
        soma = soma + alunos[i].nota
    fim
    retorna soma / alunos.tamanho()
fim

funcao mostrarResultados():
    escreva "=== Resultados ==="
    para i de 0 ate alunos.tamanho() - 1:
        variavel status = "Reprovado"
        se alunos[i].nota >= 10:
            status = "Aprovado"
        fim
        escreva alunos[i].nome + ": " + alunos[i].nota + " - " + status
    fim
fim

# Adicionar alunos
adicionarAluno("Ana", 18)
adicionarAluno("Carlos", 8)
adicionarAluno("Maria", 15)
adicionarAluno("João", 12)

# Mostrar resultados
mostrarResultados()

# Calcular média
variavel media = calcularMedia()
escreva "Média da turma: " + media
```

### Exemplo 3: Trabalhando com Arquivos e Módulos

```mambascript
# Exemplo de uso de módulos built-in

importar matematica de "matematica"
importar fs de "fs"

# Gerar relatório matemático
funcao gerarRelatorio():
    variavel relatorio = "=== Relatório Matemático ===\n"
    relatorio = relatorio + "PI: " + matematica.PI + "\n"
    relatorio = relatorio + "Raiz de 256: " + matematica.raiz(256) + "\n"
    relatorio = relatorio + "2^8: " + matematica.potencia(2, 8) + "\n"

    # Tabuada do 5
    relatorio = relatorio + "\nTabuada do 5:\n"
    para i de 1 ate 10:
        relatorio = relatorio + "5 x " + i + " = " + (5 * i) + "\n"
    fim

    retorna relatorio
fim

variavel texto = gerarRelatorio()
escreva texto

# Salvar em arquivo
fs.escrever("relatorio.txt", texto)
escreva "Relatório salvo em relatorio.txt!"

# Verificar que foi salvo
se fs.existe("relatorio.txt"):
    escreva "Arquivo criado com sucesso!"
fim

# Data e hora
variavel agora = hoje()
escreva "Gerado em: " + agora.mostrarData() + " às " + agora.mostrarHora()
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
  <strong>MambaScript v2.0.2</strong> — 🐍 A linguagem de programação moçambicana
</p>
