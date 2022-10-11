const db = require('./libs/knex');

const express = require('express');
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.json())

require('./modules/auth/api')(app);
require('./modules/sport_event/api')(app);

app.listen(3000);
// const { seed } = require('./libs/knex/db-seeder');

// seed()
// async function test() {
// 	console.log(db)
// 	console.log('asdfasdfa')
// 	try {
// 		await db.schema.createTable('users', function (table) {
// 			table.increments();
// 			table.string('name');
// 			table.timestamps();
// 		})

// 	} catch (error) {
// 		console.log(error)
// 	}
// }

// test();