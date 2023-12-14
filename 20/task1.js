const fs = require("fs");

const run = async (filename = "./sample.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  for await (const line of lines) {
    // do stuff
  }
  const answer = 3;
  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
