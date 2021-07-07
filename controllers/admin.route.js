const express = require("express");
const router = express.Router();

const userModel = require("../models/user.model");
const { authUser, authRole } = require("../middlewares/auth.mdw");

router.get("/users", authUser, authRole("admin"), async function (req, res) {
  const users = await userModel.all();

  res.render("vwAdmin/users", {
    users: users,
    active: { adminUsers: true },
  });
});

router.post("/users", authUser, authRole("admin"), async function (req, res) {
  let role = req.body.role;
  let userID = req.body.userID;

  await userModel.updateUserRole(userID, role);

  const users = await userModel.all();
  res.render("vwAdmin/users", {
    users: users,
    active: { adminUsers: true },
  });
});

module.exports = router;
