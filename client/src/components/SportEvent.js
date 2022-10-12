import React from "react";
import Button from "./Button";
import "./SportEvent.css";

export default function SportEvent(props) {
  const event = props.event;

  return (
    <div className="sport-event card">
      <h3>
        {" "}
        {event.firstCompetitor} - {event.secondCompetitor}
      </h3>
      <div className="sport-event-buttons">
        {event.outcomes.map((outcome, i) => {
          return (
            <Button
              key={i}
              label={`${outcome.label} (${outcome.odds.toFixed(2)})`}
              color="primary"
              type="button"
              clickHandler={() =>
                props.upsertBettingSlipEvent(props.event, outcome)
              }
            ></Button>
          );
        })}
      </div>
    </div>
  );
}
