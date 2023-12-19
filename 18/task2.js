const fs = require("fs");
const { PrintAMap } = require("../_util/printAMap");

const instructions = [];
let area = [];
let offsetX = 0;
let offsetY = 0;

const points = [];

const createArea = () => {
  let maxX = 0;
  let minX = 0;
  let maxY = 0;
  let minY = 0;
  let x = 0;
  let y = 0;
  instructions.forEach((instruction) => {
    if (instruction.direction === "R") {
      x += instruction.steps;
    } else if (instruction.direction === "L") {
      x -= instruction.steps;
    } else if (instruction.direction === "D") {
      y += instruction.steps;
    } else if (instruction.direction === "U") {
      y -= instruction.steps;
    }
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
  });

  const totalX = maxX - minX;
  const totalY = maxY - minY;
  offsetX = Math.abs(minX) + 1;
  offsetY = Math.abs(minY) + 1;

  // console.log("max", { totalX, totalY, offsetX, offsetY });

  let xx = 0;
  let yy = 0;

  points.push({ x: xx + offsetX, y: yy + offsetY });

  instructions.forEach((instruction) => {
    if (instruction.direction === "R") {
      xx += instruction.steps;
    } else if (instruction.direction === "L") {
      xx -= instruction.steps;
    } else if (instruction.direction === "D") {
      yy += instruction.steps;
    } else if (instruction.direction === "U") {
      yy -= instruction.steps;
    }
    points.push({ x: xx + offsetX, y: yy + offsetY });
  });
  // console.log("points", points);
};

const calculateArea = () => {
  // shoelace to get area for picks theorem
  let sum = 0;
  let exteriorPoints = 0;

  points.forEach((point, i) => {
    if (i === points.length - 1) {
    } else {
      const nextPoint = points[i + 1];
      sum += point.x * nextPoint.y - point.y * nextPoint.x;

      exteriorPoints += Math.abs(point.x - nextPoint.x + point.y - nextPoint.y);
    }
  });
  const area = sum / 2;

  // picks theorem to pick out points inside
  const interiorPoints = area - exteriorPoints / 2 + 1;

  const answer = interiorPoints + exteriorPoints;

  return answer;
};

const run = async (filename = "./input.txt") => {
  const start = Date.now();
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  for await (const line of lines) {
    const [d, s, color] = line.split(" ");

    const hex = color.substring(2, 7);
    const dir = color.substring(7, 8);
    const direction =
      dir === "0" ? "R" : dir === "1" ? "D" : dir === "2" ? "L" : "U";
    const steps = parseInt(hex, 16);

    instructions.push({ direction, steps });
  }

  createArea();

  const answer = calculateArea();
  console.log("answer", answer);
  return answer;
};

run();

// raytrace each y & x and fill overlap

module.exports = {
  RunTask: (filename) => run(filename),
};

// 42199 - low
// 42380 - low
