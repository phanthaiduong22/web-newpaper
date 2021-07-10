const express = require("express");
const router = express.Router();

const userModel = require("../models/user.model");
const categoryModel = require("../models/category.model");
const { authUser, authRole } = require("../middlewares/auth.mdw");

router.get("/users", authUser, authRole("admin"), async function (req, res) {
  let users = await userModel.allWithSpecific();
  let categories = await categoryModel.all();

  res.render("vwAdmin/users", {
    users,
    categories,
    active: { adminUsers: true },
  });
});

// authUser, authRole("admin")
router.post("/users", authUser, authRole("admin"), async function (req, res) {
  let role = req.body.role;
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
  }
);

module.exports = router;
