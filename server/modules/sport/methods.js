const db = require("../../libs/knex");

module.exports.getSports = () => {
  return db("sport").select("*");
};
