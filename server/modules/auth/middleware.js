const { body } = require("express-validator");
const { validate } = require("../../libs/validator");

module.exports.login = validate([
  body("email").isEmail().withMessage("Must be a valid email"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Passworm must be at least 3 characters long"),
]);

module.exports.register = validate([
  body("fullName")
    .isString()
    .notEmpty()
    .withMessage("Must provide a full name"),

  body("email").isEmail().withMessage("Must be a valid email"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Passworm must be at least 3 characters long"),
]);
