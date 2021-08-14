const express = require("express");
const router = express.Router();

const moment = require("moment");
const userModel = require("../models/user.model");
const categoryModel = require("../models/category.model");
const { authUser, authRole } = require("../middlewares/auth.mdw");
const paperModel = require("../models/paper.model");
const tagModel = require("../models/tag.model");
const commentModel = require("../models/comment.model");

const { sortHelper } = require("../helpers/sort");

router.get("/users", authUser, authRole("admin"), async function (req, res) {
  const users = await userModel.allWithSpecific().then(sortHelper(req));
  let categories = await categoryModel.all();

  res.render("vwAdmin/users", {
    users: users.slice(1), // excludes admin
    categories,
    active: { adminUser: true },
  });
});

router.post("/users", authUser, authRole("admin"), async function (req, res) {
  const userId = req.body.userID;
  const user = await userModel.findByUserID(userId);
  const oldRole = user.Role.toLowerCase();
  const updatedRole = req.body.role.toLowerCase();
  await userModel.updateUserRole(userId, oldRole, updatedRole);
  if (updatedRole !== "user") {
    await userModel.activePremium(userId, 60 * 60 * 24 * 365 * 1000);
  } else {
    await userModel.activePremium(userId, 0);
  }
  res.redirect("/admin/users");
});

router.post(
  "/users/editor",
  authUser,
  authRole("admin"),
  async function (req, res) {
    const userID = req.body.userID;
    const catID = req.body.category;
    await userModel.updateEditorCategory(userID, catID);
    res.redirect("/admin/users");
  },
);

router.get("/papers", authUser, authRole("admin"), async (req, res) => {
  const { err_message } = req.query;
  const papers = await paperModel.all().then(sortHelper(req));
  for (let i = 0; i < papers.length; i += 1) {
    if (papers[i].PublishDate !== null)
      papers[i].PublishDate = moment(papers[i].PublishDate).format(
        "Do MMMM YYYY",
      );
  }
  res.render("vwAdmin/papers", {
    err_message,
    papers,
    active: { paperManagement: true },
  });
});

router.post("/users/:id/del", authUser, authRole("admin"), async (req, res) => {
  const userId = +req.params.id;
  await userModel.del(userId);
  res.redirect("/admin/users");
});

router.post(
  "/papers/publish/:id",
  authUser,
  authRole("admin"),
  async (req, res, next) => {
    const paperId = +req.params.id;
    const paper = await paperModel.findById(paperId);
    if (paper.Status === "Published" || paper.Status === "Rejected") {
      const err_message = encodeURIComponent(
        "This paper has been published or rejected.",
      );
      return res.redirect(`/admin/papers?err_message=${err_message}`);
    }

    if (
      paper.Status === "Draft" ||
      (new Date().getTime() >= paper.PublishDate.getTime() &&
        paper.Status === "Accepted")
    ) {
      await paperModel.publish(paperId);
      const tags = JSON.parse(paper.Tags);
      for (let i = 0; i < tags.length; i += 1) {
        try {
          const newTagId = await tagModel.addTag({ TagName: tags[i].value });
        } catch (err) {
          console.log(`${tags[i].value} is present`);
        }
      }
      return res.redirect("/admin/papers");
    }
    const publishDate = moment(paper.PublishDate).format("Do MMMM YYYY");
    const err_message = encodeURIComponent("Please wait until " + publishDate);
    return res.redirect(`/admin/papers?err_message=${err_message}`);
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

router.post(
  "/papers/:id/unmark",
  authUser,
  authRole("admin"),
  async (req, res) => {
    const paperId = req.params.id;
    await paperModel.unmarkPremium(paperId);
    res.redirect("/admin/papers");
  },
);

router.post(
  "/papers/:id/depublish",
  authUser,
  authRole("admin"),
  async (req, res) => {
    const paperId = req.params.id;
    await paperModel.depublish(paperId);
    res.redirect("/admin/papers");
  },
);

router.post(
  "/papers/:id/comment/:commentId/del",
  authUser,
  authRole("admin"),
  async (req, res) => {
    const paperId = +req.params.id;
    const commentId = req.params.commentId;
    await commentModel.del(commentId);
    res.redirect(`/papers/details/${paperId}`);
  },
);

module.exports = router;
