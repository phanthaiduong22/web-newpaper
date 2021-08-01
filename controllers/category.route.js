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
  res.render("vwCategories/add", { active: { categories: true } });
});

router.post("/add", authUser, authRole("admin"), async function (req, res) {
  const new_category = {
    CatName: req.body.txtCatName,
  };

  const result = await categoryModel.add(new_category);
  if (!result)
    return res.render("vwCategories/add", {
      err_message: "This category is used.",
    });
  res.redirect("/admin/categories");
});

router.get("/edit", authUser, authRole("admin"), async function (req, res) {
  const id = req.query.id || 0;
  const category = await categoryModel.findById(id);
  if (category === null) {
    return res.redirect("/admin/categories");
  }

  res.render("vwCategories/edit", {
    active: { categories: true },
    category,
  });
});

router.post("/patch", authUser, authRole("admin"), async function (req, res) {
  await categoryModel.patch(req.body);
  res.redirect("/admin/categories");
});

router.post("/del", authUser, authRole("admin"), async function (req, res) {
  const catId = req.body.CatID;
  const total = await paperModel.countByCatID(catId);
  if (total > 0) {
    return res.render("vwCategories/edit", {
      err_message: `Please delete all papers of this category before delete.`,
    });
  }
  await categoryModel.del(req.body.CatID);
  res.redirect("/admin/categories");
});

router.get(
  "/:id/addSubCategory",
  authUser,
  authRole("admin"),
  async function (req, res) {
    res.render("vwCategories/addSubCat", { active: { categories: true } });
  },
);

router.post(
  "/:id/addSubCategory",
  authUser,
  authRole("admin"),
  async function (req, res) {
    const subCatName = req.body.SubCatName;
    const catId = req.params.id;

    const result = await categoryModel.addSubCat(subCatName, catId);
    if (!result)
      return res.render("vwCategories/addSubCat", {
        err_message: "This sub category is used.",
      });

    res.redirect(`/admin/categories/${catId}/subCategories`);
  },
);

router.get(
  "/:id/subCategories",
  authUser,
  authRole("admin"),
  async (req, res) => {
    const catId = req.params.id;
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
    await categoryModel.patchSubCat(subCatId, req.body.SubCatName);
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
    if (total > 0) {
      return res.render("vwCategories/editSubCat", {
        err_message: `Please delete all papers of sub category: ${subCatName} before delete this sub category`,
      });
    }
    await categoryModel.delSubCat(catId, subCatId);
    res.redirect(`/admin/categories/${catId}/subCategories`);
  },
);

module.exports = router;
