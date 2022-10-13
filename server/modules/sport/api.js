"use strict";
const { api } = require("../../libs/simple-api");
const { getSports } = require("./methods");

module.exports = (router) => {
  api({
    router,
    method: "get",
    path: "/api/sports",
    auth: false,
    handler: async () => {
      const result = await getSports();

      return result;
    },
  });
};
