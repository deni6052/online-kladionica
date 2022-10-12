const db = require("./libs/knex");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const { jwtMiddleware } = require("./libs/jwt");

app.use(cors());
app.use(bodyParser.json());
// app.use(jwtMiddleware);

require("./modules/auth/api")(app);
require("./modules/sport_event/api")(app);
require("./modules/betting_slip/api")(app);
require("./modules/user/api")(app);

app.listen(4200);
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
