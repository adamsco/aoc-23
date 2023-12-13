const { CreateLineReader } = require("../_util/LineReader");

const sequences = [];
const arrangements = [];

const HASH = "#";
const WILD = "?";
const EMPTY = ".";

let sum = 0;

const canArrangementFit = (ar, position) => {
  const offset = ar - 1;
  if (position + offset >= mainSeq.length) {
    return false;
  }
  if (position !== 0) {
    if (mainSeq[position - 1] === HASH) {
      return false;
    }
  }
  for (let i = position; i <= position + offset; i++) {
    if (mainSeq[i] === EMPTY) {
      return false;
    }
  }

  if (mainSeq[position + offset + 1] === HASH) {
    return false;
  }
  return true;
};

const canRemainingFit = (ar, remainingLength, remaining) => {
  // split on chars not . or x
  const possibilities = remaining.join("").split(/[^\#?]/);

  const largestPossible = possibilities.reduce(
    (a, b) => Math.max(a, b.length),
    0
  );
  const spaceLeft = possibilities.join("").length;
  const largestAr = Math.max(...ar);
  if (largestAr > largestPossible) {
    // console.log("did some", remainingLength, remaining);
    return false;
  }

  const empties = remaining
    .join("")
    .split(/[^\.]/)
    .filter((s) => s !== "");

  const actualRemainingLength =
    remainingLength -
    empties.reduce((a, b) => a + Math.max(b.length - 1, 0), 0);
  const sumOfAr = ar.reduce((a, b) => a + b, 0);
  if (sumOfAr > spaceLeft) {
    return false;
  }
  const req = sumOfAr + ar.length - 1;
  return req <= actualRemainingLength;
};

const getNextIndex = (seq, singleAr, startPosition) => {
  const offset = singleAr - 1;

  for (let i = startPosition; i + offset < seq.length; i++) {
    if (canArrangementFit(singleAr, i)) {
      return i;
    }
  }

  return -1;
};

const missedHash = (start, current) => {
  for (let i = start; i < current; i++) {
    if (mainSeq[i] === HASH) {
      return true;
    }
  }
  return false;
};

const canRestReallyFit = (arList, startPosition) => {
  let pos = startPosition;
  for (let i = 0; i < arList.length; i++) {
    const ar = arList[i];
    const nextIndex = getNextIndex(mainSeq, ar, startPosition);
    if (nextIndex === -1) {
      return false;
    }
    pos = nextIndex + ar + 1;
  }
  return true;
};

let memoized = {};

const loopThings = (
  arList = mainArr,
  prevString = "",
  startPosition = 0,
  it = 0
) => {
  const arListReduced = [...arList];
  const currentAr = arListReduced.shift();
  const sumPre = sum;
  if (memoized[it + "," + startPosition] !== undefined) {
    sum += memoized[it + "," + startPosition];
    return;
  }

  const offset = currentAr - 1;

  let position = startPosition;
  while (true) {
    const index = getNextIndex(mainSeq, currentAr, position);

    if (missedHash(position, index)) {
      break;
    }
    if (index === -1 || index < position) {
      break;
    }

    const nextIndex = index + currentAr;
    if (
      !canRemainingFit(
        arListReduced,
        mainSeq.length - nextIndex,
        mainSeq.slice(nextIndex)
      )
    ) {
      break;
    }
    if (!canRestReallyFit(arListReduced, nextIndex)) {
      break;
    }
    // if (Date.now() - start > 1000) {
    //   console.log(sum, Object.keys(memoized).length, prevString);
    //   start = Date.now();
    // }

    const newStringAddition =
      new Array(index - startPosition).fill(".").join("") +
      new Array(currentAr).fill("#").join("");

    if (arListReduced.length === 0) {
      const remaining = mainSeq.slice(nextIndex) ?? "";
      const hasHashes = remaining.some((c) => c === "#");
      const restString = new Array(remaining.length).fill(".").join("");
      const entire = prevString + newStringAddition + restString;

      const ok = isOk(entire);
      // if (sum > 0 && Date.now() - start > 1000) {
      //   console.log(entire, sum, " " + (Date.now() - start) / 1000);
      //   start = Date.now();
      // }
      if (ok && !hasHashes) {
        // if (Date.now() - start > 1000) {
        //   console.log(entire, sum, " " + (Date.now() - start) / 1000);
        //   start = Date.now();
        // }
        // console.log(entire);
        // console.log({ entire, prevString, newStringAddition, restString });
        // found[entire] = true;
        sum += 1;
      }
    } else {
      if (nextIndex + arListReduced[0] >= mainSeq.length) {
        break;
      }
      const newString = prevString + newStringAddition + ".";

      // break;
      loopThings(arListReduced, newString, nextIndex + 1, it + 1);
    }
    if (mainSeq[index] === HASH) {
      // can never skip the hash
      break;
    }

    // console.log("position", { position, it, l: mainArr.length });

    position = index + 1;
    if (position >= mainSeq.length) {
      break;
    }
  }

  const postSum = sum - sumPre;
  memoized[it + "," + startPosition] = postSum;
};

const isOk = (seq) => {
  if (seq.length !== mainSeq.length) {
    return false;
  }
  const instances = seq.split(".").filter((s) => s !== "");
  if (!instances.length === mainArr.length) {
    return false;
  }
  for (let i = 0; i < mainArr.length; i++) {
    if (instances[i].length !== mainArr[i]) {
      return false;
    }
  }

  return true;
};

let mainSeq = [];
let mainArr = [];
let found = {};

const sumAllPossibleArrangements = () => {
  sequences.forEach((seq, i) => {
    mainSeq = seq;
    mainArr = arrangements[i];
    found = {};
    visited = {};
    memoized = {};

    let pre = sum;
    // getPossibleArrangements(seq, arrangements[i]);
    // console.log(mainSeq.join(""));
    loopThings();
    // console.log("main", { mainArr, mainSeq });
    const ind = i + 1;
    console.log(
      ind + " / " + sequences.length + " diff: " + (sum - pre) + " sum: " + sum
    );
  });

  console.log("real", sum);
  // console.log("real2", Object.keys(found).filter((f) => isOk(f)).length);

  return sum;
};
let start;
const run = async (filename = "./input.txt") => {
  const lr = CreateLineReader(filename);
  start = Date.now();
  for await (const line of lr) {
    // do stuff
    const [seq, arrangement] = line.split(" ");

    const sequence = seq.split("");

    const sequence5 = [
      ...sequence,
      "?",
      ...sequence,
      "?",
      ...sequence,
      "?",
      ...sequence,
      "?",
      ...sequence,
    ];

    const arr = arrangement.split(",").map((a) => parseInt(a, 10));
    const arr5 = [...arr, ...arr, ...arr, ...arr, ...arr];

    if (false) {
      sequences.push(sequence);
      arrangements.push(arr);
    } else {
      sequences.push(sequence5);
      arrangements.push(arr5);
    }
  }
  const answer = sumAllPossibleArrangements();
  const time = (Date.now() - start) / 1000; // 11.628

  console.log("TIME", time);

  return answer;
};

run();

module.exports = {
  RunTask: (filename) => run(filename),
};
