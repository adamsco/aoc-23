const fs = require("fs");
const { PrintAMap } = require("../_util/printAMap");

const instructions = [];
let area = [];
let offsetX = 0;
let offsetY = 0;

const createArea = () => {
  let maxX = 0;
  let minX = 0;
  let maxY = 0;
  let minY = 0;
  let x = 0;
  let y = 0;
  instructions.forEach((instruction) => {
    if (instruction.direction === "R") {
      x += instruction.steps;
    } else if (instruction.direction === "L") {
      x -= instruction.steps;
    } else if (instruction.direction === "D") {
      y += instruction.steps;
    } else if (instruction.direction === "U") {
      y -= instruction.steps;
    }
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
  });

  const totalX = maxX - minX;
  const totalY = maxY - minY;
  offsetX = Math.abs(minX) + 1;
  offsetY = Math.abs(minY) + 1;
  for (let y = 0; y < totalY + 2; y++) {
    area.push(new Array(totalX + 2).fill("."));
  }
  console.log("max", { totalX, maxY });
};

const populateTrench = () => {
  let x = offsetX;
  let y = offsetY;
  instructions.forEach((instruction) => {
    for (let i = 0; i < instruction.steps; i++) {
      area[y][x] = "#";

      if (instruction.direction === "R") {
        x += 1;
      } else if (instruction.direction === "L") {
        x -= 1;
      } else if (instruction.direction === "D") {
        y += 1;
      } else if (instruction.direction === "U") {
        y -= 1;
      }
      area[y][x] = "#";
    }
  });
};

const getNeighbours = ({ x, y }) => {
  const neighbours = [];
  if (area[y - 1] && area[y - 1][x] === ".") {
    neighbours.push({ x, y: y - 1 });
  }
  if (area[y + 1] && area[y + 1][x] === ".") {
    neighbours.push({ x, y: y + 1 });
  }
  if (area[y][x - 1] === ".") {
    neighbours.push({ x: x - 1, y });
  }
  if (area[y][x + 1] === ".") {
    neighbours.push({ x: x + 1, y });
  }
  return neighbours;
};

const markLoop = ({ x, y }) => {
  const queue = [{ x, y }];
  while (queue.length > 0) {
    const { x, y } = queue.shift();
    if (area[y][x] === ",") {
      continue;
    }
    area[y][x] = ",";
    const neighbours = getNeighbours({ x, y });
    neighbours.forEach((neighbour) => {
      queue.push(neighbour);
    });
  }
};

const fillHole = () => {
  markLoop({ x: 0, y: 0 });
  markLoop({ x: area[0].length - 1, y: area.length - 1 });
};

const calcHole = () => {
  // check amount of # in area
  let count = 0;
  area.forEach((row) => {
    row.forEach((spot) => {
      if (spot !== ",") {
        count++;
      }
    });
  });
  console.log("answer: ", count);
  return count;
};

const run = async (filename = "./input.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  for await (const line of lines) {
    const [direction, steps, color] = line.split(" ");
    instructions.push({ direction, steps: parseInt(steps) });
    // do stuff
  }
  createArea();
  populateTrench();
  PrintAMap(area);
  fillHole();
  console.log("area");

  PrintAMap(area);

  return calcHole();
};

// run();

module.exports = {
  RunTask: (filename) => run(filename),
};
