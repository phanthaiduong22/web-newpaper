const express = require("express");
const multer = require("multer");
const paperModel = require("../models/paper.model");
const categoryModel = require("../models/category.model");
const fs = require("fs");

const router = express.Router();

// router.get("/editor", function (req, res) {
//   res.render("vwDemo/editor");
// });

// router.post("/editor", function (req, res) {
//   console.log(req.body.content);
//   res.render("vwDemo/editor");
// });

router.get("/upload", async function (req, res) {
  const list = await categoryModel.all();
  res.render("vwEditor/upload", {
    categories: list,
    active: { upload: true },
    empty: list.length === 0,
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

  upload.single("avatar")(req, res, function (err) {
    if (err) {
      console.log(err);
    } else {
      const newPaper = {
        Title: req.body.title,
        Abstract: req.body.abstract,
        Content: req.body.content,
        CatID: req.body.categories,
        Avatar: number + ".png",
        Tags: req.body.tags,
      };
      sqlStr = `INSERT INTO papers (Title, Abstract, Content, CatID, Avatar, Tags)
      VALUES ("${newPaper.Title}", "${newPaper.Abstract}", "${newPaper.Content}", ${newPaper.CatID}, "${newPaper.Avatar}", "${newPaper.Tags}");
      `;

      fs.appendFile("message.txt", sqlStr, function (err) {
        if (err) throw err;
      });

      paperModel.add(newPaper);
      res.redirect("/editor/upload");
    }
  });
});

module.exports = router;
