import React from "react";
import Button from "../components/Button";
import "./SportEvents.css";

export default function SportEvents() {
  return (
    <div className="page">
      <div className="card"></div>
      <div className="card sport-events-additional">
        <h3>Additional actions</h3>
        <Button label="Resolve events" color="primary" />
      </div>
    </div>
  );
}
