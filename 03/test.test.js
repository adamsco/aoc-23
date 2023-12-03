const { RunTask } = require("./task2");

const expectedOutput = 467835;

test("03 - task2", async () => {
  const answer = await RunTask("./03/input.txt");

  expect(answer).toBe(expectedOutput);
});
