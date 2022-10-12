"use strict";
const { api } = require("../../libs/simple-api");
const { getSportEventBySportId, getOneUser } = require("./methods");
module.exports = (router) => {
  api({
    router,
    method: "get",
    path: "/api/users/me",
    handler: async ({ input, db, apiError }) => {
      const userId = input.user.id;

      const user = await getOneUser({ id: userId });

      return user;
    },
  });
};
