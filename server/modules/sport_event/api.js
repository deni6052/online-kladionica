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
  createSportEvent,
  createEventOutcomeOdds,
  getRandomScores,
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
        // Create the sport event
        const createdEvent = await createSportEvent(
          { firstCompetitor, secondCompetitor, sportId },
          transaction
        );

        // Add the outcome-odds items to the sport event
        for (const outcome of outcomes) {
          const { sportOutcomeId, odds } = outcome;
          await createEventOutcomeOdds(
            { sportOutcomeId, odds, sport_event_id: createdEvent.id },
            transaction
          );
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
    auth: false,
    handler: async ({ db }) => {
      await db("sport_event").update({ sport_outcome_id: null });
      const transaction = await db.transaction();
      try {
        // Get all events without a score
        const unresolvedEvents = await getUnresolvedEvents();
        for (const event of unresolvedEvents) {
          // generate score for each event
          const scores = getRandomScores(event.name);

          // Select outcome based on score results
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
          // Update each event with their new score
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

        // Get all slips that have won, but their status hasn't been changed yet
        const slipsWon = await getWinningSlips(transaction);

        // Update their status
        await updateManySlipsById(
          { status: "win" },
          slipsWon.map((slip) => slip.id),
          transaction
        );

        // Aggregate all winings for newly updated slips and get the owning user
        const userWinninngs = await getSlipWinningSums(
          slipsWon.map((slip) => slip.id),
          transaction
        );

        // For each user that has won, increase their balance
        for (const user of userWinninngs) {
          await updateUserBalanceById(
            user.userId,
            user.totalWinning,
            transaction
          );
        }

        // Get all slips that have lost, but their status hasn't been changed yet
        const slipsLost = await getLosingSlips(transaction);

        // Update their status
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
