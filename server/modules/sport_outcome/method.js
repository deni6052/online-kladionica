const db = require("../../libs/knex");

const outcomeCache = {};
module.exports.getSportOutcomesBySportAndType = async (sportId, resultType) => {
  const cacheKey = `${sportId}-${resultType}`;
  if (outcomeCache[cacheKey]) {
    return outcomeCache[cacheKey];
  }
  const outcome = await db("sport_outcome")
    .where({
      sport_id: sportId,
      result_type: resultType,
    })
    .first();

  outcomeCache[cacheKey] = outcome;
  return outcome;
};

module.exports.getSportOutcomesBySport = (sportId) => {
  return db("sport_outcome").where({
    sport_id: sportId,
  });
};
