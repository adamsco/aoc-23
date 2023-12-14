const { CreateLineReader } = require("../_util/LineReader");

const areas = [];

const reflectsHorizontally = (area, index) => {
  for (let y = 1; y < area.length / 2; y++) {
    const r1 = area[index - y + 1];
    const r2 = area[index + y];

    if (r1 === undefined || r2 === undefined) {
      continue;
      // return true; ?
    }

    for (let x = 0; x <= r1.length; x++) {
      if (r1[x] !== r2[x]) {
        return false;
      }
    }
  }
  return true;
};

const reflectsVertically = (area, index) => {
  for (const row of area) {
    for (let x = 1; x <= row.length / 2; x++) {
      const val1 = row[index - x + 1];
      const val2 = row[index + x];
      if (val1 !== val2) {
        if (val1 === undefined || val2 === undefined) {
          continue;
        }
        return false;
      }
    }
  }
  return true;
};

let sum = 0;
const calculate = () => {
  let count = 0;
  for (const area of areas) {
    count++;

    if (count !== 72) {
      // continue;
    } else {
      // console.log(area);
    }
    let math = 0;

    for (let i = 0; i < area.length; i++) {
      // if (math > 0) {
      //   break;
      // }
      if (i === area.length - 1) {
        continue;
      }
      if (reflectsHorizontally(area, i)) {
        // console.log("reflects horizontally", i);

        math += (i + 1) * 100;
      }
    }
    for (let i = 0; i < area[0].length; i++) {
      // if (math > 0) {
      //   break;
      // }
      if (i === area[0].length - 1) {
        continue;
      }
      if (reflectsVertically(area, i)) {
        // console.log("reflects vertically", i);
        math += i + 1;
      }
    }
    if (math === 0) {
      console.log("fail, count", count);
    }
    console.log("math", math);

    sum += math;
  }
  console.log("sum", sum);
  return sum;
};

const run = async (filename = "./sample.txt") => {
  const lr = CreateLineReader(filename);
  let area = [];
  for await (const line of lr) {
    if (line.length === 0) {
      areas.push(area);
      area = [];
      continue;
    }
    area.push(line.split(""));
  }
  if (area.length > 0) {
    areas.push(area);
  }
  const answer = calculate();
  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};

// 27646
