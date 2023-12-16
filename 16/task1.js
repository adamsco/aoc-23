const fs = require("fs");
const { PrintAMap } = require("../_util/printAMap");

// u r d l <- directions

const area = [];

const visitedMap = {};

const addToVisitedMap = (snapshot) => {
  const key = `${snapshot.position.x},${snapshot.position.y}`;
  if (!visitedMap[key]) {
    visitedMap[key] = [];
  }
  visitedMap[key].push(snapshot.direction);
};

const isVisited = (snapshot) => {
  const key = `${snapshot.position.x},${snapshot.position.y}`;
  if (!visitedMap[key]) {
    return false;
  }
  return visitedMap[key].includes(snapshot.direction);
};

const startingSnapshot = [{ position: { x: -1, y: 0 }, direction: "r" }];

const getNext = (snapshot) => {
  const newPosition = { ...snapshot.position };
  switch (snapshot.direction) {
    case "r":
      newPosition.x++;
      break;
    case "d":
      newPosition.y++;
      break;
    case "l":
      newPosition.x--;
      break;
    case "u":
      newPosition.y--;
      break;
  }
  if (
    area[newPosition.y] === undefined ||
    area[newPosition.y][newPosition.x] === undefined
  ) {
    return [];
  }
  const nextChar = area[newPosition.y][newPosition.x];
  if (nextChar === ".") {
    return [{ ...snapshot, position: newPosition }];
  }
  if (nextChar === "/") {
    if (snapshot.direction === "r") {
      return [{ position: newPosition, direction: "u" }];
    }
    if (snapshot.direction === "d") {
      return [{ position: newPosition, direction: "l" }];
    }
    if (snapshot.direction === "l") {
      return [{ position: newPosition, direction: "d" }];
    }
    if (snapshot.direction === "u") {
      return [{ position: newPosition, direction: "r" }];
    }
  }
  if (nextChar === "\\") {
    if (snapshot.direction === "r") {
      return [{ position: newPosition, direction: "d" }];
    }
    if (snapshot.direction === "d") {
      return [{ position: newPosition, direction: "r" }];
    }
    if (snapshot.direction === "l") {
      return [{ position: newPosition, direction: "u" }];
    }
    if (snapshot.direction === "u") {
      return [{ position: newPosition, direction: "l" }];
    }
  }
  if (nextChar === "-") {
    if (snapshot.direction === "r") {
      return [{ position: newPosition, direction: "r" }];
    }
    if (snapshot.direction === "l") {
      return [{ position: newPosition, direction: "l" }];
    }
    if (snapshot.direction === "u" || snapshot.direction === "d") {
      return [
        { position: newPosition, direction: "l" },
        { position: newPosition, direction: "r" },
      ];
    }
  }
  if (nextChar === "|") {
    if (snapshot.direction === "u") {
      return [{ position: newPosition, direction: "u" }];
    }
    if (snapshot.direction === "d") {
      return [{ position: newPosition, direction: "d" }];
    }
    if (snapshot.direction === "l" || snapshot.direction === "r") {
      return [
        { position: newPosition, direction: "u" },
        { position: newPosition, direction: "d" },
      ];
    }
  }

  console.log("missed case", { nextChar, direction: snapshot.direction });
  return [];
};

const simulate = (snapshot) => {
  if (isVisited(snapshot)) {
    return;
  }
  addToVisitedMap(snapshot);
  const next = getNext(snapshot);
  next.forEach((s) => simulate(s));
};

const start = () => {
  startingSnapshot.forEach((s) => {
    const next = getNext(s);
    console.log("starting at", next);
    next.forEach((s) => simulate(s));
  });
};

const getSum = () => {
  return Object.keys(visitedMap).length;
};

const printVisited = () => {
  const areaCopy = JSON.parse(JSON.stringify(area));
  Object.keys(visitedMap).forEach((key) => {
    const [x, y] = key.split(",").map((n) => parseInt(n));

    areaCopy[y][x] = "X";
  });
  PrintAMap(areaCopy);
};

const run = async (filename = "./input.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  for await (const line of lines) {
    area.push(line.split("").filter((c) => c !== ""));
  }
  start();
  // printVisited();
  const answer = getSum();
  console.log("answer", answer);
  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
