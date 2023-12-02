const { CreateLineReader } = require("../_util/LineReader");

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

    const map = {
      red: 0,
      green: 0,
      blue: 0,
    };

    pairs.map((pair) => {
      const [n, c] = pair.trim().split(" ");
      const number = parseInt(clean(n));
      const color = clean(c);

      if (number > map[color]) {
        map[color] = number;
      }
    });

    sum += map.red * map.green * map.blue;
  }
  console.log("sum", sum);
};

doStuff();
