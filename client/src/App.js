import logo from "./logo.svg";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  redirect,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./views/Dashboard";
import BettingSlips from "./views/BettingSlips";
import Login from "./views/Login";
import SportEvents from "./views/SportEvents";

import Navigation from "./components/Navigation";
import http from "./http";
import React, { useState } from "react";
import Register from "./views/Register";

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

      {/* <div>
        <p>⚽🎾</p>
        <button>Login</button>
        <br />
        <button>Logout</button>
      </div> */}
      <main>
        <Routes>
          <Route exact path="/" element={<Dashboard />}></Route>
          <Route path="/betting-slips" element={<BettingSlips />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />

          <Route
            path="/manage-events"
            element={<SportEvents setToken={setToken} />}
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
