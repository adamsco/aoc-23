const { RunTask } = require("./task2");

const expectedOutput = 288;

const day = "06";

test("0" + day + " - task2", async () => {
  const answer = await RunTask("./" + day + "/input.txt");

  expect(answer).toBe(expectedOutput);
});
