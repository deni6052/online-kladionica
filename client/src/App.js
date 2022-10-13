import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./views/Dashboard";
import BettingSlips from "./views/BettingSlips";
import Login from "./views/Login";
import SportEvents from "./views/SportEvents";

import Navigation from "./components/Navigation";
import http from "./libs/http";
import React, { useState } from "react";
import Register from "./views/Register";
import GuardedRoute from "./guards/GuardedRoute";

function App() {
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setToken = async (token) => {
    localStorage.setItem("token", token);
    http.defaults.headers.Authorization = `Bearer ${token}`;
    await getLoggedInUser();
  };

  const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    http.defaults.headers.Authorization = `Bearer ${token}`;
    await getLoggedInUser();
  };

  const getLoggedInUser = async () => {
    const { data: user } = await http.get("/api/users/me");
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    delete http.defaults.headers.Authorization;
  };

  React.useEffect(() => {
    checkToken();
  }, []);

  return (
    <Router>
      <Navigation
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
      />
      <main>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Dashboard
                onBet={getLoggedInUser}
                isAuthenticated={isAuthenticated}
              />
            }
          ></Route>

          <Route
            exact
            path="/betting-slips"
            element={<GuardedRoute isAuthenticated={isAuthenticated} />}
          >
            <Route exact path="/betting-slips" element={<BettingSlips />} />
          </Route>
          <Route
            exact
            path="/manage-events"
            element={<GuardedRoute isAuthenticated={isAuthenticated} />}
          >
            <Route
              exact
              path="/manage-events"
              element={
                <SportEvents
                  setToken={setToken}
                  onEventsPlayed={getLoggedInUser}
                />
              }
            />
          </Route>

          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
