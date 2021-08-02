require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");

const commentModel = require("../models/comment.model");
const paperModel = require("../models/paper.model");
const categoryModel = require("../models/category.model");
const moment = require("moment");
const puppeteer = require("puppeteer");
const { authUser, authPremium } = require("../middlewares/auth.mdw");

const DOMAIN = process.env.DOMAIN;

const router = express.Router();

router.get("/byCat/:id", async function (req, res) {
  const catId = +req.params.id || 0;

  for (c of res.locals.lcCategories) {
    if (c.CatID === catId) {
      c.IsActive = true;
      break;
    }
  }

  const limit = 3;
  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await paperModel.countByCatID(catId);
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
  const list = await paperModel.findByCatID(catId, limit, offset);
  const raw_data = await categoryModel.allWithDetails();
  const categories = raw_data[0];
  const subcategories = await categoryModel.getSubCategories();

  for (let i = 0; i < categories.length; i++) {
    categories[i].SubCategory = [];
    for (let j = 0; j < subcategories.length; j++) {
      if (categories[i].CatID == subcategories[j].CatID) {
        let obj = {
          SubCatName: subcategories[j].SubCatName,
          SubCatID: subcategories[j].SubCatID,
        };
        categories[i].SubCategory.push(obj);
      }
    }
  }

  for (let i of list) {
    i.PublishDate = moment(i.PublishDate).format("Do MMMM YYYY");
  }

  res.render("vwPapers/byCat", {
    papers: list,
    categories: categories,
    empty: list.length === 0,
    page_numbers,
    layout: "categories.hbs",
    active: { categories: true },
    CatActive: catId,
    SubCatActive: 0,
  });
});

router.get("/details/:id", async function (req, res) {
  const paperId = +req.params.id || 0;
  const paper = await paperModel.findById(paperId);
  if (!paper) res.redirect("/");

  if (paper.Premium) {
    if (!req.session.authUser || !req.session.authUser.Premium) {
      return res.render("vwPapers/details", {
        err_message: "This paper is premium!",
      });
    }
  }
  const relatedNews = await paperModel.findByCatID(paper.CatID);

  paperModel.increaseView(paperId, paper.Views);
  paper.CreatedAt = moment(paper.CreatedAt).format("Do MMMM YYYY");
  paper.PublishDate = moment(paper.PublishDate).format("Do MMMM YYYY");
  for (i = 0; i < relatedNews.length; i++) {
    relatedNews[i].CreatedAt = moment(relatedNews[i].CreatedAt).format(
      "Do MMMM YYYY",
    );
    relatedNews[i].PublishDate = moment(relatedNews[i].PublishDate).format(
      "Do MMMM YYYY",
    );
  }

  const comments = await commentModel.findAllCommentByPaperId(paperId);
  for (i = 0; i < comments.length; i++) {
    comments[i].CreatedAt = moment(comments[i].CreatedAt).format(
      "Do MMMM YYYY",
    );
  }
  res.render("vwPapers/details", {
    paper,
    relatedNews,
    comments,
  });
});

router.get("/bySubCat/:subcatid", async function (req, res) {
  const subCatId = +req.params.subcatid || 0;
  const cat = await categoryModel.getCatbySubCatID(subCatId);
  const limit = 3;
  const page = req.query.page || 1;
  if (page < 1) page = 1;
  const total = await paperModel.countByCatID(cat[0].CatID);
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
  const list = await paperModel.findBySubCatID(subCatId, limit, offset);
  const raw_data = await categoryModel.allWithDetails();
  const categories = raw_data[0];
  const subcategories = await categoryModel.getSubCategories();

  for (let i = 0; i < categories.length; i++) {
    categories[i].SubCategory = [];
    for (let j = 0; j < subcategories.length; j++) {
      if (categories[i].CatID == subcategories[j].CatID) {
        let obj = {
          SubCatName: subcategories[j].SubCatName,
          SubCatID: subcategories[j].SubCatID,
        };
        categories[i].SubCategory.push(obj);
      }
    }
  }

  for (let i of list) {
    i.PublishDate = moment(i.PublishDate).format("Do MMMM YYYY");
  }

  res.render("vwPapers/byCat", {
    papers: list,
    categories: categories,
    empty: list.length === 0,
    page_numbers,
    layout: "categories.hbs",
    active: { categories: true },
    CatActive: cat[0].CatID,
    SubCatActive: subCatId,
  });
});

router.get(
  "/details/:id/premium",
  authUser,
  authPremium,
  async function (req, res) {
    const paperId = +req.params.id || 0;
    let paper = await paperModel.findById(paperId);
    if (!paper) {
      return res.redirect("/");
    }

    paperModel.increaseView(paperId, paper.Views);
    paper.PublishDate = moment(paper.PublishDate).format("Do MMMM YYYY");

    res.render("vwPapers/premium", { paper });
  },
);

router.get(
  "/details/:id/download",
  authUser,
  authPremium,
  async function (req, res) {
    const paperId = +req.params.id || 0;
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox"],
    });

    const url = `http://${DOMAIN}/papers/details/${paperId}/premium`;
    const page = await browser.newPage();
    await page.setCookie({
      name: "connect.sid",
      value: req.cookies["connect.sid"],
      url,
    });

    const filePath = path.join(__dirname, "..", `pdf/test-${paperId}.pdf`);
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.pdf({ path: filePath, format: "a4" });
    await browser.close();

    res.download(filePath);
  },
);

router.post("/details/:id/comment", authUser, async function (req, res) {
  const { content } = req.body;
  const userId = req.session.authUser.UserID;
  const paperId = +req.params.id || 0;
  const comment = {
    PaperID: paperId,
    UserID: userId,
    Content: content,
    CreatedAt: new Date(),
  };
  await commentModel.addComment(comment);
  res.redirect(`/papers/details/${paperId}`);
});

module.exports = router;
