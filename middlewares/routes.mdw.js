module.exports = function (app) {
  app.get("/", function (req, res) {
    // res.send('<b>Hello</b> World!');
    res.render("home");
  });

  app.get("/about", function (req, res) {
    res.render("about");
  });

  app.get("/bs4", function (req, res) {
    res.sendFile(__dirname + "/bs4.html");
  });

  app.use("/account/", require("../controllers/account.route"));

  app.use("/admin/categories/", require("../controllers/category.route"));
  app.use("/papers/", require("../controllers/paper-user.route"));
  app.use("/demo/", require("../controllers/demo.route"));
};
