import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

export default function Navigation() {
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
      <ul>
        <li>
          <NavLink end to="/login">
            Login
          </NavLink>
        </li>
        <li>
          <NavLink end to="/Register">
            Register
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
