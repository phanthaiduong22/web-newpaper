const express = require("express");
const paperModel = require("../models/paper.model");
const categoryModel = require("../models/category.model");
const moment = require("moment");

const router = express.Router();

router.get("/byCat/:id", async function (req, res) {
  const catId = +req.params.id || 0;

  for (c of res.locals.lcCategories) {
    if (c.CatID === catId) {
      c.IsActive = true;
      break;
    }
  }

  const limit = 6;
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
  const list = await paperModel.findByCatID(catId, offset);
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
  if (paper.Premium && !req.session.authUser.Premium) {
    return res.render("home", { err_message: "This paper is premium!" });
  }
  const relatedNews = await paperModel.findByCatID(paper.CatID);

  paperModel.increaseView(paperId, paper.Views);
  paper.CreatedAt = moment(paper.CreatedAt).format("Do MMMM YYYY");
  for (i = 0; i < relatedNews.length; i++) {
    relatedNews[i].CreatedAt = moment(relatedNews[i].CreatedAt).format(
      "Do MMMM YYYY",
    );
  }

  if (paper === null) {
    return res.redirect("/");
  }

  res.render("vwPapers/details", {
    paper: paper,
    relatedNews,
  });
});

router.get("/bySubCat/:subcatid", async function (req, res) {
  const subCatId = +req.params.subcatid || 0;
  const cat = await categoryModel.getCatbySubCatID(subCatId);
  const limit = 6;
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
  const list = await paperModel.findBySubCatID(subCatId, offset);
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

router.get("/details/:id", async function (req, res) {
  const paperId = +req.params.id || 0;

  let paper = await paperModel.findById(paperId);
  paperModel.increaseView(paperId, paper.Views);
  paper.CreatedAt = moment(paper.CreatedAt).format("Do MMMM YYYY");
  if (paper === null) {
    return res.redirect("/");
  }

  res.render("vwPapers/details", {
    paper: paper,
  });
});

module.exports = router;
