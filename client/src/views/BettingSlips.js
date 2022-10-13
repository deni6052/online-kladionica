import { useState, useEffect } from "react";
import BettingSlipItem from "../components/BettingSlipItem";
import SportEvent from "../components/SportEvent";

import http from "../libs/http";
import "./BettingSlips.css";

export default function BettingSlips() {
  const [bettingSlips, setBettingSlips] = useState([]);
  const [slipEvents, setSlipEvents] = useState([]);

  useEffect(() => {
    getBettingSlips();
  }, []);

  const getBettingSlips = async () => {
    const { data } = await http.get("/api/betting_slips/me");
    setBettingSlips(data);
    if (data.length) {
      getEventsForSlip(data[0].id);
    }
  };

  const getEventsForSlip = async (selectedSlipId) => {
    const { data } = await http.get(
      `/api/betting_slips/${selectedSlipId}/events`
    );
    setSlipEvents(data);
  };

  const handleClick = (selectedSlipId) => {
    getEventsForSlip(selectedSlipId);
  };

  return (
    <div className="page betting-slips">
      {bettingSlips.length < 1 && (
        <h3 className="card">You haven't placed any bets</h3>
      )}
      <div>
        {bettingSlips.map((slip, i) => {
          return (
            <BettingSlipItem key={i} onClick={handleClick} bettingSlip={slip} />
          );
        })}
      </div>
      <div>
        {slipEvents.map((event, i) => {
          return <SportEvent key={i} event={event} preview={true} />;
        })}
      </div>
    </div>
  );
}
