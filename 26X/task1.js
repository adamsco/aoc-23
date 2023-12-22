const fs = require("fs");

const run = (filename = "./sample.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  for (const line of lines) {
    // do stuff
  }
  return 1;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
