"use strict";
const { api } = require("../../libs/simple-api");
const { getOneUser, updateUserBalanceById } = require("../user/methods");
const {
  getSlipsByUserId,
  createBettingSlip,
  createBettingSlipOutcome,
  getTotalOdds,
} = require("./methods");

module.exports = (router) => {
  api({
    router,
    method: "get",
    path: "/api/betting_slips/me",
    handler: async ({ input }) => {
      const userId = input.user.id;

      const result = await getSlipsByUserId(userId);

      return result;
    },
  });

  api({
    router,
    method: "post",
    path: "/api/betting_slips",
    handler: async ({ input, db, apiError }) => {
      const userId = input.user.id;
      const bettingSlip = input.body;
      const { betAmount, events } = bettingSlip;
      // Check if user has enough money
      const user = await getOneUser({ id: userId });
      if (user.currentBalance - betAmount < 0) {
        throw apiError({ status: 400, message: "Insufficient funds" });
      }

      const transaction = await db.transaction();
      try {
        // Update the balance
        await updateUserBalanceById(user.id, -betAmount, transaction);
        // Get the total odds
        const totalOdds = await getTotalOdds(events);
        // Calculate total potential winnings
        const potentialWinnings = (totalOdds * betAmount).toFixed(2);

        // Create the betting slip
        const createdSlip = await createBettingSlip(
          { betAmount, userId, totalOdds, potentialWinnings },
          transaction
        );
        // Create event-outcome items for the betting slip
        for (const event of events) {
          await createBettingSlipOutcome(
            createdSlip.id,
            event.selectedEventId,
            event.outcomeId,
            transaction
          );
        }

        await transaction.commit();

        return createdSlip;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    },
  });
};
