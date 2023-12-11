const { CreateLineReader } = require("../_util/LineReader");
const { PrintAMap } = require("../_util/printAMap");
const galaxy = [];
const emptyStepSize = 1000000;

const emptyY = [];
const emptyX = [];

const addNewRow = (index) => {
  emptyY.push(index);
  galaxy.splice(index, 0, new Array(galaxy[0].length).fill("X"));
};

const addNewColumn = (index) => {
  emptyX.push(index);
  galaxy.forEach((line) => {
    line.splice(index, 0, "X");
  });
};
const expandGalaxy = () => {
  for (let y = 0; y < galaxy.length; y++) {
    let found = false;
    for (let x = 0; x < galaxy[y].length; x++) {
      if (galaxy[y][x] === "#") {
        found = true;
      }
    }
    if (!found) {
      addNewRow(y);
      y++;
    }
  }

  for (let x = 0; x < galaxy[0].length; x++) {
    let found = false;
    for (let y = 0; y < galaxy.length; y++) {
      if (galaxy[y][x] === "#") {
        found = true;
      }
    }
    if (!found) {
      addNewColumn(x);
      x++;
    }
  }
};

const nodes = [];
const findNodes = () => {
  for (let y = 0; y < galaxy.length; y++) {
    for (let x = 0; x < galaxy[y].length; x++) {
      if (galaxy[y][x] === "#") {
        nodes.push({ x, y });
      }
    }
  }
  return nodes;
};

const findAllPairs = () => {
  findNodes();
  const pairs = [];
  nodes.forEach((node, i) => {
    for (let j = i + 1; j < nodes.length; j++) {
      pairs.push({ from: node, to: nodes[j] });
    }
  });
  return pairs;
};

const getNextNodes = ({ x, y }) => {
  const neighbors = [];
  for (let i = -1; i <= 1; i++) {
    if (galaxy[y + i] === undefined) {
      continue;
    }
    for (let j = -1; j <= 1; j++) {
      if (Math.abs(i) + Math.abs(j) !== 1) {
        continue;
      }
      if (galaxy[y + i][x + j] === undefined) {
        continue;
      }
      neighbors.push({ x: x + j, y: y + i });
    }
  }
  return neighbors;
};

const getHeuristic = ({ from, to }) => {
  const passingX = emptyX.filter(
    (x) => (x > from.x && x < to.x) || (x < from.x && x > to.x)
  );
  const passingY = emptyY.filter(
    (y) => (y > from.y && y < to.y) || (y < from.y && y > to.y)
  );
  const combined = passingX.length + passingY.length;
  const additionalSteps = combined * emptyStepSize - combined;

  return Math.abs(from.x - to.x) + Math.abs(from.y - to.y) + additionalSteps;
};

const isEmptyDistance = (node) => {
  return emptyX.includes(node.x) || emptyY.includes(node.y);
};

const findShortestPath = ({ from, to }) => {
  const visited = new Set();
  const queue = [{ node: from, steps: 0 }];
  while (queue.length > 0) {
    const { node, steps } = queue.shift();
    if (node.x === to.x && node.y === to.y) {
      return steps;
    }
    if (visited.has(`${node.x},${node.y}`)) {
      continue;
    }
    visited.add(`${node.x},${node.y}`);
    const next = getNextNodes(node);
    next.forEach((n) => {
      const nextSteps = isEmptyDistance(n)
        ? steps + emptyStepSize - 1
        : steps + 1;
      const h = getHeuristic({ from: n, to }) + nextSteps;

      const next = {
        node: n,
        steps: nextSteps,
        h,
      };
      const findIndex = queue.findIndex((q) => q.h >= h);
      if (findIndex === -1) {
        queue.push(next);
      } else {
        queue.splice(findIndex, 0, next);
      }
    });
  }
  return -1;
};

const sumShortestPaths = () => {
  const pairs = findAllPairs();
  let sum = 0;
  const all = [];
  pairs.forEach(({ from, to }, i) => {
    if (i % 10000 === 0) {
      console.log("at: " + i + " / " + pairs.length + "");
    }
    const steps = findShortestPath({ from, to });
    all.push({ from, to, steps });
    if (steps < 1) {
      console.error("steps", steps);
    }
    sum += steps;
  });
  console.log("sum", sum);
  return sum;
};

const run = async (filename = "./sample.txt") => {
  const lr = CreateLineReader(filename);
  for await (const line of lr) {
    // do stuff
    galaxy.push(line.trim().split(""));
  }

  expandGalaxy();

  const answer = sumShortestPaths();
  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
