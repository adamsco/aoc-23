const { RunTask } = require("./task2");

const expectedOutput = 167409079868000;

const day = "19";

test(day + " - task2", async () => {
  const answer = RunTask("./" + day + "/input.txt");

  expect(answer).toBe(expectedOutput);
});
