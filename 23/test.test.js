const { RunTask } = require("./task2");

const expectedOutput = 154;

const day = "23";

test("0" + day + " - task1", async () => {
  const answer = await RunTask("./" + day + "/input.txt");

  // expect(1).toBe(1);
  expect(answer).toBe(expectedOutput);
});
