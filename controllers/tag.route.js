const express = require("express");
const { authUser, authRole } = require("../middlewares/auth.mdw");
const paperModel = require("../models/paper.model");
const tagModel = require("../models/tag.model");
const moment = require("moment");
const router = express.Router();

router.get("/", async (req, res) => {
  let tagId = req.query.id;
  const tagName = req.query.name;
  if (!tagId && !tagName) {
    const tags = await tagModel.all();
    res.render("vwTags/index", { tags, active: { tagManagement: true } });
  }
  const page = +req.query.page || 1;
  if (page < 1) page = 1;

  if (tagName) {
    const tag = await tagModel.findTagIdByTagName(decodeURIComponent(tagName));
    tagId = tag.TagId;
  }

  const limit = 3;
  const total = await paperModel.countByTagId(tagId);
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrent: i === +page,
    });
  }

  const offset = (page - 1) * limit;
  const papers = await paperModel.findPapersByTagId(tagId, limit, offset);

  for (let i of papers) {
    i.PublishDate = moment(i.PublishDate).format("Do MMMM YYYY");
  }
  res.render("vwTags/list", {
    papers,
    page_numbers,
    empty: papers.length === 0,
  });
});

router.get("/add", authUser, authRole("admin"), async (req, res) => {
  res.render("vwTags/add");
});

router.post("/add", authUser, authRole("admin"), async (req, res) => {
  const tagName = req.body.txtTagName;
  await tagModel.addTag({ TagName: tagName });
  res.redirect("/tags");
});

router.get("/edit", authUser, authRole("admin"), async (req, res) => {
  const tagId = +req.query.id || 1;
  const tag = await tagModel.findTagById(tagId);

  if (!tag) return res.redirect("/tags");

  res.render("vwTags/edit", { tag });
});

router.post("/patch", authUser, authRole("admin"), async (req, res) => {
  await tagModel.patch(req.body);
  res.redirect("/tags");
});

router.post("/del", authUser, authRole("admin"), async (req, res) => {
  await tagModel.del(req.body.TagId);
  res.redirect("/tags");
});

module.exports = router;
