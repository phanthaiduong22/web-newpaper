const express = require("express");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const userModel = require("../models/user.model");
const resetModel = require("../models/reset.model");
const { authUser, notAuth, notAdmin } = require("../middlewares/auth.mdw");

const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.get("/profile", authUser, function (req, res) {
  res.redirect("profile/dashboard");
});

router.get("/profile/dashboard", authUser, function (req, res) {
  res.render("vwAccount/profile", {
    dashboard: true,
    active: { profile: true },
  });
});

router.post("/profile/dashboard", authUser, async function (req, res) {
  const { name, email, dob } = req.body;
  const updatedDob = moment(dob, "DD/MM/YYYY").format("YYYY-MM-DD");
  await userModel.updateProfile(req.session.authUser.UserID, {
    name,
    email,
    dob: updatedDob,
  });
  const user = await userModel.findByEmail(email);
  req.session.authUser = user;
  res.redirect("/account/profile/dashboard");
});

router.post("/profile/dashboard", authUser, function (req, res) {});

router.get("/profile/changepassword", authUser, function (req, res) {
  res.render("vwAccount/profile", {
    changepassword: true,
    active: { profile: true },
  });
});

router.post("/profile/changepassword", authUser, async function (req, res) {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await userModel.findByEmail(req.session.authUser.Email);
  const ret = bcrypt.compareSync(oldPassword, user.Password);
  if (ret === false) {
    return res.render("vwAccount/profile", {
      changePassword: true,
      active: { profile: true },
      err_message: "Incorrect old password!",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.render("vwAccount/profile", {
      changePassword: true,
      active: { profile: true },
      err_message: "Password have to match!",
    });
  }
  const hash = bcrypt.hashSync(newPassword, 10);
  await userModel.changePassword(user.UserID, hash);
  res.render("vwAccount/profile", {
    changepassword: true,
    active: { profile: true },
    err_message: "Your password has changed successfully!",
  });
});

router.get("/register", notAuth, function (req, res) {
  res.render("vwAccount/register", {
    active: { register: true },
  });
});

router.post("/register", notAuth, async function (req, res) {
  const hash = bcrypt.hashSync(req.body.raw_password, 10);
  const dob = moment(req.body.raw_dob, "DD/MM/YYYY").format("YYYY-MM-DD");

  const user = {
    Email: req.body.email,
    Username: req.body.username,
    Password: hash,
    Dob: dob,
    Name: req.body.name,
  };

  await userModel.add(user);
  res.redirect("/account/login");
});

router.get("/is-valid-username", async function (req, res) {
  const username = req.query.username;

  const user = await userModel.findByUsername(username);

  if (user !== null) {
    return res.json(false);
  }

  res.json(true);
});

router.get("/is-valid-email", async function (req, res) {
  const email = req.query.email;

  const user = await userModel.findByEmail(email);

  if (user !== null) {
    return res.json(false);
  }

  res.json(true);
});

router.get("/login", notAuth, async function (req, res) {
  res.render("vwAccount/login", {
    active: { login: true },
  });
});

router.post("/login", notAuth, async function (req, res) {
  if (req.session.auth === true) {
    return res.redirect("/");
  }
  const user = await userModel.findByUsername(req.body.username);
  if (user === null) {
    return res.render("vwAccount/login", {
      err_message: "No account with that username!",
    });
  }

  const ret = bcrypt.compareSync(req.body.password, user.Password);
  if (ret === false) {
    return res.render("vwAccount/login", {
      err_message: "Incorrect password!",
    });
  }

  delete user.Password;
  req.session.auth = true;
  req.session.authUser = user;
  req.session.admin = user.Username === "admin";
  req.session.writer = user.Role === "writer";
  const url = req.session.retUrl || "/";
  res.redirect(url);
});

router.post("/logout", authUser, async function (req, res) {
  req.session.auth = false;
  req.session.authUser = undefined;
  req.session.admin = undefined;
  const url = req.headers.referer || "/";
  res.redirect(url);
});

router.get("/resetpassword", notAuth, async (req, res) => {
  res.render("vwAccount/resetpassword");
});

router.get("/otp", notAuth, async (req, res) => {
  res.render("vwAccount/otp");
});

router.post("/otp/verify", notAuth, async (req, res) => {
  const { email, otp } = req.body;
  const reset = await resetModel.findByEmail(email);
  const timeNow = new Date().getTime();

  if (
    otp == reset.otp &&
    email === reset.email &&
    timeNow - reset.created_at <= reset.expiresin * 1000
  ) {
    return res.render("vwAccount/resetpassword", { email, otp, edit: true });
  }
  res.render("vwAccount/otp", {
    email,
    err_message: "OTP was not match or expired.",
  });
});

router.post("/resetpassword", notAuth, async (req, res) => {
  const email = req.body.email;
  const user = await userModel.findByEmail(email);
  if (!user) {
    return res.render("vwAccount/resetpassword", {
      err_message: "There no account with that email.",
    });
  }

  const otp = Math.floor(Math.random() * 900000) + 100000;
  await sendEmail(email, { otp, expiresIn: 60 * 60 * 3 });
  res.render("vwAccount/otp", {
    email,
    success_message: `An OTP 6-digit code has been sent to ${email}, please check...`,
  });
});

router.post("/resetpassword/change", notAuth, async (req, res) => {
  const { password, otp, email } = req.body;
  const user = await userModel.findByEmail(email);
  const reset = await resetModel.findByEmail(email);
  if (user.Email === email && reset.otp == otp) {
    const hash = bcrypt.hashSync(password, 10);
    userModel.changePassword(user.UserID, hash);
    return res.redirect("/account/login");
  }
  return res.redirect("/");
});

module.exports = router;
