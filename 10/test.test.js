const { RunTask } = require("./task1");

const expectedOutput = 4;

const day = "10";

test(day + " - task2", async () => {
  const answer = await RunTask("./" + day + "/input.txt");

  // expect(1).toBe(1);
  expect(answer).toBe(expectedOutput);
});
