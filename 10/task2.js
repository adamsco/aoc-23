const { CreateLineReader } = require("../_util/LineReader");

const matrix = [];

let startIndex = undefined;

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.

const getNextPosition = ({ y, x, px, py }) => {
  const next = matrix[y][x];
  // | is a vertical pipe connecting north and south.
  if (next === "|" && px === x) {
    if (py === y - 1) {
      // down
      return { y: y + 1, x };
    }
    return { y: y - 1, x };
  }
  // - is a horizontal pipe connecting east and west.
  if (next === "-" && py === y) {
    if (px === x - 1) {
      // rightWards
      return { y, x: x + 1 };
    }
    return { y, x: x - 1 };
  }
  // L is a 90-degree bend connecting north and east.
  if (next === "L") {
    if (py === y - 1 && px === x) {
      return { y, x: x + 1 };
    } else if (py === y && px === x + 1) {
      return { y: y - 1, x };
    }
  }
  // J is a 90-degree bend connecting north and west.
  if (next === "J") {
    if (py === y - 1 && px === x) {
      return { y, x: x - 1 };
    } else if (py === y && px === x - 1) {
      return { y: y - 1, x };
    }
  }
  // 7 is a 90-degree bend connecting south and west.
  if (next === "7") {
    if (py === y && px === x - 1) {
      return { y: y + 1, x };
    } else if (py === y + 1 && px === x) {
      return { y, x: x - 1 };
    }
  }
  // F is a 90-degree bend connecting south and east.
  if (next === "F") {
    if (py === y && px === x + 1) {
      return { y: y + 1, x };
    } else if (py === y + 1 && px === x) {
      return { y, x: x + 1 };
    }
  }
  return -1;
};

let x,
  y,
  px,
  py,
  length = undefined;

// let completed = false;
const travelToStart = () => {
  if (matrix[y] === undefined || matrix[y][x] === undefined) {
    return -1;
  }
  if (matrix[y][x] === "S") return 1;

  const next = getNextPosition({ x, y, px, py });
  if (next === -1) return -1;

  px = x;
  py = y;
  x = next.x;
  y = next.y;
  length++;

  return 0;
};

let corrArr = [];

const start = () => {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if ((i === 0 && j === 0) || Math.abs(i) + Math.abs(j) > 1) {
        continue;
      } else {
        // const dist = travelToStart({
        px = startIndex.x;
        py = startIndex.y;
        x = startIndex.x + i;
        y = startIndex.y + j;
        length = 1;
        corrArr = [];

        while (true) {
          corrArr.push({ x, y });

          res = travelToStart();
          if (res === -1) break;
          if (res === 1) {
            return length / 2;
          }
        }
      }
    }
  }
  return 0;
};

const findStart = () => {
  for (let i = 0; i < matrix.length; i++) {
    if (startIndex) break;
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === "S") {
        startIndex = { x: j, y: i };
      }
    }
  }
};

let superMap = undefined;
const printMap = () => {
  const map = matrix.map((row) => row.map((v) => "."));
  corrArr.forEach(({ x, y }) => {
    map[y][x] = matrix[y][x];
  });
  superMap = map;
  validateMap();
};

const validateMap = () => {
  let count = 0;
  superMap.forEach((row) => {
    row.forEach((v) => {
      if (v !== ".") {
        count++;
      }
    });
  });
  if (corrArr.length !== count) {
    console.log("ERROR 2");
  }
};
const printAMap = (map) => {
  const printMap = map.map((row) => row.join("")).join("\n");
  console.log(printMap);
};

const innerPath = [];
const markInner = () => {
  corrArr.forEach(({ x, y }, i) => {
    if (i < corrArr.length - 1) {
      const diff = { x: corrArr[i + 1].x - x, y: corrArr[i + 1].y - y };
      if (Math.abs(diff.x) + Math.abs(diff.y) !== 1) {
        console.log("ERROR");
      }
      let xi = corrArr[i + 1].x;
      let yi = corrArr[i + 1].y;
      const revert = 1;
      // both of these ought to do it
      innerPath.push({ x: x + diff.y * revert, y: y - diff.x * revert });
      innerPath.push({ x: xi + diff.y * revert, y: yi - diff.x * revert });
    }
  });
};

const markAdjacent = () => {
  let doneSomething = false;

  let fff = 0;
  while (true) {
    doneSomething = false;
    superInner.forEach(({ x, y }) => {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if ((i === 0 && j === 0) || Math.abs(i) + Math.abs(j) > 1) {
            continue;
          } else {
            if (
              superMap[y + j] !== undefined &&
              superMap[y + j][x + i] === "."
            ) {
              superMap[y + j][x + i] = "X";
              superInner.push({ x: x + i, y: y + j });
              doneSomething = true;
            } else {
              //
            }
          }
        }
      }
    });
    fff++;

    if (!doneSomething) {
      break;
    }
  }
};

let superInner = [];

const addInner = () => {
  markInner();
  innerPath.forEach(({ x, y }) => {
    if (superMap[y] !== undefined && superMap[y][x] === ".") {
      superInner.push({ x, y });
      superMap[y][x] = "X";
    } else {
    }
  });
  markAdjacent();

  // remove duplicates
  superInner = superInner.filter(
    (v, i) => superInner.findIndex((d) => d.x === v.x && d.y === v.y) === i
  );
};

const run = async (filename = "./input.txt") => {
  const lr = CreateLineReader(filename);
  for await (const line of lr) {
    matrix.push(line.trim().split(""));
  }

  findStart();
  start();

  printMap();
  addInner();
  // printAMap(superMap);

  console.log("answer = " + superInner.length);
  return superInner.length;
};

module.exports = {
  RunTask: (filename) => run(filename),
};

run();

// 332 - low
