const fs = require("fs");
// 4,5,12~5,5,12
let blox = [];

// this approach will not work, should build a connection map to see which blox are crucial
// before that - simulate falling so they end up where they should be

const getDisintegrateSum = () => {
  let sum = 0;
  // console.log("blox", blox);
  blox.forEach((b) => {
    const removedBlocks = [b.id];
    const passedBlocks = [];
    let localSum = 0;
    const queue = [...b.overBlocks];
    while (queue.length > 0) {
      const ob = queue.shift();
      if (passedBlocks.some((id) => id === ob)) {
        continue;
      }
      const currentBlock = blox.find((bi) => bi.id === ob);
      const filteredUb = currentBlock.underBlocks.filter(
        (ub) => !removedBlocks.some((b) => b === ub)
      );

      if (
        filteredUb.length === 0 ||
        (filteredUb.length === 1 && filteredUb[0] === b.id)
      ) {
        removedBlocks.push(ob);
        localSum++;
        passedBlocks.push(ob);

        if (currentBlock.overBlocks.length > 0) {
          queue.push(...currentBlock.overBlocks);
        }
      }
    }
    console.log("for id: " + b.id + " sum is: ", localSum);
    sum += localSum;
  });
  console.log("total sum: ", sum);
  return sum;
};

const getTopOfBlock = (b) => {
  return Math.max(b.z + b.zd, b.z);
};

const getBottomOfBlock = (b) => {
  return Math.min(b.z, b.z + b.zd);
};

const isAOverB = (a, b) => {
  return getBottomOfBlock(a) > getTopOfBlock(b);
};
const isADirectlyOverB = (a, b) => {
  return getBottomOfBlock(a) === getTopOfBlock(b) + 1;
};
const isADirectlyUnderB = (a, b) => {
  return getTopOfBlock(a) === getBottomOfBlock(b) - 1;
};

const makeFall = () => {
  const sortedBlox = blox.sort((a, b) => {
    return getTopOfBlock(a) - getTopOfBlock(b);
  });
  // const revBlox = [...sortedBlox].reverse();

  sortedBlox.forEach((b) => {
    const collidingBlocks = sortedBlox.filter((b2) => {
      if (b2.id === b.id) return false;
      return (
        hasOverlap(b.x, b.xd, b2.x, b2.xd) && hasOverlap(b.y, b.yd, b2.y, b2.yd)
      );
    });
    const underBlocks = collidingBlocks.filter((b2) => isAOverB(b, b2));

    const topOfUnderBlocks = underBlocks.map((b2) => getTopOfBlock(b2));
    const top = Math.max(...topOfUnderBlocks, 0);
    if (b.z >= 0) {
      b.z = top + 1;
    } else {
      b.z = top + 1 - b.zd;
    }
  });

  blox = sortedBlox;
};

const linkBlox = () => {
  blox.forEach((b) => {
    const collidingBlocks = blox.filter((b2) => {
      if (b2.id === b.id) return false;
      return (
        hasOverlap(b.x, b.xd, b2.x, b2.xd) && hasOverlap(b.y, b.yd, b2.y, b2.yd)
      );
    });
    const overBlocks = collidingBlocks
      .filter((b2) => {
        return isADirectlyUnderB(b, b2);
      })
      .map((b2) => b2.id);
    const underBlocks = collidingBlocks
      .filter((b2) => {
        return isADirectlyOverB(b, b2);
      })
      .map((b2) => b2.id);
    b.overBlocks = overBlocks;
    b.underBlocks = underBlocks;
  });
};

const hasOverlap = (a, ad, b, bd) => {
  return (a >= b || a + ad >= b) && (a <= b + bd || a + ad <= b + bd);
};

const run = async (filename = "./sample.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  let id = 1;
  for await (const line of lines) {
    const [start, end] = line.split("~");
    const [x, y, z] = start.split(",").map((n) => parseInt(n));
    const [x2, y2, z2] = end.split(",").map((n) => parseInt(n));
    const xd = x2 - x;
    const yd = y2 - y;
    const zd = z2 - z;

    blox.push({ x, y, z, xd, yd, zd, id });
    id++;
    // do stuff
  }
  makeFall();
  linkBlox();
  const answer = getDisintegrateSum();
  return answer;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
