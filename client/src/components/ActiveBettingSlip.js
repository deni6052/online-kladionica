import React from "react";
import Button from "./shared/Button";
import TextInput from "./shared/TextInput";
import "./ActiveBettingSlip.css";

export default function ActiveBettingSlip({
  bettingSlip,
  updateBettingAmount,
  clearBettingSlip,
  createBettingSlip,
}) {
  return (
    <div className="card active-slip">
      <h3>Your betting slip</h3>
      {bettingSlip.events.map(({ selectedEvent, selectedOutcome }, i) => {
        return (
          <div key={i}>
            <h4>
              {selectedEvent.firstCompetitor} - {selectedEvent.secondCompetitor}{" "}
            </h4>
            <p>
              {selectedOutcome.label} ({selectedOutcome.odds})
            </p>
          </div>
        );
      })}
      <h4>Total odds</h4>
      <p>{bettingSlip.totalOdds}</p>

      <h4>Potential winnings</h4>
      <p>${bettingSlip.potentialWinnings}</p>
      <TextInput
        label="Betting amount ($)"
        value={bettingSlip.betAmount}
        onChange={(e) => updateBettingAmount(e.target.value)}
      />
      <Button
        disabled={bettingSlip.events.length < 1 || bettingSlip.betAmount < 1}
        label="Place the bet!"
        color="secondary"
        clickHandler={() => createBettingSlip()}
      />
      <Button
        label="Clear the slip"
        color="primary"
        clickHandler={() => clearBettingSlip()}
      />
      {bettingSlip.error && <p>{bettingSlip.error}</p>}
    </div>
  );
}
