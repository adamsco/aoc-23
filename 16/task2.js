const fs = require("fs");
const { PrintAMap } = require("../_util/printAMap");

// u r d l <- directions

const area = [];

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

let visitedMap = {};

const start = () => {
  populateStartingSnapshot();
  startingSnapshot.forEach((s) => {
    visitedMap = {};
    const next = getNext(s);
    next.forEach((s) => simulate(s));
    const sum = getSum();
    if (sum > largestSum) {
      largestSum = sum;
    }
  });
};

const startingSnapshot = [];

let largestSum = 0;
const populateStartingSnapshot = () => {
  for (let i = 0; i < area[0].length; i++) {
    startingSnapshot.push({ position: { x: i, y: -1 }, direction: "d" });
  }
  for (let i = 0; i < area.length; i++) {
    startingSnapshot.push({
      position: { x: area[0].length, y: i },
      direction: "l",
    });
  }
  for (let i = area[0].length; i >= 0; i--) {
    startingSnapshot.push({
      position: { x: i, y: area.length },
      direction: "u",
    });
  }
  for (let i = area.length; i >= 0; i--) {
    startingSnapshot.push({ position: { x: -1, y: i }, direction: "r" });
  }
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
  // const answer = getSum();
  console.log("answer", largestSum);
  return largestSum;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
