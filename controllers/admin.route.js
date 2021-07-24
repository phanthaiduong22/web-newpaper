const express = require("express");
const router = express.Router();

const moment = require("moment");
const userModel = require("../models/user.model");
const categoryModel = require("../models/category.model");
const { authUser, authRole } = require("../middlewares/auth.mdw");
const { route } = require("./editor.route");

router.get("/users", authUser, authRole("admin"), async function (req, res) {
  const users = await userModel.allWithSpecific();
  let categories = await categoryModel.all();
  for (let i = 0; i < users.length; i += 1) {
    users[i].DateOfBirth = moment(users[i].Dob).format("DD/MM/YYYY");
  }
  res.render("vwAdmin/users", {
    users: users.slice(1), // excludes admin
    categories,
    active: { adminUser: true },
  });
});

// authUser, authRole("admin")
router.post("/users", authUser, authRole("admin"), async function (req, res) {
  let role = req.body.role.toLowerCase();
  let userID = req.body.userID;

  await userModel.updateUserRole(userID, role);

  res.redirect("/admin/users");
});

router.post(
  "/users/editor",
  authUser,
  authRole("admin"),
  async function (req, res) {
    let userID = req.body.userID;
    let catID = req.body.category;

    await userModel.upsertEditorCategory(userID, catID);

    res.redirect("/admin/users");
  },
);

router.get("/papers", async (req, res) => {
  res.render("vwAdmin/papers", { active: { paperManagement: true } });
});

router.post("/users/del", async (req, res) => {
  const userId = req.body.userId;
  await userModel.del(userId);
  res.redirect("/admin/users");
});

module.exports = router;
