import React, { Component } from "react";
import Button from "./Button";
import TextInput from "./TextInput";
import "./ActiveBettingSlip.css";
export default function ActiveBettingSlip(props) {
  return (
    <div className="card active-slip">
      <h3>Your betting slip</h3>
      {props.bettingSlip.events.map(({ selectedEvent, selectedOutcome }, i) => {
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
      <p>{props.bettingSlip.totalOdds}</p>

      <h4>Potential winnings</h4>
      <p>{props.bettingSlip.potentialWinnings}</p>
      <TextInput
        label="Betting amount"
        value={props.bettingSlip.betAmount}
        onChange={(e) => props.updateBettingAmount(e.target.value)}
      />
      <Button
        disabled={
          props.bettingSlip.events.length < 1 || props.bettingSlip.betAmount < 1
        }
        label="Place the bet!"
        color="secondary"
        clickHandler={() => props.createBettingSlip()}
      />
      <Button
        label="Clear the slip"
        color="primary"
        clickHandler={() => props.clearBettingSlip()}
      />
      {props.bettingSlip.error && <p>{props.bettingSlip.error}</p>}
    </div>
  );
}
