const { RunTask } = require("./task2");

const expectedOutput = 5905;

const day = "07";

test("0" + day + " - task2", async () => {
  const answer = await RunTask("./" + day + "/sample.txt");

  expect(answer).toBe(expectedOutput);
});
