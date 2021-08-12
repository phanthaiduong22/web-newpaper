const exphbs = require("express-handlebars");
const hbs_sections = require("express-handlebars-sections");
const numeral = require("numeral");
var helpers = require("handlebars-helpers")();
module.exports = function (app) {
  app.engine(
    "hbs",
    exphbs({
      defaultLayout: "main.hbs",
      // defaultLayout: "bs4.hbs",
      helpers: {
        section: hbs_sections(),
        format_number(val) {
          return numeral(val).format("0,0");
        },
        helpers,
        sum: (a, b) => a + b,
      },
    }),
  );
  app.set("view engine", "hbs");
};
