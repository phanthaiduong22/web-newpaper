const express = require("express");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const userModel = require("../models/user.model");
const resetModel = require("../models/reset.model");
const { authUser, authRole, notAuth } = require("../middlewares/auth.mdw");

const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.get("/profile", authUser, authRole("user"), function (req, res) {
  res.render("vwAccount/profile");
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
  res.render("vwAccount/register", {
    active: { register: true },
  });
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

  const url = req.session.retUrl || "/";
  res.redirect(url);
});

router.post("/logout", authUser, async function (req, res) {
  req.session.auth = false;
  req.session.authUser = null;
  req.session.retUrl = "";

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
  console.log(email, otp);
  const reset = await resetModel.findByEmail(email);
  const timeNow = new Date().getTime();
  console.log(reset, timeNow);

  if (
    otp == reset.otp &&
    email === reset.email &&
    timeNow - reset.created_at <= reset.expiresin * 1000
  ) {
    console.log("otp was correct.");
    return res.render("vwAccount/resetpassword", { email, otp, edit: true });
  }
  console.log("otp was not match or expired.");
  res.render("vwAccount/otp", {
    email,
    err_message: "OTP was not match or expired.",
  });
});

router.post("/resetpassword", notAuth, async (req, res) => {
  const email = req.body.email;
  const otp = Math.floor(Math.random() * 900000) + 100000;
  console.log(email, otp);
  await sendEmail(email, { otp, expiresIn: 60 * 5 });
  res.render("vwAccount/otp", { email });
});

router.post("/resetpassword/change", notAuth, async (req, res) => {
  const { password, otp, email } = req.body;
  console.log(password, otp, email);
  const user = await userModel.findByEmail(email);
  const reset = await resetModel.findByEmail(email);
  console.log(user, reset);
  if (user.Email === email && reset.otp == otp) {
    const hash = bcrypt.hashSync(password, 10);
    userModel.changePassword(user.UserID, hash);
    return res.redirect("/account/login");
  }
  return res.redirect("/");
});

module.exports = router;
