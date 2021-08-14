const sortAscending = (column) => {
  return (first, second) => {
    if (first[column] < second[column]) return -1;
    if (first[column] > second[column]) return 1;
    return 0;
  };
};

const sortDescending = (column) => {
  return (first, second) => {
    if (first[column] > second[column]) return -1;
    if (first[column] < second[column]) return 1;
    return 0;
  };
};

module.exports = {
  sortHelper(req) {
    return async (data) => {
      // console.log("here");
      if (req.query) {
        if (req.query.hasOwnProperty("_sort")) {
          const isValidType = ["asc", "desc"].includes(req.query.type);
          if (req.query.type === "asc") {
            return data.sort(sortAscending(req.query.column));
          }
          data.sort(sortDescending(req.query.column));
        }
      }
      return data;
    };
  },
};
