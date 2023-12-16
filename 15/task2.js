const fs = require("fs");

const hashmap = {};

const doHashmap = (sum, text) => {
  if (text[text.length - 1] === "-") {
    const [label, _] = text.split("-");
    const ind = hashmap[sum]
      ? hashmap[sum].findIndex((x) => x.label === label)
      : -1;
    if (ind >= 0) {
      hashmap[sum].splice(ind, 1);
    }
  } else {
    if (!hashmap[sum]) {
      hashmap[sum] = [];
    }

    const [label, val] = text.split("=");
    const value = parseInt(val);
    const ind = hashmap[sum]
      ? hashmap[sum].findIndex((x) => x.label === label)
      : -1;
    if (ind >= 0) {
      hashmap[sum][ind].value = value;
    } else {
      hashmap[sum].push({ label, value });
    }
  }
};

const getHashmapValue = () => {
  let sum = 0;
  Object.entries(hashmap).forEach(([box, values]) => {
    values.forEach(({ label, value }, slot) => {
      const newVal = (parseInt(box) + 1) * (slot + 1) * value;

      sum += newVal;
    });
  });
  return sum;
};

const run = async (filename = "./sample.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  let values;
  for await (const line of lines) {
    values = line.split(",").map((x) => x.trim());
  }
  values.forEach((value) => {
    const chars = value.split("");
    let current = 0;
    let dividerHit = false;
    chars.forEach((char) => {
      if (char === "-" || char === "=") {
        dividerHit = true;
      }
      if (!dividerHit) {
        current += char.charCodeAt(0);
        current = current * 17;
        current = current % 256;
      }
    });
    doHashmap(current, value);
  });
  return getHashmapValue();
};

module.exports = {
  RunTask: (filename) => run(filename),
};
