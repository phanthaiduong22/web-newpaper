const express = require("express");
const categoryModel = require("../models/category.model");

const router = express.Router();

router.get("/", async function (req, res) {
  const categories = await categoryModel.all();

  res.render("vwCategories/index", {
    categories: categories,
    empty: list.length === 0,
  });
});

router.get("/add", function (req, res) {
  res.render("vwCategories/add");
});

router.post("/add", async function (req, res) {
  const new_category = {
    CatName: req.body.txtCatName,
  };

  await categoryModel.add(new_category);
  res.render("vwCategories/add");
});

router.get("/edit", async function (req, res) {
  const id = req.query.id || 0;
  const category = await categoryModel.findById(id);
  if (category === null) {
    return res.redirect("/admin/categories");
  }

  res.render("vwCategories/edit", {
    category,
  });
});

router.post("/patch", async function (req, res) {
  await categoryModel.patch(req.body);
  res.redirect("/admin/categories");
});

router.post("/del", async function (req, res) {
  await categoryModel.del(req.body.CatID);
  res.redirect("/admin/categories");
});

module.exports = router;
