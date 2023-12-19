const { RunTask } = require("./task1");

const expectedOutput = 62;

const day = "18";

test(day + " - task1", async () => {
  const answer = await RunTask("./" + day + "/input.txt");

  // expect(1).toBe(1);
  expect(answer).toBe(expectedOutput);
});
