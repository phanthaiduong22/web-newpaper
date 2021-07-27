const express = require("express");
const router = express.Router();

const moment = require("moment");
const userModel = require("../models/user.model");
const categoryModel = require("../models/category.model");
const { authUser, authRole } = require("../middlewares/auth.mdw");
const { route } = require("./editor.route");
const paperModel = require("../models/paper.model");

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

router.get("/papers", authUser, authRole("admin"), async (req, res) => {
  const papers = await paperModel.all();
  for (let i = 0; i < papers.length; i += 1) {
    if (papers[i].PublishDate !== null)
      papers[i].PublishDate = moment(papers[i].PublishDate).format(
        "Do MMMM YYYY",
      );
  }
  res.render("vwAdmin/papers", { papers, active: { paperManagement: true } });
});

router.post("/users/del", authUser, authRole("admin"), async (req, res) => {
  const userId = req.body.userId;
  await userModel.del(userId);
  res.redirect("/admin/users");
});

router.post(
  "/papers/publish",
  authUser,
  authRole("admin"),
  async (req, res) => {
    const { paperId } = req.body;
    const paper = await paperModel.findById(paperId);
    if (
      new Date().getTime() >= paper.PublishDate.getTime() &&
      paper.Status === "Accepted"
    ) {
      await paperModel.publish(paperId);
      return res.redirect("/admin/papers");
    }
    const publishDate = moment(paper.PublishDate).format("Do MMMM YYYY");
    return res.render("vwAdmin/papers", {
      err_message: "Please wait until " + publishDate,
    });
  },
);

router.get(
  "/users/:username",
  authUser,
  authRole("admin"),
  async (req, res) => {
    const username = req.params.username;
    const user = await userModel.findByUsername(username);
    if (user) {
      return res.json({ user });
    } else {
      return res.json({ message: "User not found!" });
    }
  },
);

router.post("/users/edit", authUser, authRole("admin"), async (req, res) => {
  const { userId, name, dob, email } = req.body;
  await userModel.updateProfile(userId, {
    name,
    email,
    dob: moment(dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
  });
  res.redirect("/admin/users");
});
module.exports = router;
