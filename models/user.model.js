const db = require("../utils/db");

module.exports = {
  all() {
    return db("users");
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
};
