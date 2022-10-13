import React from "react";
import { NavLink } from "react-router-dom";
import ActiveBettingSlip from "../components/ActiveBettingSlip";
import SportEvent from "../components/SportEvent";
import SportSelector from "../components/SportSelector";
import http from "../libs/http";
import "./Dashboard.css";
import { toast } from "react-toastify";

const getInitialBettingState = () => {
  return {
    betAmount: 0,
    events: [],
    totalOdds: 0,
    potentialWinnings: 0,
    error: "",
  };
};

export default function Dashboard({ onBet, isAuthenticated }) {
  const [events, setEvents] = React.useState([]);
  const [bettingSlip, setBettingSlip] = React.useState(
    getInitialBettingState()
  );

  const getEvents = async (sportId) => {
    const { data } = await http.get(`/api/sports/${sportId}/sport_events`);
    setEvents(data);
  };

  const calculateTotalOdds = (events) => {
    return events
      .reduce((product, { selectedOutcome }) => {
        return product * selectedOutcome.odds;
      }, 1)
      .toFixed(2);
  };

  const calculateWinnings = (betAmount, odds) => {
    return (betAmount * odds).toFixed(2);
  };

  const upsertBettingSlipEvent = (selectedEvent, selectedOutcome) => {
    setBettingSlip((prevState) => {
      const eventIndex = prevState.events.findIndex(
        (event) => event.selectedEvent.id === selectedEvent.id
      );
      // If event already selected update the outcome
      if (eventIndex > -1) {
        prevState.events[eventIndex].selectedOutcome = selectedOutcome;
      }
      // Otherwise add event and outcome
      else {
        prevState.events.push({ selectedEvent, selectedOutcome });
      }

      prevState.totalOdds = calculateTotalOdds(prevState.events);

      prevState.potentialWinnings = calculateWinnings(
        prevState.betAmount,
        prevState.totalOdds
      );
      return { ...prevState };
    });
  };

  const updateBettingAmount = (value) => {
    setBettingSlip({
      ...bettingSlip,
      betAmount: value,
      potentialWinnings: calculateWinnings(value, bettingSlip.totalOdds),
    });
  };

  const clearBettingSlip = () => {
    setBettingSlip(getInitialBettingState());
  };

  const createBettingSlip = async () => {
    const data = {
      betAmount: bettingSlip.betAmount,
      events: bettingSlip.events.map((event) => {
        return {
          selectedEventId: event.selectedEvent.id,
          outcomeId: event.selectedOutcome.sportOutcomeId,
        };
      }),
    };

    try {
      await http.post(`/api/betting_slips`, data);
      clearBettingSlip();
      onBet();
      toast("Bet successfully placed");
    } catch (error) {
      if (error.response.status === 400) {
        setBettingSlip({ ...bettingSlip, error: error.response.data.message });
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="sport-event-list">
        <SportSelector selectHandler={getEvents}></SportSelector>
        {events.length < 1 && (
          <h3 className="card">No events currently active</h3>
        )}
        {events.map((event, i) => {
          return (
            <SportEvent
              key={i}
              event={event}
              upsertBettingSlipEvent={upsertBettingSlipEvent}
              preview={!isAuthenticated}
            />
          );
        })}
      </div>
      {isAuthenticated ? (
        <ActiveBettingSlip
          bettingSlip={bettingSlip}
          clearBettingSlip={clearBettingSlip}
          createBettingSlip={createBettingSlip}
          updateBettingAmount={updateBettingAmount}
        ></ActiveBettingSlip>
      ) : (
        <div className="card">
          <NavLink end to="/login">
            <h3>Log in to start betting</h3>
          </NavLink>
        </div>
      )}
    </div>
  );
}
