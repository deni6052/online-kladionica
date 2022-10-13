const { validationResult } = require("express-validator");

module.exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    console.log(errors.array());
    return res.status(400).send({
      message: errors
        .array()
        .map((e) => e.msg)
        .join(" "),
    });
  };
};