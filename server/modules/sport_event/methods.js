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
  }

  return query.then((data) =>
    data.map((el) => {
      return { ...el, outcomes: JSON.parse(el.outcomes) };
    })
  );
};
