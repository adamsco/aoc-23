const fs = require("fs");
const { PrintAMap } = require("../_util/printAMap");
let startingPoint;

const area = [];

const run = async (filename = "./input.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  for await (const line of lines) {
    area.push(line.split(""));
    if (!startingPoint) {
      const xpos = line.indexOf(".");
      startingPoint = { y: 0, x: xpos };
    }
    // do stuff
  }

  const network = translateNetwork(buildNetwork());
  console.log("traversing", Object.keys(network).length);

  traverseNetwork(network);
  console.log("done, total time", Date.now() - start / 1000);
  console.log("longest is", longestWalk);

  return longestWalk;
};
run();

module.exports = {
  RunTask: (filename) => run(filename),
};

let longestWalk = 0;

let timer = Date.now();
let start = Date.now();

const buildNetwork = () => {
  const nodes = [];
  const queue = [startingPoint];
  let misses = 0;
  while (queue.length > 0) {
    const startPos = queue.shift();
    const posKey = keyFromPos(startPos);
    if (nodes.some((n) => n.id === posKey)) {
      continue;
    }
    const options = getAvailableSteps(startPos, []);
    const paths = [];

    options.forEach((pos) => {
      const path = getPath(pos, startPos);
      if (path) {
        queue.push(path.pos);
        paths.push(path);
      }
    });
    if (paths.length === 1 || paths.length === 0) {
      misses++;
    }
    nodes.push({ id: posKey, pos: startPos, paths });
  }
  return nodes;
};

const translateNetwork = (nodes) => {
  const network = {};
  nodes.forEach((node) => {
    network[node.id] = node.paths.map((p) => {
      const pId = keyFromPos(p.pos);
      const n = nodes.find((n) => n.id === pId);
      const isFinal = n.pos.y === area.length - 1;
      return { id: pId, steps: p.steps, isFinal };
    });
  });
  return network;
};

const keyFromPos = (pos) => {
  return `${pos.x},${pos.y}`;
};

const traverseNetwork = (network) => {
  const queue = [
    {
      id: keyFromPos(startingPoint),
      steps: 0,
      visited: { [keyFromPos(startingPoint)]: true },
    },
  ];
  const expected = Object.keys(network).length * Object.keys(network).length;
  while (queue.length > 0) {
    const { id, steps, visited } = queue.shift();
    if (Date.now() - timer > 5000) {
      console.log("longestWalk", longestWalk);
      timer = Date.now();
    }
    const next = network[id];
    next.forEach((n) => {
      if (n.isFinal) {
        const totalSteps = steps + n.steps;
        if (totalSteps > longestWalk) {
          longestWalk = totalSteps;
        }
      } else if (visited[n.id]) {
        // skip
      } else {
        queue.splice(0, 0, {
          id: n.id,
          steps: steps + n.steps,
          visited: { ...visited, [n.id]: true },
        });
      }
    });
  }
};

let i = 0;
const getPath = (startPos, prev) => {
  const queue = [{ pos: startPos, steps: 1, visited: [prev] }];
  while (queue.length > 0) {
    const { pos, steps, visited } = queue.shift();
    if (pos.y === area.length - 1) {
      return { pos, steps };
    }
    const newVisited = [...visited, pos];

    const next = getAvailableSteps(pos, visited);
    if (next.length !== 1) {
      if (next.length === 0) {
        return undefined;
      } else {
        if (i < 5) {
          // console.log("next", { next, steps, visited, pos });
          i++;
        }
        return { pos, steps };
      }
    }
    next.forEach((np) => {
      queue.push({
        pos: np,
        steps: steps + 1,
        visited: newVisited,
      });
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

  const test = [up, down, left, right];

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
