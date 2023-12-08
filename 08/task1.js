const { CreateLineReader } = require("../_util/LineReader");

const instructions = [];

const nodes = {};
const target = "ZZZ";

const followMap = () => {
  let node = "AAA";
  let i = 0;
  let steps = 0;

  while (true) {
    const nextDir = instructions[i];
    i = (i + 1) % instructions.length;
    // console.log({ nextDir, nodes, node });
    const next = nodes[node][nextDir];

    steps++;
    if (next === target) {
      return steps;
    }
    node = next;
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
      p1 = p1.replace(/[^a-zA-Z]/g, "");
      p2 = p2.replace(/[^a-zA-Z]/g, "");

      nodes[key] = { L: p1, R: p2 };
    }
  }

  const answer = followMap();
  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};

// RL

// AAA = (BBB, CCC)
// BBB = (DDD, EEE)
// CCC = (ZZZ, GGG)
// DDD = (DDD, DDD)
// EEE = (EEE, EEE)
// GGG = (GGG, GGG)
// ZZZ = (ZZZ, ZZZ)
