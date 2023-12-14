const fs = require("fs");
const { PrintAMap } = require("../_util/printAMap");

const area = [];

const ROLLY = "O";
const EMPTY = ".";

const getRollyPositions = () => {
  const positions = [];
  area.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === ROLLY) {
        positions.push({ x, y });
      }
    });
  });
  return positions;
};

const applyGravityToArea = () => {
  const positions = getRollyPositions();
  positions.forEach((position) => {
    while (true) {
      const { x, y } = position;
      if (area[y - 1] === undefined) {
        break;
      }
      const cellAbove = area[y - 1][x];
      if (cellAbove === EMPTY) {
        area[y][x] = EMPTY;
        area[y - 1][x] = ROLLY;
        position.y -= 1;
      } else {
        break;
      }
    }
  });
};

const getLoad = () => {
  let load = 0;
  area.reverse().forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === ROLLY) {
        load += y + 1;
      }
    });
  });
  return load;
};

const run = async (filename = "./sample.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");

  for await (const line of lines) {
    area.push(line.split(""));
  }
  applyGravityToArea();
  console.log("area", PrintAMap(area));
  const answer = getLoad();
  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
