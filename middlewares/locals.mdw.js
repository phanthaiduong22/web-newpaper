const categoryModel = require("../models/category.model");
const userModel = require("../models/user.model");

module.exports = function (app) {
  app.use(async function (req, res, next) {
    if (req.session.auth === undefined) req.session.auth = false;

    if (req.session.auth === true) {
      if (req.session.authUser) {
        const result = await userModel.findByUserID(
          req.session.authUser.UserID,
        );
        if (!result) {
          req.session.destroy();
          return res.redirect("/");
        }
        req.session.authUser = result;
      }
    }

    for (const key of Object.keys(req.session)) {
      res.locals[key] = req.session[key];
    }

    next();
  });

  app.use(async function (req, res, next) {
    const raw_data = await categoryModel.allWithDetails();
    const list = raw_data[0];
    res.locals.lcCategories = list;
    next();
  });
};
