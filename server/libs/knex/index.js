const knex = require('knex').knex({
	client: 'sqlite3', // or 'better-sqlite3'
	connection: {
		filename: "./db/online-kladionica.sqlite"
	},
	useNullAsDefault: true
});

module.exports = knex;
