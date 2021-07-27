const express = require("express");
const multer = require("multer");
const moment = require("moment");
const paperModel = require("../models/paper.model");
const categoryModel = require("../models/category.model");
const { authUser, authRole } = require("../middlewares/auth.mdw");

// const fs = require("fs");

const router = express.Router();

//role editor

router.get(
  "/management",
  authUser,
  authRole("writer"),
  async function (req, res) {
    const userId = req.session.authUser.UserID;
    const papers = await paperModel.writerFindByUserId(userId);
    for (i = 0; i < papers.length; i++) {
      if (papers[i].PublishDate !== null)
        papers[i].PublishDate = moment(papers[i].PublishDate).format(
          "Do MMMM YYYY",
        );
    }
    res.render("vwWriter/management", {
      papers: papers,
      active: { writer: true },
    });
  },
);

router.get(
  "/management/paper/:id",
  authUser,
  authRole("writer"),
  async function (req, res) {
    const paperId = +req.params.id || 0;

    const paper = await paperModel.findById(paperId);
    if (
      (paper.Status === "Accepted" || paper.Status === "Published") &&
      req.session.authUser.Role !== "admin"
    )
      return res.redirect(`/writer/management/`);
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

    res.render("vwWriter/managementPaperId", {
      paper: paper,
      sub_categories,
    });
  },
);

router.post(
  "/management/paper/:id",
  authUser,
  authRole("writer"),
  async function (req, res) {
    const paperId = +req.params.id || 0;

    const paper = await paperModel.findById(paperId);
    if (
      (paper.Status === "Accepted" || paper.Status === "Published") &&
      req.session.authUser.Role !== "admin"
    )
      return res.redirect(`/writer/management/`);

    const storage = multer.diskStorage({
      destination(req, file, cb) {
        cb(null, "./public/imgs");
      },
      filename(req, file, cb) {
        cb(null, paperId + ".png");
      },
    });
    const upload = multer({
      storage,
    });

    upload.single("avatar")(req, res, async function (err) {
      if (err) {
        console.log(err);
      } else {
        const Cat = await categoryModel.getCatbySubCatID(
          req.body.sub_categories,
        );
        const updatedPaper = {
          Title: req.body.title,
          Abstract: req.body.abstract,
          Content: req.body.content,
          CatID: Cat[0].CatID,
          SubCatID: req.body.sub_categories,
          Tags: req.body.tags,
          Avatar: paperId + ".png",
        };

        await paperModel.update(paperId, updatedPaper);
        res.redirect(`/writer/management/paper/${paperId}`);
      }
    });
  },
);

router.get("/upload", authUser, authRole("writer"), async function (req, res) {
  const sub_categories = await categoryModel.getSubCategories();

  res.render("vwWriter/upload", {
    sub_categories,
    active: { upload: true },
    empty: sub_categories.length === 0,
  });
});

router.post("/upload", authUser, authRole("writer"), async function (req, res) {
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

      await paperModel.add(newPaper);
      res.redirect("/writer/management");
    }
  });
});

module.exports = router;
