const { RunTask } = require("./task2");

const expectedOutput = 30;

test("04 - task1", async () => {
  const answer = await RunTask("./04/input.txt");

  expect(answer).toBe(expectedOutput);
});
