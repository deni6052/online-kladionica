"use strict";
const db = require("../../libs/knex");
const { jwtMiddleware } = require("../jwt");

/**
 * @typedef ApiContext
 * @property {import('express').Request} input
 * @property {db} db
 * @property {function} apiError
 */

/**
 * @param {object} context
 * @param {import('express').Router} context.router
 * @param {'get' | 'post' | 'put' | 'delete'} context.method
 * @param {string} context.path
 * @param {number} context.status
 * @param { (context: ApiContext)=> any}context.handler
 */
module.exports.api = ({
  router,
  method,
  path,
  status = 200,
  auth = true,
  middleware = [],
  handler,
}) => {
  const logPrefix = `${method.toUpperCase()} - ${path}`;
  try {
    if (auth) {
      middleware.push(jwtMiddleware);
    }

    router[method](path, ...middleware, async (req, res) => {
      try {
        const result = await handler({ input: req, db: db, apiError });
        return res.status(status).send(result);
      } catch (error) {
        if (error.expected) {
          console.log(error.message);
          return res.status(error.status).send({ message: error.message });
        }
        console.log(error);
        return res.status(500).send({ message: "Server error" });
      }
    });
    console.info(`Registered route: ${logPrefix}`);
  } catch (error) {
    console.error(`Error registering route: ${logPrefix}`);
  }
};

function apiError({ status, message }) {
  return { status, message, expected: true };
}
