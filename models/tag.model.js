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

  async del(tag) {
    const papers = await db("papers").where(
      "Tags",
      "like",
      `%${tag.oldTagName}%`,
    );
    for (let paper of papers) {
      const tags = JSON.parse(paper.Tags);
      const index = tags.findIndex((t) => t.value === tag.oldTagName);
      tags.splice(index, 1);
      paper.Tags = JSON.stringify(tags);

      await db("papers")
        .where("PaperID", paper.PaperID)
        .update({ Tags: paper.Tags });
    }
    const id = +tag.TagId;
    delete tag.TagId;

    return await db("tag").where("TagId", id).del();
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
