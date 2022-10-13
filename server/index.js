const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

require("./modules/auth/api")(app);
require("./modules/sport_event/api")(app);
require("./modules/betting_slip/api")(app);
require("./modules/user/api")(app);
require("./modules/sport_outcome/api")(app);
require("./modules/sport/api")(app);

app.listen(4200);
console.log("App listening on port 4200");
