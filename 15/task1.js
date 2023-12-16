const fs = require("fs");

const run = async (filename = "./sample.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  let values;
  for await (const line of lines) {
    // do stuff
    values = line.split(",").map((x) => x.trim());
  }
  let total = 0;
  values.forEach((value) => {
    const chars = value.split("");
    let current = 0;
    chars.forEach((char) => {
      current += char.charCodeAt(0);
      current = current * 17;
      current = current % 256;
    });
    total += current;
  });
  return total;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
