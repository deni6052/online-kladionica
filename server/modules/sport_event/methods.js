const db = require("../../libs/knex");

module.exports.getSportEventBySportId = async (sportId, finished) => {
  let query = db("sport_event as SE")
    .select(
      "SE.id",
      "SE.first_competitor",
      "SE.second_competitor",
      "SE.first_score",
      "SE.second_score",
      "SE.sport_outcome_id",
      "SE.sport_id",
      db.raw(`
		json_group_array(
			json_object(
				'sportOutcomeId', SO.id,
				'label', SO.label,
				'odds', SEOO.odds
			)
		) as outcomes
		`)
    )
    .innerJoin(
      "sport_event_outcome_odds as SEOO",
      "SEOO.sport_event_id",
      "SE.id"
    )
    .innerJoin("sport_outcome as SO", "SO.id", "SEOO.sport_outcome_id")
    .groupBy("SE.id")
    .where({ "SE.sport_id": sportId });

  if (finished) {
    query = query.whereNotNull("SE.sport_outcome_id");
  } else {
    query = query.whereNull("SE.sport_outcome_id");
  }

  return query.then((data) =>
    data.map((el) => {
      return { ...el, outcomes: JSON.parse(el.outcomes) };
    })
  );
};

module.exports.getSportEventForSlip = async (bettingSlipId) => {
  let query = db("betting_slip_event_outcome as BSEO")
    .select(
      "SE.id",
      "SE.first_competitor",
      "SE.second_competitor",
      "SE.first_score",
      "SE.second_score",
      "SE.sport_outcome_id",
      "SE.sport_id",
      db.raw(`
  		json_object(
  			'sportOutcomeId', SO.id,
  			'label', SO.label,
  			'odds', SEOO.odds
  		)
  	as outcomes
  	`)
    )
    .innerJoin("sport_event_outcome_odds as SEOO", function () {
      this.on("SEOO.sport_outcome_id", "=", "BSEO.sport_outcome_id").andOn(
        "SEOO.sport_event_id",
        "=",
        "SE.id"
      );
    })
    .innerJoin("sport_event as SE", "SE.id", "BSEO.sport_event_id")
    .innerJoin("sport_outcome as SO", "SO.id", "BSEO.sport_outcome_id")
    .innerJoin("betting_slip as BS", "BS.id", "BSEO.betting_slip_id")
    .where({ "BS.id": bettingSlipId });

  return query.then((data) =>
    data.map((el) => {
      return { ...el, outcomes: [JSON.parse(el.outcomes)] };
    })
  );
};

module.exports.createSportEvent = async (eventData, transaction) => {
  const createdEvent = (
    await db("sport_event")
      .insert(eventData)
      .returning("*")
      .transacting(transaction)
  ).pop();

  return createdEvent;
};
module.exports.updateOneEvent = (update, condition, transaction) => {
  return db("sport_event")
    .update(update)
    .where(condition)
    .transacting(transaction);
};

module.exports.createEventOutcomeOdds = (outcomeOddsData, transaction) => {
  return db("sport_event_outcome_odds")
    .insert(outcomeOddsData)
    .transacting(transaction);
};

// helper
function getRnd(min, max) {
  return Math.floor(Math.random() * (max - min)) + min + 1;
}

module.exports.getRandomScores = (sportName) => {
  let scores = [getRnd(0, 5), getRnd(0, 5)];

  // Resolve ties with -1/+1
  if (scores[0] === scores[1] && sportName === "Tennis") {
    scores[0] += getRnd(0, 1) ? -1 : 1;
  }

  return scores;
};

module.exports.getUnresolvedEvents = () => {
  return db("sport_event as SE")
    .select("SE.*", "S.name")
    .innerJoin("sport as S", "S.id", "SE.sport_id")
    .whereNull("sport_outcome_id");
};
