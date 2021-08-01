const db = require("../utils/db");

module.exports = {
  async all() {
    return await db("tag");
  },

  async addTag(tag) {
    tag.TagName = tag.TagName.toLowerCase();
    return await db("tag").insert(tag);
  },

  async findTagIdByTagName(tagName) {
    const rows = await db("tag").where("TagName", tagName);
    if (rows.length === 0) return null;

    return rows[0];
  },

  async findTagById(tagId) {
    const rows = await db("tag").where("TagId", tagId);
    if (rows.length === 0) return null;

    return rows[0];
  },

  async patch(tag) {
    const papers = await db("papers").where(
      "Tags",
      "like",
      `%${tag.oldTagName}%`,
    );
    for (let paper of papers) {
      paper.Tags = paper.Tags.replace(tag.oldTagName, tag.TagName);
      console.log(paper.Tags);
      await db("papers")
        .where("PaperID", paper.PaperID)
        .update({ Tags: paper.Tags });
    }

    const id = +tag.TagId;
    delete tag.TagId;
    return await db("tag")
      .where({ TagId: id })
      .update({ TagName: tag.TagName });
  },

  async del(tagId) {
    return await db("tag").where("TagId", tagId).del();
  },

  // async findAllCommentByPaperId(paperId) {
  //   return await db("comment")
  //     .select([
  //       "comment.PaperID",
  //       "comment.UserID",
  //       "comment.Content",
  //       "comment.CreatedAt",
  //       "users.Name",
  //     ])
  //     .where("PaperID", paperId)
  //     .join("users", "comment.UserID", "=", "users.UserID")
  //     .orderBy("CreatedAt", "desc");
  // },
};
