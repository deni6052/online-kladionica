import { useEffect, useState } from "react";
import TextInput from "./TextInput";
import "./SportEventForm.css";
import Button from "./Button";
import http from "../libs/http";

export default function SportEventForm({ outcomes, sportId }) {
  const getInitialEvent = (outcomes) => {
    return {
      firstCompetitor: "",
      secondCompetitor: "",
      sportId,
      outcomes: outcomes.map((outcome) => {
        return { ...outcome, odds: 1 };
      }),
    };
  };
  const [newEvent, setNewEvent] = useState(getInitialEvent(outcomes));

  useEffect(() => {
    setNewEvent((prevState) => {
      return {
        ...prevState,
        sportId,
        outcomes: outcomes.map((outcome) => {
          return { ...outcome, odds: 1 };
        }),
      };
    });
  }, [outcomes, sportId]);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setNewEvent((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleOutcomeChange = (event) => {
    const { value, name } = event.target;
    setNewEvent((prevState) => {
      const outcomes = prevState.outcomes;
      outcomes[name].odds = value;

      return { ...prevState, outcomes };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await http.post("/api/sport_events", newEvent);
    setNewEvent(getInitialEvent(outcomes));
  };

  return (
    <form className="card sport-event-form" onSubmit={handleSubmit}>
      <TextInput
        required={true}
        name="firstCompetitor"
        value={newEvent.firstCompetitor}
        onChange={handleChange}
        label="First competitor"
      ></TextInput>
      <TextInput
        required={true}
        name="secondCompetitor"
        value={newEvent.secondCompetitor}
        onChange={handleChange}
        label="Second competitor"
      ></TextInput>
      <div className="event-form-odds">
        {newEvent.outcomes.map((outcome, i) => {
          return (
            <TextInput
              step="0.01"
              type="number"
              min={1}
              key={i}
              name={i}
              value={outcome.odds}
              onChange={handleOutcomeChange}
              label={outcome.label}
            ></TextInput>
          );
        })}
      </div>
      <Button type="submit" label="Create" color="primary"></Button>
    </form>
  );
}
