const express = require("express");
const { authUser, authRole } = require("../middlewares/auth.mdw");
const paperModel = require("../models/paper.model");
const tagModel = require("../models/tag.model");
const moment = require("moment");
const router = express.Router();

const { sortHelper } = require("../helpers/sort");

router.get("/", async (req, res) => {
  if (req.query.hasOwnProperty("name")) {
    const tagName = req.query.name;
    const tag = await tagModel.findTagIdByTagName(tagName);
    return res.redirect(`/tags/find/${tag.TagId}`);
  }
  const tags = await tagModel.all().then(sortHelper(req));
  // for (let tag of tags) {
  //   tag.count = await tagModel.countPaperByTagName(tag.TagName);
  // }
  res.render("vwTags/index", { tags, active: { tagManagement: true } });
});

router.get("/find/:id", async (req, res) => {
  let tagId = +req.params.id;
  const page = +req.query.page || 1;
  if (page < 1) page = 1;
  const limit = 3;
  const tag = await tagModel.findTagById(tagId);
  if (!tag) {
    return res.redirect("/tags");
  }
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
    previous_page: page > 1 ? page - 1 : undefined,
    next_page: page < page_numbers.length ? page + 1 : undefined,
    empty: papers.length === 0,
  });
});

router.get("/add", authUser, authRole("admin"), async (req, res) => {
  res.render("vwTags/add", { active: { tagManagement: true } });
});

router.post("/add", authUser, authRole("admin"), async (req, res) => {
  const tagName = req.body.txtTagName;
  const result = await tagModel.addTag({ TagName: tagName });
  if (!result)
    return res.render("vwTags/add", { err_message: "This tag is used." });
  res.redirect("/tags");
});

router.get("/edit", authUser, authRole("admin"), async (req, res) => {
  const tagId = +req.query.id || 1;
  const tag = await tagModel.findTagById(tagId);

  if (!tag) return res.redirect("/tags");

  res.render("vwTags/edit", { tag, active: { tagManagement: true } });
});

router.post("/patch", authUser, authRole("admin"), async (req, res) => {
  await tagModel.patch(req.body);
  res.redirect("/tags");
});

router.post("/del", authUser, authRole("admin"), async (req, res) => {
  await tagModel.del(req.body);
  res.redirect("/tags");
});

module.exports = router;
