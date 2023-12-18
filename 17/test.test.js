const { RunTask } = require("./task1");

const expectedOutput = 102;

const day = "17";

test(day + " - task1", async () => {
  const answer = await RunTask("./" + day + "/sample.txt");

  // expect(1).toBe(1);
  expect(answer).toBe(expectedOutput);
});
