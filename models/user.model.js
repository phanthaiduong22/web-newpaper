const db = require("../utils/db");

module.exports = {
  async all() {
    return await db("users");
  },

  async allWithSpecific() {
    return await db("category_editors")
      .select("*")
      .rightJoin("users", "users.UserID", "=", "category_editors.EditorID")
      .leftJoin(
        "categories",
        "categories.CatID",
        "=",
        "category_editors.CatID",
      );
  },

  async add(user) {
    return await db("users").insert(user);
  },
  async findByUserID(id) {
    const rows = await db("users").where("UserID", id);
    if (rows.length === 0) return null;

    return rows[0];
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

  async changePassword(userID, password) {
    return await db("users")
      .where("UserID", userID)
      .update({ Password: password });
  },

  async updateProfile(userID, profile) {
    return await db("users").where("UserID", userID).update({
      Name: profile.name,
      Email: profile.email,
      Dob: profile.dob,
    });
  },

  async updateUserRole(userID, oldRole, updatedRole) {
    if (oldRole === "editor") {
      await db("category_editors").where("EditorID", userID).del();
    }
    return await db("users").where("UserID", userID).update({
      Role: updatedRole,
    });
  },
  async updateEditorCategory(userID, catID) {
    return await db
      .raw(
        `REPLACE INTO category_editors (EditorID, CatID) VALUES (${userID}, ${catID})`,
      )
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });
  },

  async del(id) {
    await db("category_editors").where("EditorID", id).del();
    await db("comment").where("UserID", id).del();
    return await db("users").where("UserID", id).del();
  },

  async activePremium(id, Time) {
    return await db("users").where("UserID", id).update({
      Premium: 1,
      Time,
      GetPremiumAt: new Date().getTime(),
    });
  },

  async deactivePremium(id) {
    return await db("users").where("UserID", id).update({
      Premium: 0,
      Time: 0,
      GetPremiumAt: new Date().getTime(),
    });
  },
};
