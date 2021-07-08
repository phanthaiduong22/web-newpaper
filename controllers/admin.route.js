const express = require("express");
const router = express.Router();

const userModel = require("../models/user.model");
const categoryModel = require("../models/category.model");
const { authUser, authRole } = require("../middlewares/auth.mdw");

//authUser, authRole("admin")
router.get("/users", async function (req, res) {
  const users = await userModel.allWithSpecific();
  const categories = await categoryModel.all();

  console.log(users)

  res.render("vwAdmin/users", {
    users: users,
    categories: categories,
    active: { adminUsers: true },
  });
});

// authUser, authRole("admin")
router.post("/users", async function (req, res) {
  let role = req.body.role;
  let userID = req.body.userID;

  await userModel.updateUserRole(userID, role);

  res.redirect("/admin/users");
});

router.post("/users/editor", async function (req, res) {
  let userID = req.body.userID;
  let catID = req.body.category;

  await userModel.upsertEditorCategory(userID, catID);

  res.redirect("/admin/users");
});

module.exports = router;
