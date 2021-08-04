const express = require("express");
const { authUser, authRole } = require("../middlewares/auth.mdw");
const categoryModel = require("../models/category.model");
const paperModel = require("../models/paper.model");

const router = express.Router();

router.get("/", authUser, authRole("admin"), async function (req, res) {
  const categories = await categoryModel.all();

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

  res.render("vwCategories/index", {
    categories: categories,
    empty: categories.length === 0,
    active: { categories: true },
  });
});

router.get("/add", authUser, authRole("admin"), function (req, res) {
  const err_message = req.query.err_message;
  res.render("vwCategories/add", { err_message, active: { categories: true } });
});

router.post("/add", authUser, authRole("admin"), async function (req, res) {
  const new_category = {
    CatName: req.body.txtCatName,
  };
  try {
    const result = await categoryModel.add(new_category);
    res.redirect("/admin/categories");
  } catch (err) {
    const err_message = encodeURIComponent("This category name is used.");
    return res.redirect(`/admin/categories/add?err_message=${err_message}`);
  }
});

router.get("/edit", authUser, authRole("admin"), async function (req, res) {
  const err_message = req.query.err_message;
  console.log(err_message);
  const id = req.query.id || 0;
  const category = await categoryModel.findById(id);
  if (category === null) {
    return res.redirect("/admin/categories");
  }

  res.render("vwCategories/edit", {
    active: { categories: true },
    category,
    err_message,
  });
});

router.post("/patch", authUser, authRole("admin"), async function (req, res) {
  const catId = +req.body.CatID;
  try {
    await categoryModel.patch(req.body);
    res.redirect("/admin/categories");
  } catch (err) {
    const err_message = encodeURIComponent("This category name is used.");
    return res.redirect(
      `/admin/categories/edit?id=${catId}&err_message=${err_message}`,
    );
  }
});

router.post("/del", authUser, authRole("admin"), async function (req, res) {
  const catId = +req.body.CatID;
  const total = await paperModel.countByCatID(catId);
  if (total > 0) {
    const err_message = encodeURIComponent(
      "Please delete all papers of this category before delete.",
    );
    return res.redirect(
      `/admin/categories/edit?id=${catId}&err_message=${err_message}`,
    );
  }
  const editors = await categoryModel.findEditorsByCatId(catId);
  if (editors.length > 0) {
    const err_message = encodeURIComponent(
      "There are some editors responsible for this category, please change specification before delete.",
    );
    return res.redirect(
      `/admin/categories/edit?id=${catId}&err_message=${err_message}`,
    );
  }
  await categoryModel.del(catId);
  res.redirect("/admin/categories");
});

router.get(
  "/:id/addSubCategory",
  authUser,
  authRole("admin"),
  async function (req, res) {
    const err_message = req.query.err_message;
    res.render("vwCategories/addSubCat", {
      err_message,
      active: { categories: true },
    });
  },
);

router.post(
  "/:id/addSubCategory",
  authUser,
  authRole("admin"),
  async function (req, res, next) {
    const subCatName = req.body.SubCatName;
    const catId = +req.params.id;

    try {
      const result = await categoryModel.addSubCat(subCatName, catId);

      res.redirect(`/admin/categories/${catId}/subCategories`);
    } catch (err) {
      const err_message = encodeURIComponent("This Sub Cat name is used.");
      res.redirect(
        `/admin/categories/${catId}/addSubCategory?err_message=${err_message}`,
      );
    }
  },
);

router.get(
  "/:id/subCategories",
  authUser,
  authRole("admin"),
  async (req, res) => {
    const catId = +req.params.id;
    const subCategories = await categoryModel.getSubCategoriesByCatId(catId);
    res.render("vwCategories/editSubCat", { subCategories });
  },
);

router.post(
  "/:id/subCategories/:subCatId/patch",
  authUser,
  authRole("admin"),
  async (req, res) => {
    const catId = +req.params.id;
    const subCatId = +req.params.subCatId;
    const subCatName = req.body.SubCatName;
    await categoryModel.patchSubCat(subCatId, subCatName);
    res.redirect(`/admin/categories/${catId}/subCategories`);
  },
);

router.post(
  "/:id/subCategories/:subCatId/del",
  authUser,
  authRole("admin"),
  async (req, res) => {
    const catId = +req.params.id;
    const subCatId = +req.params.subCatId;
    const subCatName = req.body.SubCatName;
    const total = await paperModel.countBySubCatID(subCatId);
    const subCategories = await categoryModel.getSubCategoriesByCatId(catId);
    if (total > 0) {
      return res.render("vwCategories/editSubCat", {
        subCategories,
        err_message: `Please delete all papers of sub category: ${subCatName} before delete this sub category`,
      });
    }
    await categoryModel.delSubCat(catId, subCatId);
    res.redirect(`/admin/categories/${catId}/subCategories`);
  },
);

module.exports = router;
