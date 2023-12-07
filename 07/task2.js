const { CreateLineReader } = require("../_util/LineReader");

const valueMap = {
  A: 14,
  K: 13,
  Q: 12,
  J: 0,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  1: 1,
};

const rounds = [];

const getRank = (hand) => {
  // hand is arr of values
  const handMap = {};
  hand.forEach((card) => {
    if (handMap[card]) {
      handMap[card] += 1;
    } else {
      handMap[card] = 1;
    }
  });

  const entriesRaw = [];
  for (const [key, value] of Object.entries(handMap)) {
    entriesRaw.push([key, value]);
  }
  const entriesTemp = entriesRaw.sort((a, b) => b[1] - a[1]);
  let jokers = 0;
  const jEntry = entriesTemp.find(([key, value]) => key === "J");
  if (jEntry) {
    jokers += jEntry[1];
  }
  if (jokers === 5) return 7;

  const entries = entriesTemp.filter(([key, value]) => key !== "J");
  entries[0][1] += jokers;

  // let prev = undefined;
  for ([key, value] of entries) {
    if (value === 5) {
      return 7;
    }
    if (value === 4) {
      return 6;
    }
    if (value === 3) {
      let amount = 0;
      entries.forEach((entry) => {
        if (entry[1] === 2) {
          amount += 1;
        }
      });
      if (amount === 1) {
        return 5;
      }
      return 4;
    }
    if (value === 2) {
      let amount = 0;
      entries.forEach((entry) => {
        if (entry[1] === 2) {
          amount += 1;
        }
      });
      if (amount === 1) {
        return 2;
      }
      return 3;
    }

    return 1;
  }
};

const compareTieBreak = (a, b) => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) {
      continue;
    }
    return valueMap[a[i]] - valueMap[b[i]];
  }
  return 0;
};

const compareHands = (a, b) => {
  a.rank = a.rank ?? getRank(a.hand);
  b.rank = b.rank ?? getRank(b.hand);
  const aRank = a.rank;
  const bRank = b.rank;
  if (aRank === bRank) {
    return compareTieBreak(a.hand, b.hand);
  }
  return aRank - bRank;
};

const getAnswer = () => {
  let answer = 0;

  rounds.sort(compareHands);

  rounds.forEach((round, i) => {
    answer += (i + 1) * round.bet;
  });
  return answer;
};

const run = async (filename = "./sample.txt") => {
  const lr = CreateLineReader(filename);
  for await (const line of lr) {
    // do stuff
    const [hand1, bet] = line.split(" ");
    const handCards = hand1.split("");
    rounds.push({ hand: handCards, bet: parseInt(bet) });
  }
  const answer = getAnswer();
  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
