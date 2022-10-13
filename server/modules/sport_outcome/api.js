"use strict";
const { api } = require("../../libs/simple-api");
const { getSportOutcomesBySport } = require("./method");

module.exports = (router) => {
  api({
    router,
    method: "get",
    path: "/api/sports/:sportId/sport_outcomes",
    auth: false,
    handler: async ({ input }) => {
      const { sportId } = input.params;

      const result = await getSportOutcomesBySport(sportId);

      return result;
    },
  });
};
