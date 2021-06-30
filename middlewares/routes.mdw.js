module.exports = function (app) {
  // app.get("/", function (req, res) {
  //   res.render("home", { layout: "main.hbs" });
  // });
  app.get("/", function (req, res) {
    res.render("home");
  });

  app.use("/home", require("../controllers/home.route"));

  // app.get("/about", function (req, res) {
  //   res.render("home", { layout: "main.hbs" });
  // });

  // app.get("/bs4", function (req, res) {
  //   res.sendFile(__dirname + "/bs4.html");
  // });

  app.use("/account/", require("../controllers/account.route"));

  app.use("/admin/categories/", require("../controllers/category.route"));
  app.use("/papers/", require("../controllers/paper.route"));
  app.use("/editor/", require("../controllers/editor.route"));
};
