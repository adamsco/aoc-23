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
  // console.log("fail", { y, x, px, py, next });
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
    // console.log("fail2", {
    //   x,
    //   y,
    //   px,
    //   py,
    //   length,
    // });
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
  // return travelToStart({ ...next, px: x, py: y, length: length + 1 });
};

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
        while (true) {
          res = travelToStart();
          if (res === -1) break;
          if (res === 1) {
            console.log("answer", length / 2);
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

const run = async (filename = "./sample.txt") => {
  const lr = CreateLineReader(filename);
  for await (const line of lr) {
    matrix.push(line.trim().split(""));
    // do stuff
  }
  // console.log("matrix", matrix);
  findStart();
  const answer = start();

  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
