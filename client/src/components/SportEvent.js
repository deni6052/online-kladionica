import React from "react";
import Button from "./shared/Button";

import "./SportEvent.css";

export default function SportEvent({
  event,
  upsertBettingSlipEvent,
  preview = false,
}) {
  return (
    <div className="sport-event card">
      <h3>
        {event.firstCompetitor} : {event.secondCompetitor}
        {preview && event.firstScore && event.secondScore && (
          <span>
            {" "}
            - {event.firstScore} : {event.secondScore}
          </span>
        )}
      </h3>
      <p></p>
      <div className="sport-event-buttons">
        {event.outcomes.map((outcome, i) => {
          return (
            <Button
              key={i}
              disabled={preview}
              label={`${outcome.label} (${outcome.odds.toFixed(2)})`}
              color="primary"
              type="button"
              clickHandler={() => upsertBettingSlipEvent(event, outcome)}
            ></Button>
          );
        })}
      </div>
    </div>
  );
}
