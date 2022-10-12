import React, { useState } from "react";
import BettingSlipItem from "../components/BettingSlipItem";
import http from "../http";
import "./BettingSlips.css";
export default function BettingSlips() {
  const [bettingSlips, setBettingSlips] = useState([]);

  const getBettingSlips = async () => {
    const { data } = await http.get("/api/betting_slips/me");
    setBettingSlips(data);
  };

  React.useEffect(() => {
    getBettingSlips();
  }, []);

  return (
    <div className="page">
      <div>
        {bettingSlips.map((slip) => {
          return <BettingSlipItem bettingSlip={slip} />;
        })}
      </div>
    </div>
  );
}
