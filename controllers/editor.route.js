const express = require("express");
const multer = require("multer");
const moment = require("moment");
const paperModel = require("../models/paper.model");
const categoryModel = require("../models/category.model");
// const fs = require("fs");

const router = express.Router();

//role editor
router.get("/management", async function (req, res) {
  if (req.session.authUser) console.log(req.session.authUser.UserID);
  else res.redirect("/");
  const papers = await paperModel.editorFindByCat(1);
  for (i = 0; i < papers.length; i++) {
    papers[i].CreatedAt = moment(papers[i].CreatedAt).format("Do MMMM YYYY");
  }
  res.render("vwEditor/management", {
    papers: papers,
  });
});

router.get("/management/paper/:id", async function (req, res) {
  const paperId = +req.params.id || 0;

  let paper = await paperModel.findById(paperId);
  paper.CreatedAt = moment(paper.CreatedAt).format("L");
  const sub_categories = await categoryModel.getSubCategories();

  for (i = 0; i < sub_categories.length; ++i) {
    if (sub_categories[i].SubCatName == paper.SubCatName) {
      sub_categories.splice(i, 1);
    }
  }

  if (paper === null) {
    return res.redirect("/");
  }

  console.log(paper);

  res.render("vwEditor/managementPaperId", {
    paper: paper,
    sub_categories,
  });
});

router.post("/management/paper/:id", async function (req, res) {
  const paperId = +req.params.id || 0;
  const { accept, reject, editorComment } = req.body;
  if (accept) {
    let { raw_dob, sub_categories, tags } = req.body;
    const dateRelease = moment(raw_dob, "DD/MM/YYYY").format("YYYY-MM-DD");
    await paperModel.editorAcceptPaper(
      paperId,
      dateRelease,
      sub_categories,
      tags,
      editorComment
    );
  } else if (reject) {
    await paperModel.editorRejectPaper(paperId, editorComment);
  }

  res.redirect(`/editor/management/paper/${paperId}`);
});

module.exports = router;
