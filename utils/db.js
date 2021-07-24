const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
  },
  pool: {
    min: 0,
    max: 50,
  },
});

module.exports = knex;
