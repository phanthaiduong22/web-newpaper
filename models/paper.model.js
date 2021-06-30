const db = require("../utils/db");

module.exports = {
  all() {
    return db("papers");
  },

  findByCatID(catId, offset) {
    return db("papers").where("CatID", catId).limit(6).offset(offset);
  },

  async countByCatID(catId) {
    const rows = await db("papers")
      .where("CatID", catId)
      .count("*", { as: "total" });

    return rows[0].total;
  },

  add(paper) {
    db("papers")
      .insert(paper)
      .then(() => console.log("Insert paper to database successful"))
      .catch((err) => console.log(err));
  },

  async findById(id) {
    const rows = await db("papers").where("PaperID", id);
    if (rows.length === 0) return null;

    return rows[0];
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
