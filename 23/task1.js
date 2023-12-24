const fs = require("fs");
const { PrintAMap } = require("../_util/printAMap");
let startingPoint;

const area = [];

const run = async (filename = "./sample.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  for await (const line of lines) {
    area.push(line.split(""));
    if (!startingPoint) {
      const xpos = line.indexOf(".");
      startingPoint = { y: 0, x: xpos };
    }
    // do stuff
  }
  goTrailing();

  longestWalkArr.forEach(({ x, y }) => {
    area[y][x] = "O";
  });
  console.log("allWalks: ", allWalks);
  console.log("longest: ", longestWalk);
  // PrintAMap(area);
  return longestWalk;
};

module.exports = {
  RunTask: (filename) => run(filename),
};

let longestWalk = 0;
let longestWalkArr = [];
const allWalks = [];
// queue-element
// pos = { x, y }, steps, visited
const goTrailing = () => {
  const queue = [];
  queue.push({ pos: startingPoint, steps: 0, visited: [] });
  while (queue.length > 0) {
    const { pos, steps, visited } = queue.shift();
    if (pos.y === area.length - 1) {
      if (steps > longestWalk) {
        longestWalk = steps;
        longestWalkArr = visited;
      }
      allWalks.push(steps);
      continue;
    }

    const next = getAvailableSteps(pos, visited);
    next.forEach((np) => {
      queue.push({ pos: np, steps: steps + 1, visited: [...visited, np] });
    });
  }
};

const getAvailableSteps = (position, visited) => {
  const available = [];
  const { x, y } = position;
  const up = { x, y: y - 1 };
  const down = { x, y: y + 1 };
  const left = { x: x - 1, y };
  const right = { x: x + 1, y };

  let test = [up, down, left, right];
  if (area[y][x] === "<") {
    test = [left];
  } else if (area[y][x] === ">") {
    test = [right];
  } else if (area[y][x] === "^") {
    test = [up];
  } else if (area[y][x] === "v") {
    test = [down];
  }
  test.forEach((pos) => {
    if (visited.some((v) => v.x === pos.x && v.y === pos.y)) {
      // skip
    } else if (
      area[pos.y] &&
      area[pos.y][pos.x] !== undefined &&
      area[pos.y][pos.x] !== "#"
    ) {
      available.push(pos);
    }
  });

  return available;
};
