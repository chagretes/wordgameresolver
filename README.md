# 🦾🤖Term.ooo Bot

Oi pessoal, esse repo conta com dois projetos:

## Achar Palavra Ideal

Este projeto tem um código que tenta encontrar a palavra ideal para começar, por força bruta. Não existe nenhuma ordenação especifica das palavras (por exemplo por frequencia de uso ou algo do tipo)
* Linguagem: C#
* Framework: dotnet core
* Execução: `dotnet run`

## Bot do Term.ooo

Este projeto foi feito como um bot que acessa o site term.ooo, utilizando [puppeteer](https://github.com/puppeteer/puppeteer), resolve o desafio e compartilha o resultado no [twitter](https://twitter.com/TermoooB)
* Linguagem: javascript
* Framework: Node.js
* Execução: `npm install && node termoo-puppeteer.js`

Para a execução correta dele é necessário configurar corretamente as chaves do twitter no arquivo `tweet.js`
