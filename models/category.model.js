// const list = [
//   { CatID: 1, CatName: 'Laptop' },
//   { CatID: 2, CatName: 'Phone' },
//   { CatID: 3, CatName: 'Quần áo' },
//   { CatID: 4, CatName: 'Giày dép' },
//   { CatID: 5, CatName: 'Trang sức' },
//   { CatID: 6, CatName: 'Khác' },
// ];

const db = require("../utils/db");

module.exports = {
  async all() {
    return await db("categories");
  },

  async allWithDetails() {
    const sql = `
      select c.*, count(p.PaperID) as PaperCount
      from categories c left join papers p on c.CatID = p.CatID
      group by c.CatID, c.CatName
      `;
    return db.raw(sql);
  },

  async getSubCategories() {
    return await db("category_sub_categories")
      .select([
        "categories.CatID",
        "categories.CatName",
        "sub_categories.SubCatID",
        "sub_categories.SubCatName",
      ])
      .join(
        "categories",
        "category_sub_categories.CatID",
        "=",
        "categories.CatID",
      )
      .join(
        "sub_categories",
        "category_sub_categories.SubCatID",
        "=",
        "sub_categories.SubCatID",
      );
  },

  async getSubCategoriesByCatId(catId) {
    return await db("category_sub_categories")
      .select([
        "categories.CatID",
        "categories.CatName",
        "sub_categories.SubCatID",
        "sub_categories.SubCatName",
      ])
      .where("categories.CatID", catId)
      .join(
        "categories",
        "category_sub_categories.CatID",
        "=",
        "categories.CatID",
      )
      .join(
        "sub_categories",
        "category_sub_categories.SubCatID",
        "=",
        "sub_categories.SubCatID",
      );
  },

  async getCatbySubCatID(SubCatID) {
    return await db("category_sub_categories")
      .select("CatID")
      .where("SubCatID", SubCatID);
  },

  async add(category) {
    const subCat = await db("sub_categories").where(
      "SubCatName",
      category.SubCatName,
    );
    if (subCat.length > 0) throw new Error("");

    return await db("categories").insert(category);
  },

  async findById(id) {
    const rows = await db("categories").where("CatID", id);
    if (rows.length === 0) return null;

    return rows[0];
  },

  async patch(category) {
    const subCat = await db("sub_categories").where(
      "SubCatName",
      category.CatName,
    );
    if (subCat.length > 0) throw new Error("");

    const id = category.CatID;
    delete category.CatID;

    return await db("categories").where("CatID", id).update(category);
  },

  async patchSubCat(subCatId, subCatName) {
    const cat = await db("categories").where("CatName", subCatName);
    if (cat.length > 0) throw new Error("");

    return await db("sub_categories")
      .where("SubCatID", subCatId)
      .update("SubCatName", subCatName);
  },

  async del(id) {
    const rows = await db("category_sub_categories").where("CatID", id);
    for (let row of rows) {
      await this.delSubCat(row.CatID, row.SubCatID);
    }
    return await db("categories").where("CatID", id).del();
  },

  async delSubCat(catId, subCatId) {
    await db("category_sub_categories")
      .where({ CatID: catId, SubCatID: subCatId })
      .del();
    return await db("sub_categories").where("SubCatID", subCatId).del();
  },

  async findCatByEditorId(editorId) {
    return await db("category_editors")
      .select("CatID")
      .where("EditorID", editorId);
  },

  async addSubCat(subCatName, catId) {
    const cat = await db("categories").where("CatName", subCatName);
    if (cat.length > 0) throw new Error("");

    const subCat = await db("sub_categories").insert({
      SubCatName: subCatName,
    });

    return await db("category_sub_categories").insert({
      CatID: catId,
      SubCatID: subCat[0],
    });
  },

  async findEditorsByCatId(catId) {
    return await db("category_editors").where("CatID", catId);
  },
};
