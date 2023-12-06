const { CreateLineReader } = require("../_util/LineReader");

const seeds = [];

const map = {
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

const getMaxOffset = () => {
  let max = 0;
  for (const [key, value] of Object.entries(map)) {
    let maxInner = undefined;
    for (const [k, lookup] of Object.entries(value)) {
      if (maxInner === undefined || lookup.offset < maxInner) {
        maxInner = lookup.offset;
      }
    }
    max += maxInner;
  }
  return max;
};
const isSeedViable = (seed) => {
  return seed + maxOffset < lowest;
};

const testLookup = (lookup, seed) => {
  return seed >= lookup.fromStart && seed < lookup.fromStart + lookup.range;
};

const calcSeed = (seed) => {
  let activeSeed = seed;
  for (const lookup of masterMap) {
    if (!isSeedViable(activeSeed)) {
      return Number.MAX_SAFE_INTEGER;
    }
    if (testLookup(lookup, activeSeed)) {
      activeSeed = activeSeed + lookup.offset;
      return activeSeed;
    }
  }
  return activeSeed;
};

let lowest = Number.MAX_SAFE_INTEGER;
let maxOffset = Number.MAX_SAFE_INTEGER;

const findLowest = () => {
  maxOffset = getMaxOffset();
  seeds.forEach((seed, index) => {
    if (index % 2 === 0) {
      console.log("at seed", seed);
      const range = seeds[index + 1];
      for (let i = 0; i < range; i++) {
        const activeSeed = calcSeed(seed + i);
        if (activeSeed < lowest) {
          lowest = activeSeed;
        }
      }
    }
  });
  return lowest;
};

const run = async (filename = "./input.txt") => {
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
  console.log("populatingMaster...");
  populateMasterMap();
  console.log("finding lowest...");
  const lowest = findLowest();
  console.log("answer: ", lowest);
  return lowest;
};

module.exports = {
  RunTask: (filename) => run(filename),
};

let masterMap = [];

const populateMasterMap = () => {
  const values = Object.values(map);
  let newMap = values[0];
  for (let i = 0; i < values.length - 1; i++) {
    console.log('populate"' + i + "/" + values.length + '"');
    newMap = combineMaps(newMap, values[i + 1]);
    console.log("maplength", newMap.length);
  }
  masterMap = newMap;
};

const combineMaps = (a, b) => {
  const aVals = Object.values(a).sort((a, b) => a.fromStart - b.fromStart);
  const bVals = Object.values(b).sort((a, b) => a.fromStart - b.fromStart);
  const combined = [];

  // todo: optimize by not looping every single value like a child
  for (const aVal of aVals) {
    let currentRange = {
      offset: aVal.offset,
      range: 0,
      fromStart: aVal.fromStart,
    };
    let isOverlapping = undefined;
    for (let i = 0; i < aVal.range; i++) {
      const pointer = aVal.fromStart + i + aVal.offset;
      let hit = false;
      for (const bVal of bVals) {
        if (testLookup(bVal, pointer)) {
          hit = true;

          const newOffset = aVal.offset + bVal.offset;
          if (newOffset !== currentRange.offset || !isOverlapping) {
            if (currentRange.range > 0) {
              combined.push({ ...currentRange });
            }

            currentRange = {
              offset: newOffset,
              range: 0,
              fromStart: aVal.fromStart + i,
            };
          }
          isOverlapping = true;

          break;
        }
      }
      if (hit === false) {
        if (isOverlapping) {
          isOverlapping = false;
          combined.push({ ...currentRange });
          currentRange.fromStart = aVal.fromStart + i;
          currentRange.offset = aVal.offset;
          currentRange.range = 0;
        }
      }
      currentRange.range++;
    }
    if (currentRange.range > 0) {
      combined.push({ ...currentRange });
    }
  }
  combined.sort((a, b) => a.fromStart - b.fromStart);
  console.log("p1 complete");
  // then do reverse-check
  for (const bVal of bVals) {
    let currentRange = {
      offset: bVal.offset,
      range: 0,
      fromStart: bVal.fromStart,
    };
    let isOverlapping = undefined;
    for (let i = 0; i < bVal.range; i++) {
      const pointer = bVal.fromStart + i;
      let hit = false;
      for (const combVal of combined) {
        if (combVal.fromStart > pointer) {
          break;
        }
        if (testLookup(combVal, pointer)) {
          hit = true;
          if (!isOverlapping) {
            if (currentRange.range > 0) {
              combined.push({ ...currentRange });
            }
            isOverlapping = true;
            currentRange.fromStart = pointer;
            currentRange.range = 0;
          }

          break;
        }
      }
      if (hit === false) {
        if (isOverlapping) {
          isOverlapping = false;
          currentRange.fromStart = pointer;
          currentRange.range = 0;
        }
      }
      currentRange.range++;
    }
    if (currentRange.range > 0 && !isOverlapping) {
      combined.push({ ...currentRange });
    }
  }
  return combined;
};
