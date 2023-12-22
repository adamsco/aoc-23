const fs = require("fs");
const { PrintAMap } = require("../_util/printAMap");

const VISIT = "O";
const ROCK = "#";
const EMPTY = ".";
const garden = [];
let startPosition = { y: 0, x: 0 };

const setStartPosition = () => {
  for (let i = 0; i < garden.length; i++) {
    for (let j = 0; j < garden[i].length; j++) {
      if (garden[i][j] === "S") {
        startPosition = { y: i, x: j };
        garden[i][j] = VISIT;
        return;
      }
    }
  }
  console.log("could not find start");
};

const getCurrentPositions = () => {
  const positions = [];
  for (let i = 0; i < garden.length; i++) {
    for (let j = 0; j < garden[i].length; j++) {
      if (garden[i][j] === VISIT) {
        positions.push({ y: i, x: j });
      }
    }
  }
  return positions;
};

const getNextPositions = ({ x, y }) => {
  const nextPositions = [];
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (garden[y + i] === undefined || garden[x + j] === undefined) {
        continue;
      }
      if (Math.abs(i) === Math.abs(j)) {
        continue;
      }
      if (garden[y + i][x + j] !== ROCK) {
        nextPositions.push({ x: x + j, y: y + i });
      }
    }
  }
  return nextPositions;
};

const clearVisited = () => {
  for (let i = 0; i < garden.length; i++) {
    for (let j = 0; j < garden[i].length; j++) {
      if (garden[i][j] === VISIT) {
        garden[i][j] = EMPTY;
      }
    }
  }
};

const markVisited = (list) => {
  list.forEach((pos) => {
    garden[pos.y][pos.x] = VISIT;
  });
};

const simulateSteps = (steps) => {
  for (let i = 0; i < steps; i++) {
    const nextPositions = [];
    const currentPositions = getCurrentPositions();
    currentPositions.forEach((pos) => {
      nextPos = getNextPositions(pos);
      if (nextPos.length > 0) {
        nextPositions.push(nextPos);
      }
    });
    clearVisited();
    markVisited(nextPositions.flat());
  }

  return getCurrentPositions().length;
};

const run = (filename = "./sample.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  for (const line of lines) {
    const row = line.split("");
    garden.push(row);
    // do stuff
  }
  setStartPosition();
  const result = simulateSteps(64);
  PrintAMap(garden);
  console.log("result", result);
  return result;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
