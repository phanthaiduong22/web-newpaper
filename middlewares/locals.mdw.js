const categoryModel = require("../models/category.model");
const userModel = require("../models/user.model");

module.exports = function (app) {
  app.use(async function (req, res, next) {
    if (req.session.authUser) {
      if (req.session.authUser.UserID) {
        const result = await userModel.findByUserID(
          req.session.authUser.UserID,
        );
        if (!result) {
          req.session.destroy();
          return res.redirect("/");
        }
      }
    }
    if (req.session.auth === undefined) {
      req.session.auth = false;
    }
    if (req.session.auth === true) {
      if (req.session.authUser.UserID)
        req.session.authUser = await userModel.findByUserID(
          req.session.authUser.UserID,
        );
    }

    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    res.locals.admin = req.session.admin;
    res.locals.writer = req.session.writer;
    next();
  });

  app.use(async function (req, res, next) {
    const raw_data = await categoryModel.allWithDetails();
    const list = raw_data[0];
    res.locals.lcCategories = list;
    next();
  });
};
