const { RunTask } = require("./task2");

const expectedOutput = 2;

const day = "09";

test("0" + day + " - task2", async () => {
  const answer = await RunTask("./" + day + "/input.txt");

  // expect(1).toBe(1);
  expect(answer).toBe(expectedOutput);
});
