const express = require("express");
const multer = require("multer");
const paperModel = require("../models/paper.model");
const categoryModel = require("../models/category.model");

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
  console.log(list);
  res.render("vwDemo/upload", {
    categories: list,
    empty: list.length === 0,
  });
});

router.post("/upload", function (req, res) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./public/imgs");
    },
    filename(req, file, cb) {
      cb(null, file.originalname);
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
        Avatar: req.file.filename,
      };
      //todo: tags
      paperModel.add(newPaper);
      res.render("vwDemo/upload");
    }
  });
});

module.exports = router;
