"use strict";
const { api } = require("../../libs/simple-api");
const { getSportEventBySportId } = require("./methods");
module.exports = (router) => {
  api({
    router,
    method: "get",
    path: "/api/sports/:sportId/sport_events",
    handler: async ({ input, db, apiError }) => {
      console.log(input.user);
      const { sportId } = input.params;
      const { finished } = input.query;

      const events = await getSportEventBySportId(sportId, finished);

      return events;
    },
  });

  api({
    router,
    method: "post",
    path: "/api/sport_events",
    handler: async ({ input, db, apiError }) => {
      const sportEvent = {
        first_competitor: "Balun Split",
        second_competitor: "Balun Solin",
        sport_id: 1,
        outcomes: [
          {
            sport_outcome_id: 1,
            odds: 10,
          },
          {
            sport_outcome_id: 2,
            odds: 1.5,
          },
          {
            sport_outcome_id: 3,
            odds: 1,
          },
        ],
      };

      const { outcomes, ...eventData } = sportEvent;
      const transaction = await db.transaction();
      try {
        const createdEvent = (
          await db("sport_event")
            .insert(eventData)
            .returning("*")
            .transacting(transaction)
        ).pop();

        for (const outcome of outcomes) {
          const { odds, sport_outcome_id: id } = outcome;
          await db("sport_event_outcome_odds")
            .insert({ ...outcome, sport_event_id: createdEvent.id })
            .transacting(transaction);
        }

        await transaction.commit();

        return createdEvent;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    },
  });

  api({
    router,
    method: "post",
    path: "/api/sport_events/play",
    handler: async ({ input, db, apiError }) => {
      const { outcomes, ...eventData } = sportEvent;
      const transaction = await db.transaction();
      try {
        const createdEvent = (
          await db("sport_event")
            .insert(eventData)
            .returning("*")
            .transacting(transaction)
        ).pop();

        for (const outcome of outcomes) {
          const { odds, sport_outcome_id: id } = outcome;
          await db("sport_event_outcome_odds")
            .insert({ ...outcome, sport_event_id: createdEvent.id })
            .transacting(transaction);
        }

        await transaction.commit();

        return createdEvent;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    },
  });
};
