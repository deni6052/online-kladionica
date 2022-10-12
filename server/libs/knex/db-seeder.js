const db = require("./index");

console.log("db");
// Create users
module.exports.createDb = async () => {
  await db.schema.createTable("user", function (table) {
    table.primary("id");
    table.increments("id");
    table.string("email");
    table.string("full_name");
    table.string("password");
    table.float("current_balance");

    table.unique("email");
  });

  // Sport
  await db.schema.createTable("sport", function (table) {
    table.primary("id");
    table.increments("id");
    table.string("name");
  });

  // Sport outcome
  await db.schema.createTable("sport_outcome", function (table) {
    table.primary("id");
    table.increments("id");
    table.string("label");
    table.enum("result_type", ["first_win", "draw", "second_win"]);
    table.integer("sport_id");

    table.foreign("sport_id").references("id").inTable("sport");
  });

  // // Sport competitor
  // await db.schema.createTable('sport_competitor', function (table) {
  // 	table.primary('id');
  // 	table.increments('id');
  // 	table.string('name');
  // })

  // Sport event
  await db.schema.createTable("sport_event", function (table) {
    table.primary("id");
    table.increments("id");
    table.string("first_competitor").notNullable();
    table.string("second_competitor").notNullable();
    table.integer("first_score").nullable();
    table.integer("second_score").nullable();
    table.integer("sport_id");
    table.integer("sport_outcome_id").nullable();

    table.foreign("sport_id").references("id").inTable("sport");
    table.foreign("sport_outcome_id").references("id").inTable("sport_outcome");
  });

  // Sport event outcome quota
  await db.schema.createTable("sport_event_outcome_odds", function (table) {
    table.primary("id");
    table.increments("id");
    table.float("odds");
    table.integer("sport_event_id");
    table.integer("sport_outcome_id");

    table.foreign("sport_event_id").references("id").inTable("sport_event");
    table.foreign("sport_outcome_id").references("id").inTable("sport_outcome");
  });

  //Betting slip
  await db.schema.createTable("betting_slip", function (table) {
    table.primary("id");
    table.increments("id");
    table.float("bet_amount");
    table.float("total_odds");
    table.float("potentialWinnings");
    table.integer("user_id");
    table
      .enum("status", ["in_progress", "win", "loss"])
      .defaultTo("in_progress");

    table.foreign("user_id").references("id").inTable("user");
  });

  // Betting slip event outcome
  await db.schema.createTable("betting_slip_event_outcome", function (table) {
    table.primary("id");
    table.increments("id");
    table.integer("betting_slip_id");
    table.integer("sport_event_id");
    table.integer("sport_outcome_id");

    table.foreign("betting_slip_id").references("id").inTable("betting_slip");
    table.foreign("sport_event_id").references("id").inTable("sport_event");
    table.foreign("sport_outcome_id").references("id").inTable("sport_outcome");
  });
};

module.exports.seedDb = async () => {
  // Seed users
  await db.batchInsert("user", [
    {
      email: "test@test.com",
      password: "1234",
      full_name: "Test user",
      current_balance: 200,
    },
  ]);

  await db.batchInsert("sport", [
    {
      name: "Football",
    },
    {
      name: "Tennis",
    },
  ]);

  await db.batchInsert("sport_outcome", [
    {
      label: "1",
      result_type: "first_win",
      sport_id: 1,
    },
    {
      label: "x",
      result_type: "draw",
      sport_id: 1,
    },
    {
      label: "2",
      result_type: "second_win",
      sport_id: 1,
    },
    {
      label: "Player 1",
      result_type: "first_win",
      sport_id: 2,
    },
    {
      label: "Player 2",
      result_type: "second_win",
      sport_id: 2,
    },
  ]);

  await db.batchInsert("sport_event", [
    {
      first_competitor: "Balun Split",
      second_competitor: "Balun Solin",
      sport_id: 1,
    },
    {
      first_competitor: "Balun Rijeka",
      second_competitor: "Loptanje Zagreb",
      sport_id: 1,
    },
    {
      first_competitor: "John Doe",
      second_competitor: "Jack Doe",
      sport_id: 2,
    },
    {
      first_competitor: "Jane Doe",
      second_competitor: "Jo Doe",
      sport_id: 2,
    },
  ]);

  // First football game
  await db.batchInsert("sport_event_outcome_odds", [
    {
      odds: 10,
      sport_event_id: 1,
      sport_outcome_id: 1,
    },
    {
      odds: 1.5,
      sport_event_id: 1,
      sport_outcome_id: 2,
    },
    {
      odds: 1,
      sport_event_id: 1,
      sport_outcome_id: 3,
    },
  ]);

  // Second football game
  await db.batchInsert("sport_event_outcome_odds", [
    {
      odds: 12,
      sport_event_id: 2,
      sport_outcome_id: 1,
    },
    {
      odds: 2,
      sport_event_id: 2,
      sport_outcome_id: 2,
    },
    {
      odds: 1.05,
      sport_event_id: 2,
      sport_outcome_id: 3,
    },
  ]);

  // First tennis match
  await db.batchInsert("sport_event_outcome_odds", [
    {
      odds: 1.55,
      sport_event_id: 3,
      sport_outcome_id: 4,
    },
    {
      odds: 2.45,
      sport_event_id: 3,
      sport_outcome_id: 5,
    },
  ]);

  // Second tennis match
  await db.batchInsert("sport_event_outcome_odds", [
    {
      odds: 2.05,
      sport_event_id: 4,
      sport_outcome_id: 4,
    },
    {
      odds: 1.25,
      sport_event_id: 4,
      sport_outcome_id: 5,
    },
  ]);
};

this.createDb();
this.seedDb();
