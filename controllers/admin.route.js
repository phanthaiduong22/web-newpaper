const express = require("express");
const router = express.Router();

const moment = require("moment");
const userModel = require("../models/user.model");
const categoryModel = require("../models/category.model");
const { authUser, authRole } = require("../middlewares/auth.mdw");
const paperModel = require("../models/paper.model");
const tagModel = require("../models/tag.model");

router.get("/users", authUser, authRole("admin"), async function (req, res) {
  const users = await userModel.allWithSpecific();
  let categories = await categoryModel.all();

  res.render("vwAdmin/users", {
    users: users.slice(1), // excludes admin
    categories,
    active: { adminUser: true },
  });
});

// authUser, authRole("admin")
router.post("/users", authUser, authRole("admin"), async function (req, res) {
  const role = req.body.role.toLowerCase();
  const userID = req.body.userID;

  await userModel.updateUserRole(userID, role);
  if (role !== "user") {
    await userModel.activePremium(userID, 60 * 60 * 24 * 365 * 1000);
  } else {
    await userModel.activePremium(userID, 0);
  }
  res.redirect("/admin/users");
});

router.post(
  "/users/editor",
  authUser,
  authRole("admin"),
  async function (req, res) {
    let userID = req.body.userID;
    let catID = req.body.category;

    await userModel.updateEditorCategory(userID, catID);

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
  "/papers/publish/:id",
  authUser,
  authRole("admin"),
  async (req, res) => {
    const paperId = req.params.id;
    const paper = await paperModel.findById(paperId);
    if (paper.Status === "Published" || paper.Status === "Rejected")
      return res.redirect("/admin/papers");

    if (
      paper.Status === "Draft" ||
      (new Date().getTime() >= paper.PublishDate.getTime() &&
        paper.Status === "Accepted")
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

router.post(
  "/papers/activepremium/:id",
  authUser,
  authRole("admin"),
  async (req, res) => {
    const paperId = req.params.id;
    await paperModel.activePremium(paperId);
    res.redirect("/admin/papers");
  },
);

module.exports = router;
