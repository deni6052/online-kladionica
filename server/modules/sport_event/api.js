"use strict";
const { api } = require("../../libs/simple-api");
const {
  getWinningSlips,
  getSlipWinningSums,
  getLosingSlips,
  updateManySlipsById,
} = require("../betting_slip/methods");
const { getSportOutcomesBySportAndType } = require("../sport_outcome/method");
const { updateUserBalanceById } = require("../user/methods");
const {
  getSportEventBySportId,
  getUnresolvedEvents,
  updateOneEvent,
  getSportEventForSlip,
} = require("./methods");
module.exports = (router) => {
  api({
    router,
    method: "get",
    path: "/api/sports/:sportId/sport_events",
    auth: false,
    handler: async ({ input, db, apiError }) => {
      const { sportId } = input.params;
      const { finished } = input.query;

      const events = await getSportEventBySportId(sportId, finished);

      return events;
    },
  });

  api({
    router,
    method: "get",
    path: "/api/betting_slips/:bettingSlipId/events",
    auth: false,
    handler: async ({ input }) => {
      const { bettingSlipId } = input.params;
      const result = await getSportEventForSlip(bettingSlipId);

      return result;
    },
  });

  api({
    router,
    method: "post",
    path: "/api/sport_events",
    handler: async ({ input, db, apiError }) => {
      const sportEvent = input.body;

      const { outcomes, ...eventData } = sportEvent;
      const transaction = await db.transaction();
      try {
        const { firstCompetitor, secondCompetitor, sportId } = eventData;
        const createdEvent = (
          await db("sport_event")
            .insert({ firstCompetitor, secondCompetitor, sportId })
            .returning("*")
            .transacting(transaction)
        ).pop();

        for (const outcome of outcomes) {
          const { sportOutcomeId, odds } = outcome;
          await db("sport_event_outcome_odds")
            .insert({ sportOutcomeId, odds, sport_event_id: createdEvent.id })
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

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min + 1;
  }
  api({
    router,
    method: "post",
    path: "/api/sport_events/play",
    auth: false,
    handler: async ({ db }) => {
      await db("sport_event").update({ sport_outcome_id: null });
      const transaction = await db.transaction();
      try {
        const unresolvedEvents = await getUnresolvedEvents();
        for (const event of unresolvedEvents) {
          let scores;
          if (event.name === "Football") {
            scores = [getRandomInt(0, 5), getRandomInt(0, 5)];
          } else if ((event.name = "Tennis")) {
            scores = [getRandomInt(0, 3), getRandomInt(0, 3)];
            // Resolve ties with -1/+1
            if (scores[0] === scores[1]) {
              scores[0] += getRandomInt(0, 1) ? -1 : 1;
            }
          }

          let outcome;
          if (scores[0] === scores[1]) {
            outcome = await getSportOutcomesBySportAndType(
              event.sportId,
              "draw"
            );
          } else if (scores[0] > scores[1]) {
            outcome = await getSportOutcomesBySportAndType(
              event.sportId,
              "first_win"
            );
          } else {
            outcome = await getSportOutcomesBySportAndType(
              event.sportId,
              "second_win"
            );
          }
          await updateOneEvent(
            {
              sport_outcome_id: outcome.id,
              first_score: scores[0],
              second_score: scores[1],
            },
            { id: event.id },
            transaction
          );
        }

        const slipsWon = await getWinningSlips(transaction);

        await updateManySlipsById(
          { status: "win" },
          slipsWon.map((slip) => slip.id),
          transaction
        );

        const userWinninngs = await getSlipWinningSums(
          slipsWon.map((slip) => slip.id),
          transaction
        );

        for (const user of userWinninngs) {
          await updateUserBalanceById(
            user.userId,
            user.totalWinning,
            transaction
          );
        }

        const slipsLost = await getLosingSlips(transaction);

        await updateManySlipsById(
          { status: "loss" },
          slipsLost.map((slip) => slip.id),
          transaction
        );

        await transaction.commit();
        return { slipsWon, slipsLost, userWinninngs };
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    },
  });
};
