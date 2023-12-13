const { CreateLineReader } = require("../_util/LineReader");

const sequences = [];
const arrangements = [];

const HASH = "#";
const WILD = "?";
const EMPTY = ".";

let sum = 0;

// const getUnknownIndices = (seq) => {
//   const indices = [];
//   seq.forEach((s, i) => {
//     if (s === "?") {
//       indices.push(i);
//     }
//   });
//   return indices;
// };

const removeWilds = (str) => {
  return str
    .split("")
    .map((c) => (c === "?" ? "." : c))
    .join("");
};

const canArrangementFit = (seq, ar, position) => {
  let valid = true;
  const offset = ar - 1;
  if (position + offset >= seq.length) {
    return false;
  }
  if (position !== 0) {
    if (seq[position - 1] === HASH) {
      valid = false;
    }
  }
  for (let i = position; i <= position + offset; i++) {
    if (seq[i] === EMPTY) {
      valid = false;
    }
  }

  // if (position + offset === seq.length - 1) {
  //   return valid;
  // }

  if (seq[position + offset + 1] === HASH) {
    valid = false;
  }
  if (valid) {
    // console.log("isValid", seq, ar, position);
  }

  return valid;
};

const getPossibleArrangements = (seq, ar, prevString = "", iterations = 0) => {
  // do a recursive thing here
  const seqCopy = [...seq];
  const arCopy = [...ar];
  // const currentSeq = seqCopy.shift();
  const currentAr = arCopy.shift();

  // const unknowns = getUnknownIndices(seq);
  let done = false;
  seq.forEach((s, i) => {
    if (!done && canArrangementFit(seq, currentAr, i)) {
      if (seq[i] === HASH) {
        done = true;
      }
      const newHash = new Array(currentAr).fill("#").join("");
      const removedString = seq.slice(0, i).join("");
      const remainingSeq = seq.slice(i + currentAr + 1);

      if (arCopy.length === 0) {
        // final
        const fRS = removeWilds(seq.slice(i + currentAr).join(""));
        const entireRaw = prevString + removedString + newHash + fRS;
        const hasHashes = fRS.split("").some((c) => c === "#");

        const entire = removeWilds(entireRaw);

        if (!found[entire] && !hasHashes) {
          if (testIndex !== undefined) {
            // console.log("final", {
            //   entire,
            //   prevString,
            //   removedString,
            //   newHash,
            //   fRS,
            // });
          }
          found[entire] = true;
          sum += 1;
        }
      } else {
        // const newSeq = seq.slice(i + currentAr + 1);

        const past = prevString + removedString.replace(WILD, EMPTY);
        const entireRaw = past + newHash + ".";
        const entire = removeWilds(entireRaw);
        // if (testIndex !== undefined) {
        //   console.log("parts ", {
        //     prevString,
        //     past,
        //     removedString,
        //     newHash,
        //     currentAr,
        //     entire,
        //     sequencePre: seq.join(""),
        //     remainingSeq: remainingSeq.join(""),
        //     original: sequences[testIndex].join(""),
        //     i,
        //     iterations,
        //   });
        // }

        // check if string contains char
        // if (entire.match(/[^?\.]/g)) {
        //   failed = true;
        //   console.log("failed", entire);
        //   console.log("parts ", {
        //     prevString,
        //     past,
        //     removedString,
        //     newHash,
        //     currentAr,
        //     entire,
        //     sequencePre: seq.join(""),
        //     remainingSeq: remainingSeq.join(""),
        //     // original: sequences[testIndex].join(""),
        //     i,
        //     iterations,
        //   });
        // }
        // done = true;

        getPossibleArrangements(remainingSeq, arCopy, entire, iterations + 1);
      }
    }
  });
};

const testIndex = undefined;

let found = {};

let realSum = 0;

const isOk = (seq, arr) => {
  const instances = seq.split(".").filter((s) => s !== "");
  let ok = true;
  instances.forEach((inst, i) => {
    if (inst.length !== arr[i]) {
      // console.log("not ok", { seq, arr, i });
      ok = false;
    }
  });
  return ok;
};

const sumAllPossibleArrangements = () => {
  sequences.forEach((seq, i) => {
    found = {};
    if (false) {
    } else {
      // if (i % 10 === 0) {
      console.log(i + " / " + sequences.length);
      // }
      getPossibleArrangements(seq, arrangements[i]);
      // console.log("running checks...");
      const answers = Object.keys(found);
      const realAnswers = answers.filter((a) => isOk(a, arrangements[i]));

      realSum += realAnswers.length;

      // check for classic errors
      answers.forEach((a) => {
        const arr = a.split("");
        if (arr.length !== seq.length) {
          console.error("bad", {
            a,
            s: seq.join(""),
            al: arr.length,
            sl: seq.length,
            i,
          });
        }
        arr.forEach((c) => {
          if (c === "?") {
            console.error("bad char", { a, c, s: seq.join(""), i });
          }
        });
      });

      // console.log("res", {
      //   // sum,
      //   found,
      //   seq: seq.join(""),
      //   arr: arrangements[i].join(", "),
      //   i,
      // });
    }
  });

  console.log("real", realSum);

  return realSum;
};

const run = async (filename = "./sample.txt") => {
  const lr = CreateLineReader(filename);
  for await (const line of lr) {
    // do stuff
    const [sequence, arrangement] = line.split(" ");

    const sequence5 = [
      ...sequence.split(""),
      ...sequence.split(""),
      ...sequence.split(""),
      ...sequence.split(""),
      ...sequence.split(""),
    ];

    const arr = arrangement.split(",").map((a) => parseInt(a, 10));
    const arr5 = [...arr, ...arr, ...arr, ...arr, ...arr];
    sequences.push(sequence5);

    arrangements.push(arr5);
  }

  const answer = sumAllPossibleArrangements();
  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
