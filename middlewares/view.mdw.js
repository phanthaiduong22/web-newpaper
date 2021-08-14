const exphbs = require("express-handlebars");
const hbs_sections = require("express-handlebars-sections");
const numeral = require("numeral");
var helpers = require("handlebars-helpers")();

const Handlebars = require("handlebars");

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

        sortable: (column, sort) => {
          const sortType = column === sort.column ? sort.type : "default";
          const icons = {
            default: "oi oi-elevator",
            asc: "oi oi-sort-ascending",
            desc: "oi oi-sort-descending",
          };
          const types = {
            default: "desc",
            asc: "desc",
            desc: "asc",
          };
          const type = types[sortType];
          const icon = icons[sortType];

          const href = Handlebars.escapeExpression(
            `?_sort&column=${column}&type=${type}`,
          );

          const result = `<a href="${href}">
                            <span class="${icon}"></span>
                          </a>`;
          return new Handlebars.SafeString(result);
        },
      },
    }),
  );
  app.set("view engine", "hbs");
};
