const { CreateLineReader } = require("../_util/LineReader");

const inputLines = [];

const getDerivataArray = (arr) => {
  const nextArr = [];
  for (let i = 0; i < arr.length - 1; i++) {
    nextArr.push(arr[i + 1] - arr[i]);
  }
  return nextArr;
};

const getNextValue = (arr) => {
  const pyramid = [arr];

  // fill base
  while (true) {
    const next = getDerivataArray(pyramid[pyramid.length - 1]);
    if (next.every((e) => e === 0)) {
      next.push(0);
      pyramid.push(next);
      break;
    }
    pyramid.push(next);
  }
  pyramid.reverse();

  pyramid.forEach((pLine, i) => {
    if (i !== pyramid.length - 1) {
      pyramid[i + 1].push(
        pyramid[i + 1][pyramid[i + 1].length - 1] + pLine[pLine.length - 1]
      );
    }
  });

  const lastVal =
    pyramid[pyramid.length - 1][pyramid[pyramid.length - 1].length - 1];
  return lastVal;
};

const getNextValueSum = () => {
  let sum = 0;
  // console.log("inputLines", inputLines);
  inputLines.forEach((inputLine) => {
    sum += getNextValue(inputLine);
  });
  return sum;
};

const run = async (filename = "./sample.txt") => {
  const lr = CreateLineReader(filename);
  for await (const line of lr) {
    inputLines.push(
      line
        .trim()
        .split(" ")
        .map((v) => parseInt(v))
    );
    // do stuff
  }
  const answer = getNextValueSum();
  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
