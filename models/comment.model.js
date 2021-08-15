const db = require("../utils/db");

module.exports = {
  async all() {
    return await db("comment");
  },

  async addComment(comment) {
    return await db("comment").insert(comment);
  },

  async findAllCommentByPaperId(paperId) {
    return await db("comment")
      .select([
        "comment.CommentID",
        "comment.PaperID",
        "comment.UserID",
        "comment.Content",
        "comment.CreatedAt",
        "users.Name",
        "users.Role",
      ])
      .where("PaperID", paperId)
      .join("users", "comment.UserID", "=", "users.UserID")
      .orderBy("CreatedAt", "desc");
  },

  async findGuestCommentsByPaperId(paperId) {
    return await db("comment")
      .where({ PaperID: paperId, UserID: "guest" })
      .orderBy("CreatedAt", "desc");
  },

  async delByPaperId(paperId) {
    return await db("comment").del().where("PaperID", paperId);
  },

  async del(commentId) {
    return await db("comment").where({ CommentID: commentId }).del();
  },
};
