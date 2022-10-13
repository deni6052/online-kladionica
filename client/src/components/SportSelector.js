import { useEffect, useState } from "react";
import http from "../libs/http";
import Button from "./shared/Button";

export default function SportSelector({ selectHandler }) {
  const [selectedSport, setSelectedSport] = useState();
  const [sports, setSports] = useState([]);

  useEffect(() => {
    getSports();
  }, []);

  const getSports = async () => {
    const { data } = await http.get("/api/sports");
    setSports(data);
    if (!selectedSport) {
      setSelectedSport(data[0].id);
      selectHandler(data[0].id);
    }
  };

  const selectSport = (sportId) => {
    selectHandler(sportId);
    setSelectedSport(sportId);
  };

  return (
    <div className="card">
      {sports.map((sport, i) => (
        <Button
          key={i}
          label={sport.name}
          color={selectedSport === sport.id ? "secondary" : ""}
          clickHandler={() => selectSport(sport.id)}
        ></Button>
      ))}
    </div>
  );
}
