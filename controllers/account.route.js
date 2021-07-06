const express = require("express");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const userModel = require("../models/user.model");
const auth = require("../middlewares/auth.mdw");

const router = express.Router();

router.get("/profile", auth, function (req, res) {
  res.render("vwAccount/profile");
});

router.get("/register", function (req, res) {
  res.render("vwAccount/register", {
    active: { login: true },
  });
});

router.post("/register", async function (req, res) {
  const hash = bcrypt.hashSync(req.body.raw_password, 10);
  const dob = moment(req.body.raw_dob, "DD/MM/YYYY").format("YYYY-MM-DD");
  const user = {
    email: req.body.email,
    username: req.body.username,
    password: hash,
    dob: dob,
    name: req.body.name,
  };

  await userModel.add(user);
  res.render("vwAccount/register", {
    active: { login: true },
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

router.get("/login", async function (req, res) {
  res.render("vwAccount/login", {
    active: { login: true },
  });
});

router.post("/login", async function (req, res) {
  const user = await userModel.findByUsername(req.body.username);
  if (user === null) {
    return res.render("vwAccount/login", {
      err_message: "Invalid username!",
    });
  }

  const ret = bcrypt.compareSync(req.body.password, user.password);
  if (ret === false) {
    return res.render("vwAccount/login", {
      layout: false,
      err_message: "Invalid password!",
    });
  }

  delete user.password;
  req.session.auth = true;
  req.session.authUser = user;
  console.log("hello");

  const url = req.session.retUrl || "/";
  res.redirect(url);
});

router.post("/logout", auth, async function (req, res) {
  req.session.auth = false;
  req.session.authUser = null;
  req.session.retUrl = "";

  const url = req.headers.referer || "/";
  res.redirect(url);
});

module.exports = router;
