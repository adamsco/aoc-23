const { CreateLineReader } = require("../_util/LineReader");

let sum = 0;

const findValue = (arr, multiplier) => {
  arr.every((char) => {
    const val = parseInt(char);
    if (val || val === 0) {
      sum += val * multiplier;
      return false;
    }
    return true;
  });
};

const doStuff = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    const arr = line.split("");

    findValue(arr, 10);
    findValue(arr.reverse(), 1);
  }
  console.log("sum", sum);
};

doStuff();
