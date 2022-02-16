var fs = require('fs')

let palavras = [];

fs.readFile(__dirname+'/dicionario5.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ');
    palavras = data.split('\n');
});

function nextWord(guess, lastWord){
    //Palavra encontrada
    if (guess.reduce((x,y)=>x+y) === 10) { return null;}
    //Palavra fora do dicionario
    if(guess[0]===null) { return palavras.shift(); }
    let checked = [];
    for (let i = 0; i < guess.length; i++) {
        const result = guess[i];
        switch (result) {
            case 0:
                if(!checked.includes(lastWord[i])) palavras = palavras.filter(x=> !x.includes(lastWord[i]));
                break;
            case 1:
                palavras = palavras.filter(x => x.includes(lastWord[i]));
                palavras = palavras.filter(x => x[i] !== lastWord[i]);
                checked.push(lastWord[i]);
                break;
            default:
                palavras = palavras.filter(x => x[i] === lastWord[i]);
                checked.push(lastWord[i]);
                break;
        }
    }
    return palavras.shift();
}

module.exports = {nextWord};