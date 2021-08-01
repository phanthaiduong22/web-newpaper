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
    return db("category_sub_categories")
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

  async getCatbySubCatID(SubCatID) {
    return db("category_sub_categories")
      .select("CatID")
      .where("SubCatID", SubCatID);
  },

  async add(category) {
    return db("categories").insert(category);
  },

  async findById(id) {
    const rows = await db("categories").where("CatID", id);
    if (rows.length === 0) return null;

    return rows[0];
  },

  async patch(category) {
    const id = category.CatID;
    delete category.CatID;

    return db("categories").where("CatID", id).update(category);
  },

  async del(id) {
    return db("categories").where("CatID", id).del();
  },

  async findCatByEditorId(editorId) {
    return await db("category_editors")
      .select("CatID")
      .where("EditorID", editorId);
  },

  async addSubCat(subCatName, catId) {
    const subCat = await db("sub_categories").insert({
      SubCatName: subCatName,
    });
    await db("category_sub_categories").insert({
      CatID: catId,
      SubCatID: subCat[0],
    });
  },
};
