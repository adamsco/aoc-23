module.exports = {
  PrintAMap: (map) => {
    const printMap = map.map((row) => row.join("")).join("\n");
    console.log(printMap);
  },
};
