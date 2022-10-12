const { knex } = require("knex");
const knexStringcase = require("knex-stringcase");

const dbConfig = {
  client: "sqlite3", // or 'better-sqlite3'
  connection: {
    filename: "./db/online-kladionica.sqlite",
  },
  useNullAsDefault: true,
  pool: { min: 1, max: 3 },
};

const options = knexStringcase(dbConfig);
const db = knex(options);
module.exports = db;
