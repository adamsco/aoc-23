const fs = require("fs");

const GTType = "GT";
const LTType = "LT";
const GoType = "GO";

const ACCEPTED = "A";
const REJECTED = "R";

const workflows = {};
const partRatings = [];

const getOppositeVal = (rule) => {
  if (rule.type === GTType) {
    return { type: LTType, value: rule.value, compVal: rule.compVal + 1 };
  }
  if (rule.type === LTType) {
    return { type: GTType, value: rule.value, compVal: rule.compVal - 1 };
  }
  console.log("ERROR X2", rule);
  return undefined;
};

const possiblePaths = [];

const sumConditionsToAcceptance = (workflow, pRules) => {
  const prevRules = [...pRules];
  if (workflow === ACCEPTED) {
    possiblePaths.push(prevRules);
    return;
  }
  if (workflow === REJECTED) {
    return;
  }
  const wf = workflows[workflow];

  for (const rule of wf) {
    if (rule.type === GTType) {
      sumConditionsToAcceptance(rule.target, [...prevRules, rule]);
      prevRules.push(getOppositeVal(rule));
    } else if (rule.type === LTType) {
      sumConditionsToAcceptance(rule.target, [...prevRules, rule]);
      prevRules.push(getOppositeVal(rule));
    } else if (rule.type === GoType) {
      if (rule.target === REJECTED) {
        return;
        // ignore
      } else if (rule.target === ACCEPTED) {
        // return 1
        possiblePaths.push(prevRules);
        return;
      } else {
        sumConditionsToAcceptance(rule.target, [...prevRules]);
      }
    } else {
      console.log("FAIL");
    }
  }
};

const getMinMaxForVal = (val, path) => {
  let min = 1;
  let max = 4000;
  const valRules = path.filter((p) => p.value === val);
  for (const rule of valRules) {
    if (rule.type === GTType) {
      if (rule.compVal + 1 > min) {
        min = rule.compVal + 1;
      }
    } else if (rule.type === LTType) {
      if (rule.compVal - 1 < max) {
        max = rule.compVal - 1;
      }
    }
  }
  return { min, max };
};

const getCombination = (path) => {
  const xRange = getMinMaxForVal("x", path);
  const mRange = getMinMaxForVal("m", path);
  const aRange = getMinMaxForVal("a", path);
  const sRange = getMinMaxForVal("s", path);

  const x = xRange.max - xRange.min + 1;
  const m = mRange.max - mRange.min + 1;
  const a = aRange.max - aRange.min + 1;
  const s = sRange.max - sRange.min + 1;
  if (x < 0 || m < 0 || a < 0 || s < 0) {
    return 0;
  }
  return x * m * a * s;
};

const evaluateParts = () => {
  sumConditionsToAcceptance("in", []);
  let result = 0;
  possiblePaths.forEach((path) => {
    result += getCombination(path);
  });
  console.log("result", result);
  return result;
};

let timer = Date.now();
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
