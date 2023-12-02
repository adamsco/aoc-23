const { CreateLineReader } = require("../_util/LineReader");

let sum = 0;

const valueMap = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const textArr = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const getPossibleMatches = (input, reverse, index, arr) => {
  let chars = input;
  return textArr.filter((text) => {
    if (index + text.length > arr.length) {
      return false;
    }
    if (reverse) {
      return text.endsWith(chars);
    }
    return text.startsWith(chars);
  });
};

const findValue = (arr, multiplier, reverse) => {
  arr.every((char, index) => {
    const val = parseInt(char);
    // same as last time
    if (val || val === 0) {
      sum += val * multiplier;

      return false;
    }
    // is a letter
    let length = 1;
    while (true) {
      const testString = reverse
        ? arr
            .slice(index, index + length)
            .reverse()
            .join("")
        : arr.slice(index, index + length).join("");

      const possibleMatches = getPossibleMatches(
        testString,
        reverse,
        index,
        arr
      );

      if (possibleMatches.length === 1) {
        if (possibleMatches[0] === testString) {
          sum += valueMap[possibleMatches[0]] * multiplier;
          return false;
        }
      } else if (possibleMatches.length === 0) {
        break;
      }
      length++;
    }

    return true;
  });
};

const doStuff = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    const arr = line.split("");
    findValue(arr, 10, false);
    findValue(arr.reverse(), 1, true);
  }
  console.log("answer: ", sum);
};

doStuff();
