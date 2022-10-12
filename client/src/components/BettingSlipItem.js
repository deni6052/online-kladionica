import React from "react";
import "./BettingSlipItem.css";
export default function BettingSlipItem({
  bettingSlip: { betAmount, totalOdds, potentialWinnings, status },
}) {
  return (
    <p className="card betting-slip-item">
      <span>
        <b>Bet amount:</b>${betAmount.toFixed(2)}
      </span>
      <span>
        {" "}
        <b>Total odds:</b>
        {totalOdds.toFixed(2)}
      </span>
      <span>
        {" "}
        <b>Potential winnings:</b>${potentialWinnings.toFixed(2)}
      </span>
      <span>
        {" "}
        <b>Status:</b>
        {status.replace("_", " ")}
      </span>
    </p>
  );
}
