const fs = require("fs");

const GTType = "GT";
const LTType = "LT";
const GoType = "GO";

const ACCEPTED = "A";
const REJECTED = "R";

const workflows = {};
const partRatings = [];

const isPartAccepted = (part, workflow) => {
  if (workflow === ACCEPTED) {
    return true;
  }
  if (workflow === REJECTED) {
    return false;
  }
  const wf = workflows[workflow];
  for (const rule of wf) {
    if (rule.type === GoType) {
      return isPartAccepted(part, rule.target);
    }
    if (rule.type === GTType) {
      if (part[rule.value] > rule.compVal) {
        return isPartAccepted(part, rule.target);
      }
    }
    if (rule.type === LTType) {
      if (part[rule.value] < rule.compVal) {
        return isPartAccepted(part, rule.target);
      }
    }
  }
  return false;
};

const evaluateParts = () => {
  let sum = 0;
  partRatings.forEach((part, i) => {
    const isOk = isPartAccepted(part, "in");
    if (isOk) {
      sum += part.x + part.m + part.a + part.s;
    }
  });
  console.log("total: ", sum);
  return sum;
};

const run = (filename = "./sample.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  let isWorkflows = true;
  for (const line of lines) {
    if (line === "") {
      isWorkflows = false;
      continue;
    } else if (isWorkflows) {
      const [name, rulesRaw] = line.split("{");
      const rules = rulesRaw.substring(0, rulesRaw.length - 1).split(",");
      const ruleSet = [];
      rules.forEach((rule) => {
        const [cond, target] = rule.split(":");
        if (target) {
          // is a conditional statement
          if (cond.includes("<")) {
            const [val, compVal] = cond.split("<");
            ruleSet.push({
              type: LTType,
              value: val,
              compVal: parseInt(compVal),
              target,
            });
          } else {
            const [val, compVal] = cond.split(">");
            ruleSet.push({
              type: GTType,
              value: val,
              compVal: parseInt(compVal),
              target,
            });
          }
        } else {
          // is a go statement
          ruleSet.push({ type: GoType, target: rule });
        }
      });
      workflows[name] = ruleSet;
    } else {
      // is part ratings
      const completedPart = {};
      const parts = line.substring(1, line.length - 1).split(",");
      parts.forEach((part) => {
        const [key, value] = part.split("=");
        completedPart[key] = parseInt(value);
      });
      partRatings.push(completedPart);
    }
  }
  return evaluateParts();
};

module.exports = {
  RunTask: (filename) => run(filename),
};
