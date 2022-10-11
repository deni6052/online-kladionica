const db = require('../../libs/knex');

/**
 * 
 * @param {string} email 
 * @param {string} password 
 */
module.exports.createUser = (email, password) => {
	return db('user').insert({ email, password, current_balance: 100 }); // Initial balance set to add some testing funds
}


/**
 * 
 * @param {string} email 
 */
module.exports.getUserByEmail = (email) => {
	return db('user').where({ email }).first();
}