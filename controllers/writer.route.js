const express = require("express");
const multer = require("multer");
const moment = require("moment");
const paperModel = require("../models/paper.model");
const categoryModel = require("../models/category.model");
// const fs = require("fs");

const router = express.Router();

//role editor
router.get("/management", async function (req, res) {
  let userID = 0;
  if (req.session.authUser) userID = req.session.authUser.UserID;
  else res.redirect("/");
  const papers = await paperModel.writerFindByUserId(userID);
  for (i = 0; i < papers.length; i++) {
    papers[i].CreatedAt = moment(papers[i].CreatedAt).format("Do MMMM YYYY");
  }
  res.render("vwWriter/management", {
    papers: papers,
  });
});

router.get("/upload", async function (req, res) {
  const sub_categories = await categoryModel.getSubCategories();

  res.render("vwWriter/upload", {
    sub_categories,
    active: { upload: true },
    empty: sub_categories.length === 0,
  });
});

router.post("/upload", async function (req, res) {
  const number = (await paperModel.size()) + 1;

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./public/imgs");
    },
    filename(req, file, cb) {
      cb(null, number + ".png");
    },
  });
  const upload = multer({
    storage,
  });

  upload.single("avatar")(req, res, async function (err) {
    if (err) {
      console.log(err);
    } else {
      const Cat = await categoryModel.getCatbySubCatID(req.body.sub_categories);
      const newPaper = {
        Title: req.body.title,
        Abstract: req.body.abstract,
        Content: req.body.content,
        CatID: Cat[0].CatID,
        SubCatID: req.body.sub_categories,
        Avatar: number + ".png",
        Tags: req.body.tags,
        UserID: req.body.userID,
      };

      paperModel.add(newPaper);
      res.redirect("/writer/upload");
    }
  });
});

module.exports = router;
