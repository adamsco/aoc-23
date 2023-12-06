const { CreateLineReader } = require("../_util/LineReader");

const pairs = [];
const solutions = [];

const calculateSolution = (pair) => {
  const { time, distance } = pair;
  let solutionCount = 0;
  for (let i = 0; i < time; i++) {
    const speed = i;
    const curDistance = (time - i) * speed;
    if (curDistance > distance) {
      solutionCount++;
    } else if (solutionCount > 0) {
      break;
    }
  }
  solutions.push(solutionCount);
};

const calculateSolutions = () => {
  pairs.forEach((pair) => calculateSolution(pair));
};

const run = async (filename = "./sample.txt") => {
  const lr = CreateLineReader(filename);
  for await (const line of lr) {
    // do stuff
    const [info, numbers] = line.split(":");
    const times = numbers
      .split(" ")
      .filter((v) => v !== "")
      .map((t) => parseInt(t));

    times.forEach((t, i) => {
      if (info === "Time") {
        pairs.push({ time: t });
      } else {
        pairs[i].distance = t;
      }
    });
  }

  calculateSolutions();
  const score = solutions.reduce((acc, cur) => acc * cur, 1);
  console.log("result", score, solutions);

  return score;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
