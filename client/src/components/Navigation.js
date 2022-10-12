import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import "./Navigation.css";

export default function Navigation({ isAuthenticated, user, logout }) {
  return (
    <nav className="card navigation">
      <ul>
        <li>
          <NavLink end to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink end to="/betting-slips">
            My betting slips
          </NavLink>
        </li>
        <li>
          <NavLink end to="/manage-events">
            Manage sport events
          </NavLink>
        </li>
      </ul>
      {isAuthenticated ? (
        <ul>
          <li>{user.fullName}</li>
          <li>${user.currentBalance.toFixed(2)}</li>

          <li>
            <Button label="Logout" clickHandler={() => logout()} />
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <NavLink end to="/login">
              Login
            </NavLink>
          </li>
          <li>
            <NavLink end to="/register">
              Register
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
}
