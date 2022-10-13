import React, { useEffect } from "react";
import Button from "../components/Button";
import SportEvent from "../components/SportEvent";
import SportEventForm from "../components/SportEventForm";
import SportSelector from "../components/SportSelector";
import http from "../libs/http";
import "./SportEvents.css";

export default function SportEvents({ onEventsPlayed }) {
  const [outcomes, setOutcomes] = React.useState([]);
  const [selectedSport, setSelectedSport] = React.useState();
  const [previousEvents, setPreviousEvents] = React.useState([]);

  const getPossibleOutcomes = async (sportId) => {
    const { data } = await http.get(`/api/sports/${sportId}/sport_outcomes`);
    return data.map((outcome) => {
      return {
        sportOutcomeId: outcome.id,
        odds: null,
        label: outcome.label,
      };
    });
  };
  const onSportSelect = async (sportId) => {
    setSelectedSport(sportId);
    const outcomes = await getPossibleOutcomes(sportId);
    setOutcomes(outcomes);
    getEvents(sportId);
  };

  const getEvents = async (sportId) => {
    const { data } = await http.get(
      `/api/sports/${sportId}/sport_events?finished=true`
    );
    setPreviousEvents(data);
  };

  const playEvents = async () => {
    await http.post("/api/sport_events/play");
    getEvents(selectedSport);
    onEventsPlayed();
  };
  return (
    <div className="page">
      <div>
        <SportSelector selectHandler={onSportSelect} />
        <SportEventForm outcomes={outcomes} sportId={selectedSport} />
      </div>
      <div className="card sport-events-additional">
        <h3>Additional actions</h3>
        <Button
          clickHandler={() => playEvents()}
          label="Resolve events"
          color="primary"
        />
      </div>
      <h3 className="card">Previous events</h3>
      <div></div>
      <div>
        {previousEvents.map((event, i) => {
          return (
            <SportEvent
              preview={true}
              key={i}
              event={event}
              upsertBettingSlipEvent={() => {}}
            />
          );
        })}
      </div>
    </div>
  );
}
