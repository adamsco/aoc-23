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

const applyGravityToAreaNorth = () => {
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

const applyGravityToAreaSouth = () => {
  const positions = getRollyPositions();
  positions.reverse().forEach((position) => {
    while (true) {
      const { x, y } = position;
      if (area[y + 1] === undefined) {
        break;
      }
      const cellBelow = area[y + 1][x];
      if (cellBelow === EMPTY) {
        area[y][x] = EMPTY;
        area[y + 1][x] = ROLLY;
        position.y += 1;
      } else {
        break;
      }
    }
  });
};

const applyGravityToAreaWest = () => {
  const positions = getRollyPositions().sort((a, b) => a.x - b.x);
  positions.forEach((position) => {
    while (true) {
      const { x, y } = position;
      if (area[y][x - 1] === undefined) {
        break;
      }
      const cellLeft = area[y][x - 1];
      if (cellLeft === EMPTY) {
        area[y][x] = EMPTY;
        area[y][x - 1] = ROLLY;
        position.x -= 1;
      } else {
        break;
      }
    }
  });
};

const applyGravityToAreaEast = () => {
  const positions = getRollyPositions().sort((a, b) => b.x - a.x);
  positions.forEach((position) => {
    while (true) {
      const { x, y } = position;
      if (area[y][x + 1] === undefined) {
        break;
      }
      const cellRight = area[y][x + 1];
      if (cellRight === EMPTY) {
        area[y][x] = EMPTY;
        area[y][x + 1] = ROLLY;
        position.x += 1;
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
  area.reverse();
  return load;
};

const performCycle = () => {
  applyGravityToAreaNorth();
  applyGravityToAreaWest();
  applyGravityToAreaSouth();
  applyGravityToAreaEast();
};

const cycleLength = 500;
const findRepeatingPattern = () => {
  if (loads.length < cycleLength * 2) {
    for (let i = 1; i < cycleLength / 10; i++) {
      const sequence = loads.slice(-i);

      // check that it holds for at least 5 iterations back
      let ok = true;
      for (let j = 1; j <= cycleLength / sequence.length; j++) {
        const start = -sequence.length * (j + 1);
        const end = -sequence.length * (j + 1) + sequence.length;
        const nextSequence = loads.slice(start, end);

        if (
          sequence.length !== nextSequence.length ||
          !sequence.every((item, index) => item === nextSequence[index])
        ) {
          // console.log("fail", sequence, nextSequence);
          ok = false;
          continue;
        }
      }
      if (ok) {
        console.log("found repeating pattern", { sequence, i });
        return sequence;
      }
    }
  }
};

const loads = [];
const performCycles = () => {
  const cycles = 1000000000;
  for (let i = 0; i < cycles; i++) {
    performCycle();
    const load = getLoad();
    loads.push(load);

    const pattern = findRepeatingPattern();
    if (pattern) {
      const remainingCycles = cycles - i - 2;
      const answer = pattern[remainingCycles % pattern.length];
      console.log("answer", answer, i);
      return answer;
    }

    if (Date.now() - timer > 1000) {
      console.log(i + " / " + cycles, "lastLoads", loads.slice(-10));
      timer = Date.now();
    }
  }
};

let start;
let timer;
const run = (filename = "./sample.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  for (const line of lines) {
    area.push(line.split(""));
  }
  start = Date.now();
  timer = Date.now();
  performCycles();
  console.log("time: ", Date.now() - start);
  const answer = getLoad();
  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
