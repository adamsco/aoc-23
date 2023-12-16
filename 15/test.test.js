const { RunTask } = require("./task2");

const expectedOutput = 145;

const day = "15";

test(day + " - task2", async () => {
  const answer = await RunTask("./" + day + "/input.txt");

  // expect(1).toBe(1);
  expect(answer).toBe(expectedOutput);
});
