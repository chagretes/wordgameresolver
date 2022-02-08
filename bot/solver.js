var fs = require('fs')

let palavras = [];

fs.readFile('dicionario5.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ');
    palavras = data.split('\n');
});

function nextWord(guess, lastWord){
    if (guess.reduce((x,y)=>x+y) === 10) { return null;}
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

    return palavras[0];
}

module.exports = {nextWord};