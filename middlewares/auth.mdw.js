const userModel = require("../models/user.model");

const authUser = async (req, res, next) => {
  if (req.session.authUser) {
    const result = await userModel.findByUserID(req.session.authUser.UserID);
    if (!result) {
      return res.redirect("/");
    }
  }
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect("/account/login");
  }
  next();
};

function authRole(role) {
  return (req, res, next) => {
    if (
      !role.includes(req.session.authUser.Role) &&
      req.session.authUser.Role !== "admin"
    ) {
      req.session.retUrl = req.originalUrl;
      return res.redirect("/");
    }
    next();
  };
}

function authPremium(req, res, next) {
  if (!req.session.authUser.Premium)
    return res.render("home", { err_message: "This paper is premium!" });
  next();
}

function notAuth(req, res, next) {
  if (req.session.auth === true) {
    return res.redirect("/");
  }
  next();
}

function notAdmin(req, res, next) {
  if (req.session.authUser.role === "admin") {
    req.session.retUrl = req.originalUrl;
    return res.redirect("/");
  }
  next();
}

module.exports = {
  authUser,
  authRole,
  notAuth,
  notAdmin,
  authPremium,
};
