var jwt = require("jsonwebtoken");
var { expressjwt } = require("express-jwt");
const secret = "123";

module.exports.signToken = (data) => {
  return jwt.sign(data, secret);
};

module.exports.verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports.jwtMiddleware = expressjwt({
  secret: secret,
  algorithms: ["HS256"],
  requestProperty: "user",
});
