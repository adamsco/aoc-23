const { RunTask } = require("./task2");

const expectedOutput = 7;

const day = "22";

test(day + " - task1", async () => {
  const answer = await RunTask("./" + day + "/input.txt");

  // expect(1).toBe(1);
  expect(answer).toBe(expectedOutput);
});
