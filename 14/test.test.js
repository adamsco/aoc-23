const { RunTask } = require("./task2");

const expectedOutput = 136;

const day = "14";

test("0" + day + " - task1", async () => {
  const answer = await RunTask("./" + day + "/sample.txt");

  // expect(1).toBe(1);
  expect(answer).toBe(expectedOutput);
});
