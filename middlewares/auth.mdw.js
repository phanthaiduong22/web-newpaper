function authUser(req, res, next) {
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect("/account/login");
  }

  next();
}

function authRole(role) {
  return (req, res, next) => {
    if (req.session.authUser.role !== role) {
      req.session.retUrl = req.originalUrl;
      return res.redirect("/");
    }

    next();
  };
}

module.exports = {
  authUser,
  authRole,
};
