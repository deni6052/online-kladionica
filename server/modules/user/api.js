"use strict";
const { api } = require("../../libs/simple-api");
const { getSportEventBySportId, getOneUser } = require("./methods");
module.exports = (router) => {
  api({
    router,
    method: "get",
    path: "/api/users/me",
    handler: async ({ input, apiError }) => {
      const userId = input.user.id;

      const user = await getOneUser({ id: userId }, [
        "fullName",
        "currentBalance",
      ]);
      if (!user) {
        throw apiError({ status: 404, message: "User not found" });
      }

      return user;
    },
  });
};
