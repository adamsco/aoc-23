const fs = require("fs");
const { PrintAMap } = require("../_util/printAMap");
const { dir } = require("console");
const area = [];
const visitedMap = {};

const getPosKey = (position, directionsHistory) => {
  return `${position.x},${position.y},${directionsHistory[0]},${directionsHistory.length}`;
};

const isTargetPosition = (pos) => {
  return pos.y === area.length - 1 && pos.x === area[0].length - 1;
};

const getPossibleDirections = (position, directionsHistory) => {
  const possibleDirections = [];

  let canGoN = true;
  let canGoS = true;
  let canGoE = true;
  let canGoW = true;

  if (directionsHistory.length > 0) {
    if (directionsHistory[0] === "N") {
      canGoS = false;
    } else if (directionsHistory[0] === "S") {
      canGoN = false;
    } else if (directionsHistory[0] === "E") {
      canGoW = false;
    } else if (directionsHistory[0] === "W") {
      canGoE = false;
    }
  }

  if (directionsHistory && directionsHistory.length < 4) {
    if (directionsHistory[0] === "N") {
      canGoS = false;
      canGoE = false;
      canGoW = false;
    } else if (directionsHistory[0] === "S") {
      canGoN = false;
      canGoE = false;
      canGoW = false;
    } else if (directionsHistory[0] === "E") {
      canGoN = false;
      canGoS = false;
      canGoW = false;
    } else if (directionsHistory[0] === "W") {
      canGoN = false;
      canGoS = false;
      canGoE = false;
    }
  }

  if (position.x === 0) {
    canGoW = false;
  } else if (position.x === area[0].length - 1) {
    canGoE = false;
  }
  if (position.y === 0) {
    canGoN = false;
  } else if (position.y === area.length - 1) {
    canGoS = false;
  }

  if (canGoS) {
    possibleDirections.push("S");
  }
  if (canGoE) {
    possibleDirections.push("E");
  }
  if (canGoN) {
    possibleDirections.push("N");
  }
  if (canGoW) {
    possibleDirections.push("W");
  }

  return possibleDirections;
};

const getNextPosition = (position, dir) => {
  if (dir === "W") {
    return { y: position.y, x: position.x - 1 };
  }
  if (dir === "E") {
    return { y: position.y, x: position.x + 1 };
  }
  if (dir === "N") {
    return { y: position.y - 1, x: position.x };
  }
  if (dir === "S") {
    return { y: position.y + 1, x: position.x };
  }
  console.log("Invalid direction", dir);
};

let best = Number.MAX_SAFE_INTEGER;
let bestPath = [];
const queueOffset = [];

const startTravels = () => {
  const startPosition = { x: 0, y: 0 };
  const queue = [
    {
      position: startPosition,
      accHeat: 0,
      prevPath: [],
      directionsHistory: [],
      // path: [],
    },
  ];
  let i = 0;
  while (queue.length > 0) {
    if (queue.length > 2000) {
      const oldQ = queue.splice(1000);
      queueOffset.push(oldQ);
    }
    if (queue.length < 50 && queueOffset.length > 0) {
      const oldQ = queueOffset.shift();
      queue.push(...oldQ);
    }
    const {
      position,
      accHeat,
      weight = 0,
      directionsHistory = [],
      path,
    } = queue.shift();

    if (directionsHistory.length > 10) {
      continue;
    }

    i++;

    if (isTargetPosition(position)) {
      if (directionsHistory.length < 4) {
        continue;
      }
      if (accHeat < best) {
        best = accHeat;
        bestPath = path;
      }
      continue;
    }

    getPosKey(position, directionsHistory);

    if (weight >= best) {
      continue;
    }

    const visitedKey = getPosKey(position, directionsHistory);
    if (
      visitedMap[visitedKey] !== undefined &&
      visitedMap[visitedKey] <= accHeat
    ) {
      continue;
    }

    if (
      visitedMap[visitedKey] === undefined ||
      visitedMap[visitedKey] > accHeat
    ) {
      visitedMap[visitedKey] = accHeat;
    }

    if (Date.now() - timer > 1000) {
      console.log({
        total: (Date.now() - startTime) / 1000,
        accHeat,
        best,
        mapl: Object.keys(visitedMap).length,
        it: i,
        ql: queue.length,
        ql2: queueOffset.length,
      });
      timer = Date.now();
    }

    const possibleDirections = getPossibleDirections(
      position,
      directionsHistory
    );

    possibleDirections.forEach((nextDir) => {
      const pos = getNextPosition(position, nextDir);
      const newWeight =
        area.length - 1 - pos.y + area[0].length - 1 - pos.x + accHeat;

      const updatedHistory = directionsHistory.every((d, i) => d === nextDir)
        ? [...directionsHistory, nextDir]
        : [nextDir];

      const newPath = path ? [...path, pos] : [pos];

      const queueItem = {
        position: pos,
        // prevPath: [...prevPath, position],
        accHeat: accHeat + area[pos.y][pos.x],
        weight: newWeight,
        directionsHistory: updatedHistory,
        path: newPath,
      };

      const find = queue.findIndex((q) => q.weight >= weight);
      if (find === -1) {
        queue.push(queueItem);
      } else {
        queue.splice(find, 0, queueItem);
      }
    });
  }
};

let startTime;
let timer;
const run = async (filename = "./input.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  for await (const line of lines) {
    area.push(line.split("").map((c) => parseInt(c)));
  }
  startTime = Date.now();
  timer = Date.now();

  startTravels();
  console.log("bestPath", bestPath);
  console.log("time", (Date.now() - startTime) / 1000);
  console.log("result", best);
  return best;
};
run();
module.exports = {
  RunTask: (filename) => run(filename),
};

// 875 - low
