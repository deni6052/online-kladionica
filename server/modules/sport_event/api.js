"use strict";
const { api } = require('../../libs/simple-api');
module.exports = (router) => {
	api({
		router,
		method: 'get',
		path: '/api/sports/:sportId/sport_events',
		handler: async ({ input, db, apiError }) => {
			const { sportId } = input.params;
			const { finished } = input.query;

			let query = db('sport_event as SE')
				.select(
					'SE.id',
					'SE.first_competitor',
					'SE.second_competitor',
					'SE.first_score',
					'SE.second_score',
					'SE.sport_outcome_id',
					'SE.sport_id',
					db.raw(`
					json_group_array(
						json_object(
							'sport_outcome_id', SO.id,
							'label', SO.label,
							'odds', SEOO.odds
						)
					) as outcomes
					`)
				)
				.innerJoin('sport_event_outcome_odds as SEOO', 'SEOO.sport_event_id', 'SE.id')
				.innerJoin('sport_outcome as SO', 'SO.id', 'SEOO.sport_outcome_id')
				.groupBy('SE.id')
				.where({ 'SE.sport_id': sportId })

			if (finished) {
				query = query.whereNotNull('SE.sport_outcome_id')
			}

			const result = await query.then(data => data.map(el => { return { ...el, outcomes: JSON.parse(el.outcomes) } }))


			return result;
		}
	})

	api({
		router,
		method: 'post',
		path: '/api/sport_events',
		handler: async ({ input, db, apiError }) => {
			const sportEvent = {
				"first_competitor": "Balun Split",
				"second_competitor": "Balun Solin",
				"sport_id": 1,
				"outcomes": [
					{
						"sport_outcome_id": 1,
						"odds": 10
					},
					{
						"sport_outcome_id": 2,
						"odds": 1.5
					},
					{
						"sport_outcome_id": 3,
						"odds": 1
					}
				]
			}

			const { outcomes, ...eventData } = sportEvent;
			const transaction = await db.transaction();
			try {
				const createdEvent = (await db('sport_event').insert(eventData).returning('*').transacting(transaction)).pop();

				for (const outcome of outcomes) {
					const { odds, sport_outcome_id: id } = outcome;
					await db('sport_event_outcome_odds').insert({ ...outcome, sport_event_id: createdEvent.id }).transacting(transaction);
				}

				await transaction.commit();

				return createdEvent;
			} catch (error) {
				await transaction.rollback();
				throw error;
			}

		}
	})






}