const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "bietdoibancuoi",
    password: "BDbc@123",
    database: "newspaper",
    port: 3306,
  },
  pool: {
    min: 0,
    max: 50,
  },
});

module.exports = knex;
