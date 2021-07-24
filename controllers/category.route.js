const express = require("express");
const { authUser, authRole } = require("../middlewares/auth.mdw");
const categoryModel = require("../models/category.model");
const { route } = require("./editor.route");

const router = express.Router();

router.get("/", authUser, authRole("admin"), async function (req, res) {
  const categories = await categoryModel.all();

  res.render("vwCategories/index", {
    categories: categories,
    empty: categories.length === 0,
    active: { categories: true },
  });
});

router.get("/add", authUser, authRole("admin"), function (req, res) {
  res.render("vwCategories/add");
});

router.post("/add", authUser, authRole("admin"), async function (req, res) {
  const new_category = {
    CatName: req.body.txtCatName,
  };

  await categoryModel.add(new_category);
  res.redirect("/admin/categories");
});

router.get("/edit", authUser, authRole("admin"), async function (req, res) {
  const id = req.query.id || 0;
  const category = await categoryModel.findById(id);
  if (category === null) {
    return res.redirect("/admin/categories");
  }

  res.render("vwCategories/edit", {
    category,
  });
});

router.post("/patch", authUser, authRole("admin"), async function (req, res) {
  await categoryModel.patch(req.body);
  res.redirect("/admin/categories");
});

router.post("/del", authUser, authRole("admin"), async function (req, res) {
  await categoryModel.del(req.body.CatID);
  res.redirect("/admin/categories");
});

module.exports = router;
