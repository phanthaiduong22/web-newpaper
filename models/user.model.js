const db = require("../utils/db");

module.exports = {
  all() {
    return db("users");
  },

  async allWithSpecific() {
    return await db("category_editors")
      .select("*")
      .rightJoin("users", "users.UserID", "=", "category_editors.EditorID")
      .leftJoin(
        "categories",
        "categories.CatID",
        "=",
        "category_editors.CatID"
      );
  },

  add(user) {
    return db("users").insert(user);
  },

  async findByUsername(username) {
    const rows = await db("users").where("Username", username);
    if (rows.length === 0) return null;

    return rows[0];
  },

  async findByEmail(email) {
    const rows = await db("users").where("Email", email);
    if (rows.length === 0) return null;

    return rows[0];
  },

  async updateUserRole(userID, role) {
    await db("users")
      .where("UserID", userID)
      .update({
        Role: role,
      })
      .then(() => {
        return 1;
      })
      .catch(() => {
        return 0;
      });
  },
  async upsertEditorCategory(userID, catID) {
    await db
      .raw(
        `REPLACE INTO category_editors (EditorID, CatID) VALUES (${userID}, ${catID})`
      )
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });
  },
};
