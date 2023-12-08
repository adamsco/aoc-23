const { RunTask } = require("./task2");

const expectedOutput = 6;

const day = "08";

test("0" + day + " - task2", async () => {
  const answer = await RunTask("./" + day + "/sample.txt");

  // expect(1).toBe(1);
  expect(answer).toBe(expectedOutput);
});
