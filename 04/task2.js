const { CreateLineReader } = require("../_util/LineReader");

let sum = 0;

const cleanNumbers = (str) =>
  str
    .split(" ")
    .map((n) => n.trim())
    .filter((n) => n)
    .map((n) => parseInt(n));

let multiplierMap = {
  1: 1,
};

const addMultipliers = (currentIndex, count, amount) => {
  for (let i = 1; i <= count; i++) {
    const key = currentIndex + i;
    const value = amount;
    const prevValue = multiplierMap[key] || 1;
    multiplierMap[key] = prevValue + value;
  }
};

const getMultiplier = (currentIndex) => multiplierMap[currentIndex] || 1;

const run = async (filename = "./sample.txt") => {
  const lr = CreateLineReader(filename);
  let index = 0;
  for await (const line of lr) {
    index++;
    if (multiplierMap[index] === undefined) {
      multiplierMap[index] = 1;
    }
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
      addMultipliers(index, matches, getMultiplier(index));
    }
    // do stuff
  }
  const calculatedScore = Object.values(multiplierMap).reduce(
    (a, b) => a + b,
    0
  );

  return calculatedScore;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
