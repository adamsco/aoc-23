const { CreateLineReader } = require("../_util/LineReader");

const instructions = [];

const nodes = {};

let currentNodes = [];

const populateStartNodes = () => {
  Object.entries(nodes).forEach(([key, value]) => {
    if (key.endsWith("A")) {
      currentNodes.push(key);
    }
  });
  console.log("start nodes", currentNodes);
};

const getNextNode = (key, dir) => {
  return nodes[key][dir];
};

const findNextZ = (startNode, startIndex) => {
  let i = startIndex;
  let steps = 0;
  let node = startNode;

  while (true) {
    const nextDir = instructions[i];
    i = (i + 1) % instructions.length;

    node = getNextNode(node, nextDir);
    currentNodes = currentNodes.map((node) => getNextNode(node, nextDir));

    steps++;
    if (node.endsWith("Z")) {
      return { steps, i, node };
    }
  }
};

const cyclethings = [];

const findCycles = () => {
  populateStartNodes();
  currentNodes.forEach((node) => {
    const { steps: offset, i, node: startNode } = findNextZ(node, 0);

    const { steps: cycleSteps } = findNextZ(startNode, i);

    cyclethings.push({ offset, cycleSteps });
  });
};

const findLowestMatch = () => {
  let i = 0;
  while (true) {
    const amountOfSteps = cyclethings[0].offset + cyclethings[0].cycleSteps * i;
    let success = true;
    cyclethings.forEach((cycle, j) => {
      if (success) {
        if ((amountOfSteps - cycle.offset) % cycle.cycleSteps !== 0) {
          success = false;
        }
      }
    });
    if (success) {
      return amountOfSteps;
    }
    i++;
  }
};

const run = async (filename = "./sample.txt") => {
  const lr = CreateLineReader(filename);
  for await (const line of lr) {
    // do stuff
    if (instructions.length === 0) {
      instructions.push(...line.split("").filter((c) => c !== " "));
      continue;
    }
    if (line.includes("=")) {
      const [keyRaw, paths] = line.split(" = ");
      const key = keyRaw.trim();
      let [p1, p2] = paths.split(",");
      // filter non-letters from string
      p1 = p1.replace(/[^a-zA-Z0-9]/g, "");
      p2 = p2.replace(/[^a-zA-Z0-9]/g, "");

      nodes[key] = { L: p1, R: p2 };
    }
  }

  findCycles();
  const answer = findLowestMatch();
  console.log({ answer });
  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
