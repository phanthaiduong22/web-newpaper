const express = require("express");
const { authUser, authRole } = require("../middlewares/auth.mdw");
const paperModel = require("../models/paper.model");
const tagModel = require("../models/tag.model");

const router = express.Router();

router.get("/", authUser, authRole("admin"), async (req, res) => {
  const tags = await tagModel.all();
  res.render("vwTags/index", { tags, active: { tagManagement: true } });
});

router.get("/edit", authUser, authRole("admin"), async (req, res) => {
  const tagId = req.query.id || 1;
  const tag = await tagModel.findTagById(tagId);

  if (!tag) return res.redirect("/admin/tags");

  res.render("vwTags/edit", { tag });
});

router.post("/patch", authUser, authRole("admin"), async (req, res) => {
  await tagModel.patch(req.body);
  res.redirect("/admin/tags");
});

router.post("/del", authUser, authRole("admin"), async (req, res) => {
  await tagModel.del(req.body.TagId);
  res.redirect("/admin/tags");
});

router.get("/:id", authUser, authRole("admin"), async (req, res) => {
  console.log("here");
  const tagId = req.params.id || 1;
  const papers = await paperModel.findPapersByTag(tagId);
  res.render("vwTags/list", { papers });
});

module.exports = router;
