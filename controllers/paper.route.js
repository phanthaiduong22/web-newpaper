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
    catId,
    papers: list,
    categories: categories,
    empty: list.length === 0,
    page_numbers,
    layout: "categories.hbs",
    active: { categories: true },
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

router.get("/byCat/:id/bySubCat/:subcatid", async function (req, res) {
  const catId = +req.params.id || 0;
  const subCatId = +req.params.subcatid || 0;

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
    catId,
    papers: list,
    categories: categories,
    empty: list.length === 0,
    page_numbers,
    layout: "categories.hbs",
    active: { categories: true },
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
