const db = require("../../libs/knex");

module.exports.createUser = (email, password) => {
  return db("user").insert({ email, password, current_balance: 100 }); // Initial balance set to add some testing funds
};

module.exports.getUserByEmail = (email) => {
  return db("user").where({ email }).first();
};

module.exports.getUserById = (userId) => {
  return db("user").where({ id: userId }).first();
};

module.exports.getOneUser = (condition, select = "*") => {
  return db("user").select(select).where(condition).first();
};

module.exports.updateUserById = (userId, update) => {
  return db("user").update({ update }).where({ id: userId });
};

module.exports.updateUserBalanceById = async (userId, amount, transaction) => {
  const res = await db("user")
    .where({ id: userId })
    .increment("current_balance", amount)
    .transacting(transaction)
    .returning("*");
  return res;
};
