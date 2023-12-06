const { CreateLineReader } = require("../_util/LineReader");

const seeds = [];

const map = {
  // "seed": {},
  soil: {},
  fertilizer: {},
  water: {},
  light: {},
  temperature: {},
  humidity: {},
  location: {},
};

const parseSeeds = (line) => {
  const [seed, ...values] = line.split(" ").map((s) => parseInt(s));
  seeds.push(...values);
};

const addToMap = (map, fromStart, toStart, range) => {
  const offset = toStart - fromStart;
  map[fromStart] = { offset, range, fromStart };
};

const findLowest = () => {
  console.log("seeds", seeds);
  let lowest = Number.MAX_SAFE_INTEGER;
  const seedsResults = {};
  seeds.forEach((seed) => {
    let activeSeed = seed;
    for (const [key, value] of Object.entries(map)) {
      let found = false;
      for (const [k, lookup] of Object.entries(value)) {
        if (found) {
          continue;
        }
        if (
          activeSeed >= lookup.fromStart &&
          activeSeed <= lookup.fromStart + lookup.range
        ) {
          activeSeed = activeSeed + lookup.offset;
          found = true;
          continue;
        }
      }
    }
    seedsResults[seed] = activeSeed;
    if (activeSeed < lowest) {
      lowest = activeSeed;
    }
  });
  console.log("seedResults", seedsResults);
  return lowest;
};

const run = async (filename = "./sample.txt") => {
  const lr = CreateLineReader(filename);
  let activeMap = undefined;
  for await (const line of lr) {
    if (line.includes("seeds:")) {
      parseSeeds(line);
    } else if (line.includes("-to-")) {
      const [mapString, _] = line.split(" ");
      const [from, divider, to] = mapString.split("-");
      activeMap = to;
    } else {
      const numbers = line.split(" ").map((s) => parseInt(s));
      if (numbers.length === 3) {
        const [destStart, fromStart, range] = numbers;
        addToMap(map[activeMap], fromStart, destStart, range);
      } else {
        // console.warn("Unknown line", { line, numbers });
      }
    }
  }
  const lowest = findLowest();
  return lowest;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
