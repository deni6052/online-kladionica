const db = require("../../libs/knex");

module.exports.getSlipsByUserId = (userId) => {
  return db("betting_slip as BS").select("BS.*").where({ userId });
};

module.exports.createBettingSlip = async (bettingSlip, transaction) => {
  return (
    await db("betting_slip")
      .insert(bettingSlip)
      .returning("*")
      .transacting(transaction)
  ).pop();
};

module.exports.createBettingSlipOutcome = (
  bettingSlipId,
  selectedEventId,
  selectedOutcomeId,
  transaction
) => {
  return db("betting_slip_event_outcome")
    .insert({
      betting_slip_id: bettingSlipId,
      sport_event_id: selectedEventId,
      sport_outcome_id: selectedOutcomeId,
    })
    .transacting(transaction);
};

module.exports.getTotalOdds = async (events) => {
  const eventOutcomeTouple = events.map((event) => [
    event.selectedEventId,
    event.outcomeId,
  ]);
  const allOdds = await db("sport_event_outcome_odds as SEOO")
    .select("SEOO.odds")
    .whereIn(["sport_event_id", "sport_outcome_id"], eventOutcomeTouple)
    .pluck("odds");
  const totalOdds = allOdds.reduce((product, odds) => (product *= odds), 1);
  return totalOdds;
};

module.exports.getWinningSlips = (transaction) => {
  return db("betting_slip as BS")
    .select("BS.*")

    .whereNotExists(function () {
      this.select("*")
        .from("sport_event as SE")
        .innerJoin(
          "betting_slip_event_outcome as BSEO",
          "BSEO.sport_event_id",
          "SE.id"
        )
        .where(function () {
          this.whereNot({
            "SE.sport_outcome_id": db.ref("BSEO.sport_outcome_id"),
          }).orWhere({
            "SE.sport_outcome_id": null,
          });
        })

        .andWhere({
          "SE.id": db.ref("BSEO.sport_event_id"),
          "BSEO.betting_slip_id": db.ref("BS.id"),
        });
    })
    .andWhere({ status: "in_progress" })
    .transacting(transaction);
};

module.exports.getLosingSlips = (transaction) => {
  return db("betting_slip as BS")
    .select("BS.*")

    .whereExists(function () {
      this.select("*")
        .from("sport_event as SE")
        .innerJoin(
          "betting_slip_event_outcome as BSEO",
          "BSEO.sport_event_id",
          "SE.id"
        )
        .whereNot({
          "SE.sport_outcome_id": db.ref("BSEO.sport_outcome_id"),
        })

        .where({
          "SE.id": db.ref("BSEO.sport_event_id"),
          "BS.id": db.ref("BSEO.betting_slip_id"),
        });
    })
    .andWhere({ status: "in_progress" })
    .transacting(transaction);
};

module.exports.getSlipWinningSums = (slipIds, transaction) => {
  return db("betting_slip")
    .select("user_id")
    .sum("potential_winnings as totalWinning")
    .whereIn("id", slipIds)
    .groupBy("user_id")
    .transacting(transaction);
};

module.exports.updateManySlipsById = (update, slipIds, transaction) => {
  return db("betting_slip")
    .update(update)
    .whereIn("id", slipIds)
    .transacting(transaction);
};
