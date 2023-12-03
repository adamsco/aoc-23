const { CreateLineReader } = require("../_util/LineReader");

const run = async (filename = "./sample.txt") => {
  const lr = CreateLineReader(filename);
  for await (const line of lr) {
    // do stuff
  }
  const answer = 3;
  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
