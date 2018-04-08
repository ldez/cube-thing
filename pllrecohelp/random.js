const fs = require('fs');

const allData = JSON.parse(fs.readFileSync('./pll-recognition.json', 'utf8'));

const extraMoves = ["", "U", "U2", "U'"];

const pll = shuffle(allData)[0];
const angle = shuffle(pll.cases)[0]
const extra = shuffle(extraMoves)[0];

let scramble = angle.rotation + pll.algo.replace(/\s|\)|\(|\[|\]/g, '') + extra
scramble = scramble.replace(/'/g, '%27')

console.log(`PLL ${pll.name}, case ${angle.rotation} | ${extra} |: ${pll.algo}`);
console.log(`http://cube.crider.co.uk/visualcube.php?fmt=svg&size=150&pzl=3&stage=ll&case=${encodeURIComponent(scramble)}`)

function shuffle(source) {
  // Deep clone
  let array = JSON.parse(JSON.stringify(source));

  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
