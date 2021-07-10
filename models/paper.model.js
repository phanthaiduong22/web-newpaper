const db = require("../utils/db");
const categoryModel = require("./category.model");

module.exports = {
  all() {
    return db("papers");
  },
  hotNews(limit) {
    return db("papers")
      .select([
        "papers.PaperID",
        "papers.Avatar",
        "papers.Title",
        "papers.Views",
        "papers.CreatedAt",
        "categories.CatName",
      ])
      .join("categories", "papers.PaperID", "=", "categories.catID")
      .orderBy("Views", "desc")
      .limit(limit);
  },

  latestNews(limit) {
    return db("papers")
      .select([
        "papers.PaperID",
        "papers.Avatar",
        "papers.Title",
        "papers.Views",
        "papers.CreatedAt",
        "categories.CatName",
      ])
      .join("categories", "papers.CatID", "=", "categories.CatID")
      .orderBy("CreatedAt", "desc")
      .limit(limit);
  },

  // relatedNews(catId, limit) {
  //   return db("papers")
  //     .select([
  //       "papers.PaperID",
  //       "papers.Avatar",
  //       "papers.Title",
  //       "papers.Views",
  //       "papers.CreatedAt",
  //     ])
  //     .where("CatID", catId)
  //     .limit(limit);
  // },

  async editorFindByCat(catID) {
    return await db("papers")
      .select([
        "papers.PaperID",
        "papers.Title",
        "papers.CreatedAt",
        "papers.Status",
        "papers.Tags",
      ])
      .where("CatID", catID);
  },

  async writerFindByUserId(userID) {
    return await db("papers")
      .select([
        "papers.PaperID",
        "papers.Title",
        "papers.CreatedAt",
        "papers.Status",
        "papers.EditorComment",
      ])
      .where("UserID", userID);
  },

  async editorAcceptPaper(paperID, dateRelease, subCatID, tags, editorComment) {
    cat = await categoryModel.getCatbySubCatID(subCatID);

    await db("papers").where("PaperID", paperID).update({
      CatID: cat.CatID,
      SubCatID: subCatID,
      Tags: tags,
      Status: "Accepted",
      EditorComment: editorComment,
    });

    if (dateRelease != "Invalid date") {
      await db("papers").where("PaperID", paperID).update({
        createdAt: dateRelease,
      });
    }
  },

  async editorRejectPaper(paperID) {
    await db("papers").where("PaperID", paperID).update({
      Status: "Rejected",
      EditorComment: editorComment,
    });
  },

  async findByCatID(catId, offset) {
    return await db("papers").where("CatID", catId).limit(6).offset(offset);
  },

  async findBySubCatID(subCatId, offset) {
    return await db("papers")
      .where("SubCatID", subCatId)
      .limit(6)
      .offset(offset);
  },

  async countByCatID(catId) {
    const rows = await db("papers")
      .where("CatID", catId)
      .count("*", { as: "total" });

    return rows[0].total;
  },

  async add(paper) {
    await db("papers").insert(paper);
  },

  async update(paperID, paper) {
    await db("papers").where("PaperID", paperID).update({
      Title: paper.Title,
      Abstract: paper.Abstract,
      Content: paper.Content,
      CatID: paper.CatID,
      SubCatID: paper.SubCatID,
      Tags: paper.Tags,
    });
  },

  async findById(id) {
    const rows = await db("papers")
      .where("PaperID", id)
      .join("categories", "papers.CatID", "=", "categories.CatID")
      .join(
        "sub_categories",
        "papers.SubCatID",
        "=",
        "sub_categories.SubCatID"
      );
    if (rows.length === 0) return null;
    return rows[0];
  },

  async search(query) {
    //FTS
    const rows = await db.raw(
      `SELECT * FROM papers WHERE MATCH (Title, Content, Abstract) AGAINST ('${query}')`
    );

    return rows[0];
  },

  increaseView(PaperID, views) {
    db("papers")
      .where("PaperID", "=", PaperID)
      .update({
        Views: views + 1,
      })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  },

  patch(paper) {
    const id = paper.ProID;
    delete paper.ProID;

    return db("papers").where("PaperID", id).update(paper);
  },

  async size() {
    const rows = await db("papers").count("*", { as: "total" });
    return rows[0].total;
  },

  del(id) {
    return db("papers").where("PaperID", id).del();
  },
};
