const { CreateLineReader } = require("../_util/LineReader");

const maxMap = {
  red: 12,
  green: 13,
  blue: 14,
};

const clean = (str) => {
  // remove non numeric and non alphabetic characters
  return str.replace(/[^0-9a-z]/gi, "");
};

const doStuff = async () => {
  let sum = 0;
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    // do stuff
    [game, scores] = line.split(":");
    // console.log("split", { game, scores, line });

    const [_, gameIdStr] = game.split(" ");
    const gameId = parseInt(clean(gameIdStr));

    const pairs = scores.split(/,|;/);

    const success = pairs.every((pair) => {
      const [n, c] = pair.trim().split(" ");
      const number = parseInt(clean(n));
      const color = clean(c);

      if (number > maxMap[color]) {
        return false;
      }
      return true;
    });

    if (success) {
      console.log("success", game);
      sum += gameId;
    }
  }
  console.log("sum", sum);
};

doStuff();
