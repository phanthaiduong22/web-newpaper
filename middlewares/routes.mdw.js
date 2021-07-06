module.exports = function (app) {

  app.use("/", require("../controllers/home.route"));

  app.use("/account/", require("../controllers/account.route"));

  app.use("/admin/categories/", require("../controllers/category.route"));

  app.use("/papers/", require("../controllers/paper.route"));

  app.use("/search/", require("../controllers/search.route"));

  app.use("/editor/", require("../controllers/editor.route"));
};
