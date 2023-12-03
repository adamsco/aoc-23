const { CreateLineReader } = require("../_util/LineReader");

const matrix = [];

let sum = 0;

const isNumber = (char) => {
  return char !== undefined && char.match(/[0-9]/);
};

const isGear = (char) => {
  return char === "*";
};

let visitedX = -1;
let visitedY = -1;

const collectGear = (xc, yc) => {
  const numbers = [];
  visitedX = -1;
  visitedY = -1;

  for (y = yc - 1; y <= yc + 1; y++) {
    for (x = xc - 1; x <= xc + 1; x++) {
      if (x === xc && y === yc) {
        continue;
      }

      if (y < 0 || x < 0 || y >= matrix.length || x >= matrix[y].length) {
        continue;
      }
      if (visitedX >= x && visitedY >= y) {
        continue;
      } else if (isNumber(matrix[y][x])) {
        const offset = findNumberOffset(x, y);
        numbers.push(collectNumber(x + offset, y));
      }
    }
  }
  if (numbers.length !== 2) {
    // console.log("invalid gear", { x, y, numbers });
    return;
  }
  sum += numbers[0] * numbers[1];
};

const findNumberOffset = (x, y) => {
  let offset = 0;
  while (offset + x >= 0) {
    if (isNumber(matrix[y][x + offset - 1])) {
      offset--;
    } else {
      break;
    }
  }
  return offset;
};

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

  return parseInt(entireNumber);
};

const enterTheMatrix = () => {
  matrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (isGear(cell)) {
        collectGear(x, y);
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
