import React from "react";
import { NavLink } from "react-router-dom";
import { FiList, FiClock, FiBarChart2, FiSettings } from "react-icons/fi";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">focus</div>
      <nav className="side-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `side-btn ${isActive ? "active" : ""}`}
          aria-label="tasks"
        >
          <FiList size={20} />
        </NavLink>
        <NavLink
          to="/timer"
          className={({ isActive }) => `side-btn ${isActive ? "active" : ""}`}
          aria-label="timer"
        >
          <FiClock size={20} />
        </NavLink>
        <NavLink
          to="/stats"
          className={({ isActive }) => `side-btn ${isActive ? "active" : ""}`}
          aria-label="stats"
        >
          <FiBarChart2 size={20} />
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `side-btn ${isActive ? "active" : ""}`}
          aria-label="settings"
        >
          <FiSettings size={20} />
        </NavLink>
      </nav>
    </aside>
  );
}
