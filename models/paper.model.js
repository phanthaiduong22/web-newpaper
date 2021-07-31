const db = require("../utils/db");
const categoryModel = require("./category.model");
const tagModel = require("../models/tag.model");

module.exports = {
  all() {
    return db("papers");
  },

  async hotNews(limit) {
    return await db("papers")
      .select([
        "papers.PaperID",
        "papers.Abstract",
        "papers.Avatar",
        "papers.Title",
        "papers.Views",
        "papers.CreatedAt",
        "papers.PublishDate",
        "papers.Premium",
        "papers.Status",
        "categories.CatName",
        "categories.CatID",
        "sub_categories.SubCatName",
      ])
      .join("categories", "papers.CatID", "=", "categories.catID")
      .join("sub_categories", "papers.SubCatID", "=", "sub_categories.SubCatID")
      .where({ Status: "Published" })
      .orderBy([{ column: "Views", order: "desc" }])
      .limit(limit);
  },

  async latestNews(limit) {
    return await db("papers")
      .select([
        "papers.PaperID",
        "papers.Avatar",
        "papers.Title",
        "papers.Abstract",
        "papers.Views",
        "papers.CreatedAt",
        "papers.PublishDate",
        "papers.Premium",
        "papers.Status",
        "categories.CatName",
        "categories.CatID",
        "sub_categories.SubCatName",
      ])
      .where("Status", "Published")
      .join("categories", "papers.CatID", "=", "categories.CatID")
      .join("sub_categories", "papers.SubCatID", "=", "sub_categories.SubCatID")
      .orderBy("PublishDate", "desc")
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

  async editorFindByCat(catId) {
    return await db("papers")
      .select([
        "papers.PaperID",
        "papers.Title",
        "papers.CreatedAt",
        "papers.PublishDate",
        "papers.Status",
        "papers.Tags",
        "papers.Premium",
      ])
      .whereRaw(`CatId = ${catId} AND Status = "Draft" OR Status = "Rejected"`);
    // .where({ CatId: catId })
    // .whereNot({ Status: "Accepted" });
  },

  async writerFindByUserId(userID) {
    return await db("papers")
      .select([
        "papers.PaperID",
        "papers.Title",
        "papers.CreatedAt",
        "papers.PublishDate",
        "papers.Status",
        "papers.EditorComment",
        "papers.Premium",
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
        PublishDate: dateRelease,
      });
    }
  },

  async editorRejectPaper(paperID, editorComment) {
    await db("papers").where("PaperID", paperID).update({
      Status: "Rejected",
      EditorComment: editorComment,
    });
  },

  async findByCatID(catId, limit, offset) {
    return await db("papers")
      .where({ "papers.CatID": catId, Status: "Published" })
      .join("categories", "papers.CatID", "=", "categories.CatID")
      .join("sub_categories", "papers.SubCatID", "=", "sub_categories.SubCatID")
      .orderBy("Premium", "desc")
      .limit(limit)
      .offset(offset);
  },

  async findBySubCatID(subCatId, limit, offset) {
    return await db("papers")
      .where({ "papers.SubCatID": subCatId, Status: "Published" })
      .join("categories", "papers.CatID", "=", "categories.CatID")
      .join("sub_categories", "papers.SubCatID", "=", "sub_categories.SubCatID")
      .orderBy("Premium", "desc")
      .limit(limit)
      .offset(offset);
  },

  async countByCatID(catId) {
    const rows = await db("papers")
      .where("CatID", catId)
      .count("*", { as: "total" });

    return rows[0].total;
  },

  async countByTagId(tagId) {
    const tag = await tagModel.findTagById(tagId);
    const pattern = tag.TagName;
    const rows = await db("papers")
      .where("Tags", "like", `%${pattern}%`)
      .count("*", { as: "total" });

    return rows[0].total;
  },

  async add(paper) {
    return await db("papers").insert(paper);
  },

  async update(paperID, paper) {
    return await db("papers").where("PaperID", paperID).update({
      Title: paper.Title,
      Abstract: paper.Abstract,
      Content: paper.Content,
      CatID: paper.CatID,
      SubCatID: paper.SubCatID,
      Tags: paper.Tags,
      Avatar: paper.Avatar,
    });
  },

  async publish(paperId) {
    return await db("papers").where("PaperID", paperId).update({
      Status: "Published",
      PublishDate: new Date(),
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
        "sub_categories.SubCatID",
      );
    if (rows.length === 0) return null;
    return rows[0];
  },

  async search(query) {
    //Full-text search
    const rows = await db.raw(
      `SELECT * FROM papers WHERE MATCH (Title, Content, Abstract) AGAINST ('${query}') ORDER BY Premium DESC`,
    );

    return rows[0];
  },

  async increaseView(PaperID, views) {
    return await db("papers")
      .where("PaperID", "=", PaperID)
      .update({
        Views: views + 1,
      })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  },

  async patch(paper) {
    const id = paper.ProID;
    delete paper.ProID;

    return await db("papers").where("PaperID", id).update(paper);
  },

  async size() {
    const rows = await db("papers").count("*", { as: "total" });
    return rows[0].total;
  },

  async del(id) {
    return await db("papers").where("PaperID", id).del();
  },

  async activePremium(id) {
    return await db("papers").where("PaperID", id).update("Premium", 1);
  },

  async findPapersByTagId(tagId, limit, offset) {
    const tag = await tagModel.findTagById(tagId);
    const pattern = `"value":"${tag.TagName}"`;
    return await db("papers")
      .where("Tags", "like", `%${pattern}%`)
      .andWhere("Status", "Published")
      .join("categories", "papers.CatID", "=", "categories.CatID")
      .join("sub_categories", "papers.SubCatID", "=", "sub_categories.SubCatID")
      .orderBy("Premium", "desc")
      .limit(limit)
      .offset(offset);
  },
};
