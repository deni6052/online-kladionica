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
  console.log(allOdds);
  const totalOdds = allOdds.reduce((product, odds) => (product *= odds), 1);
  return totalOdds;
};
