const { CreateLineReader } = require("../_util/LineReader");

const matrix = [];
const validNumbers = [];

let sum = 0;

const isNumber = (char) => {
  return char !== undefined && char.match(/[0-9]/);
};

const isSymbol = (char) => {
  // make sure it is not a number and not .
  return !isNumber(char) && char !== ".";
};

const hasSurroundingSymbol = (xc, yc) => {
  // c
  for (y = yc - 1; y <= yc + 1; y++) {
    for (x = xc - 1; x <= xc + 1; x++) {
      if (x === xc && y === yc) {
        continue;
      }

      if (y < 0 || x < 0 || y >= matrix.length || x >= matrix[y].length) {
        continue;
      }
      if (isSymbol(matrix[y][x])) {
        return true;
      }
    }
  }
};

let visitedX = -1;
let visitedY = -1;

const collectNumber = (x, y) => {
  let extras = 0;
  while (extras + x < matrix[y].length) {
    if (isNumber(matrix[y][x + extras + 1])) {
      extras++;
    } else {
      break;
    }
  }
  let entireNumber = "";
  for (let i = 0; i <= extras; i++) {
    entireNumber += matrix[y][x + i];
  }

  if (extras > 0) {
    visitedX = x + extras;
    visitedY = y;
  }
  // is it adjacent to symbol?
  let isAdjacent = false;
  for (let i = 0; i <= extras; i++) {
    if (isAdjacent) {
      break;
    }
    isAdjacent = hasSurroundingSymbol(x + i, y);
  }
  if (!isAdjacent) {
    // console.log("not adjacent", entireNumber);
    return;
  }

  sum += parseInt(entireNumber);
};

const enterTheMatrix = () => {
  matrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (visitedX >= x && visitedY >= y) {
        // continue
      } else if (isNumber(cell)) {
        collectNumber(x, y);
      }
    });
  });
};
const run = async (filename = "./input.txt") => {
  const lr = CreateLineReader(filename);
  for await (const line of lr) {
    matrix.push(line.split(""));
  }

  enterTheMatrix();

  console.log("answer: ", sum);
  return sum;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
