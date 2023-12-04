const { CreateLineReader } = require("../_util/LineReader");

let sum = 0;

const cleanNumbers = (str) =>
  str
    .split(" ")
    .map((n) => n.trim())
    .filter((n) => n)
    .map((n) => parseInt(n));

const run = async (filename = "./sample.txt") => {
  const lr = CreateLineReader(filename);
  let index = 0;
  for await (const line of lr) {
    index++;
    const [pre, allNumbers] = line.split(":");
    const [winnersRaw, myNumbersRaw] = allNumbers.split("|");
    const winners = cleanNumbers(winnersRaw);
    const myNumbers = cleanNumbers(myNumbersRaw);

    let matches = 0;
    for (const myNumber of myNumbers) {
      if (winners.includes(myNumber)) {
        matches++;
      }
    }
    if (matches > 0) {
      const score = Math.pow(2, matches - 1);

      sum += score;
    }

    // do stuff
  }
  return sum;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
