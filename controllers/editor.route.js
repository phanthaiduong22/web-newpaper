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

// router.post("/editor", function (req, res) {
//   res.render("vwEditor/management");
// });

router.get("/management/paper/:id", async function (req, res) {
  const paperId = +req.params.id || 0;

  let paper = await paperModel.findById(paperId);
  paper.CreatedAt = moment(paper.CreatedAt).format("Do MMMM YYYY");

  if (paper === null) {
    return res.redirect("/");
  }

  res.render("vwEditor/managementPaperId", {
    paper: paper,
  });
});

router.get("/upload", async function (req, res) {
  // const raw_data = await categoryModel.allWithDetails();
  // const categories = raw_data[0];
  const sub_categories = await categoryModel.getSubCategories();

  // for (let i = 0; i < categories.length; i++) {
  //   categories[i].SubCategory = [];
  //   for (let j = 0; j < subcategories.length; j++) {
  //     if (categories[i].CatID == subcategories[j].CatID) {
  //       let obj = {
  //         SubCatName: subcategories[j].SubCatName,
  //         SubCatID: subcategories[j].SubCatID,
  //       };
  //       categories[i].SubCategory.push(obj);
  //     }
  //   }
  // }

  res.render("vwEditor/upload", {
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
      };

      paperModel.add(newPaper);
      res.redirect("/editor/upload");
    }
  });
});

module.exports = router;
