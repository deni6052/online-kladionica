"use strict";
const { createUser, getOneUser } = require("../user/methods");
const { api } = require("../../libs/simple-api");
const { signToken } = require("../../libs/jwt");
/**
 *
 * @param {*} router
 *
 */
module.exports = (router) => {
  api({
    router,
    method: "post",
    path: "/api/auth/login",
    auth: false,
    handler: async ({ input, apiError }) => {
      const { email, password } = input.body;

      const user = await getOneUser({ email });
      if (!user || password !== user.password) {
        throw apiError({ status: 401, message: "Invalid credentials" });
      }
      const token = signToken({ fullName: user.fullName, id: user.id });
      return { token };
    },
  });

  api({
    router,
    method: "post",
    path: "/api/auth/register",
    auth: false,
    handler: async ({ input, apiError }) => {
      const { email, password } = input.body;

      try {
        await createUser(email, password);
      } catch (error) {
        if (error.errno === 19) {
          // if unique email constraint fails
          throw apiError({ status: 400, message: "Invalid user data" }); // Safer to send a generic error than to acknowledge that an email was registered
        }
        // Otherwise internal server error
        throw error;
      }
      return { message: "User successfully registered" };
    },
  });
};
