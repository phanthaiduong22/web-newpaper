const db = require('../utils/db');

module.exports = {
  async all() {
    return await db('reset');
  },

  async allWithSpecific() {
    return await db('category_editors')
      .select('*')
      .rightJoin('users', 'users.UserID', '=', 'category_editors.EditorID')
      .leftJoin(
        'categories',
        'categories.CatID',
        '=',
        'category_editors.CatID',
      );
  },

  async add(info) {
    return await db('reset').insert(info);
  },

  async findByEmail(email) {
    const rows = await db('reset').where('email', email);
    if (rows.length === 0) return null;

    return rows[rows.length - 1];
  },
};
