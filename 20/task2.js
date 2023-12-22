const fs = require("fs");

// broadcaster -> a, b, c
// %a -> b

const FLIPFLOP = "flipflop"; // %
const CON = "&con";
const BROADCASTER = "broadcaster";

const modules = {};

let signalLow = 0;
let signalHigh = 0;

const LOW = "low";
const HIGH = "high";
const ON = "on";
const OFF = "off";

const processFlipFlop = (ff, signal) => {
  if (signal === HIGH) {
    return undefined;
  } else {
    ff.state = ff.state === ON ? OFF : ON;
    const signals = [];
    const newSignal = ff.state === ON ? HIGH : LOW;
    ff.receivers.forEach((r) => {
      signals.push({ target: r, signal: newSignal, sender: ff.name });
    });
    return signals;
  }
};

const processCon = (con, signal, sender) => {
  con.state[sender] = signal;
  const signals = [];
  const newSignal = Object.values(con.state).every((v) => v === HIGH)
    ? LOW
    : HIGH;
  con.receivers.forEach((r) => {
    signals.push({ target: r, signal: newSignal, sender: con.name });
  });
  return signals;
};

const processBroadcaster = (broadcaster, signal) => {
  const signals = [];
  broadcaster.receivers.forEach((r) => {
    signals.push({ target: r, signal, sender: broadcaster.name });
  });
  return signals;
};

const processSignal = (module, signal, sender) => {
  if (module.type === FLIPFLOP) {
    return processFlipFlop(module, signal);
  } else if (module.type === CON) {
    return processCon(module, signal, sender);
  } else if (module.type === BROADCASTER) {
    return processBroadcaster(module, signal);
  }
};

const getInitialModuleState = (type, name) => {
  if (type === FLIPFLOP) {
    return {
      type: FLIPFLOP,
      state: OFF,
      receivers: modules[name].receivers,
      name,
    };

    // state: off
    // they are initially off. If a flip-flop module
    // receives a high pulse, it is ignored and nothing
    // happens. However, if a flip-flop module receives a
    // low pulse, it flips between on and off. If it was
    // off, it turns on and sends a high pulse. If it
    // was on, it turns off and sends a low pulse
  } else if (type === CON) {
    // Conjunction modules (prefix &) remember the type of the
    // most recent pulse received from each of their connected
    // input modules; they initially default to remembering a
    // low pulse for each input. When a pulse is received, the
    // conjunction module first updates its memory for that input.
    // Then, if it remembers high pulses for all inputs, it sends
    // a low pulse; otherwise, it sends a high pulse.
    const sendersRaw = Object.entries(modules).filter(([k, v]) =>
      v.receivers.some((r) => r === name)
    );
    const senders = {};
    sendersRaw.forEach(([k, v]) => {
      senders[k] = LOW;
    });
    return {
      type: CON,
      state: senders,
      receivers: modules[name].receivers,
      name,
    };
  } else if (type === BROADCASTER) {
    return {
      type: BROADCASTER,
      state: undefined,
      receivers: modules[name].receivers,
      name: BROADCASTER,
    };
    // sends the same pulse to all of its connected output modules
  }
};

const mStates = {};

const initModule = (name) => {
  if (!modules[name]) {
    return false;
  }
  const { type } = modules[name];
  mStates[name] = getInitialModuleState(type, name);
  return true;
};

let lowSignals = 0;
let highSignals = 0;

let rxComplete = false;

let bestHp = 0;

const pressButton = () => {
  const queue = [{ target: BROADCASTER, signal: LOW, sender: "button" }];
  while (queue.length > 0) {
    const { target, signal, sender } = queue.shift();
    if (signal === LOW) {
      lowSignals++;
    } else {
      highSignals++;
    }

    if (target === "rx" && signal === LOW) {
      rxComplete = true;
      break;
    }
    if (target === "rx") {
      const okCount = Object.values(mStates[sender].state).reduce((acc, v) => {
        const newV = v === HIGH ? 1 : 0;
        return acc + newV;
      }, 0);
      if (okCount > 0) {
        checkHp();
      }
      if (okCount > bestHp) {
        bestHp = okCount;
        console.log("bestHp", {
          bestHp,
          state: mStates[sender].state,
          presses,
        });
      }
      if (mStates[sender].state["rf"] === HIGH) {
        console.log("rf", { lowSignals, highSignals, presses });
      }
    }
    if (!mStates[target]) {
      const targetIsModule = initModule(target);
      if (!targetIsModule) {
        continue;
      }
    }

    const module = mStates[target];

    const newSignals = processSignal(module, signal, sender);
    if (newSignals && newSignals.length > 0) {
      queue.push(...newSignals);
    }
  }
};

// cycles...
// sr = 3923
// sn = 3967
// rf = 4021
// vq = 3917
// lgm = 3923 * 3967 * 4021 * 3917 = 245114020323037

const hpStates = { sr: [], sn: [], rf: [], vq: [] };
let remaining = ["sr", "sn", "rf", "vq"];

const checkHp = () => {
  const state = mStates["hp"].state;
  Object.entries(state).forEach(([k, v]) => {
    if (v === HIGH) {
      hpStates[k].push(presses);
    }
  });
  if (Object.values(hpStates).every((v) => v.length > 0)) {
    const bigSum = Object.values(hpStates).reduce((acc, v) => {
      return acc * v[0];
    }, 1);
    rxComplete = true;

    console.log("sum", { bigSum });

    return bigSum;
  }
};

let presses = 0;
const pressButtonXTimes = (x) => {
  while (rxComplete === false) {
    presses++;
    pressButton();
  }
  return checkHp();
};

let timer = Date.now();
const run = (filename = "./input.txt") => {
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  for (const line of lines) {
    const [senderRaw, receiversRaw] = line.split(" -> ");
    const marker = senderRaw.charAt(0);
    let sender = senderRaw.substring(1);
    let type = "";
    const receivers = receiversRaw.split(",").map((r) => r.trim());
    if (marker === "%") {
      type = FLIPFLOP;
    } else if (marker === "&") {
      type = CON;
    } else {
      type = BROADCASTER;
      sender = BROADCASTER;
    }
    // do stuff
    modules[sender] = {
      type,
      receivers,
    };
  }

  const sum = pressButtonXTimes(1000);
  console.log("done", { lowSignals, highSignals, sum });
  return sum;
};

module.exports = {
  RunTask: (filename) => run(filename),
};
