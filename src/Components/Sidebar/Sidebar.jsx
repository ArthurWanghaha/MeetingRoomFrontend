// Sidebar.js

import React, { useEffect, useState } from "react";
import Logo from "../../Images/logo.png";
import MenuIcon from "@material-ui/icons/Menu";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import HomeIcon from "@material-ui/icons/Home";
import TimelineIcon from "@material-ui/icons/Timeline";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import GroupIcon from "@material-ui/icons/Group";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import FolderIcon from "@material-ui/icons/Folder";
import PersonIcon from "@material-ui/icons/Person";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import SettingsIcon from "@material-ui/icons/Settings";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check user authentication status here (e.g., using a token stored in localStorage)
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Update isLoggedIn based on token presence
  }, []);

  const handleLogout = () => {
    // Implement logout functionality here (e.g., clear localStorage)
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("Logout successful");
    window.location.reload(); // Refresh the page after logout
  };

  return (
    <div className="sidebar">
      <div className="sidebar-head">
        <img src={Logo} id="sidebar-logo" className="small-logo" />
        <MenuIcon fontSize="large" style={{ color: "white" }} />
      </div>
      <div className="sidebar-list-1">
        <NavLink to="/" activeClassName="sidebar-selected" exact>
          <div className="sidebar-item">
            <DashboardIcon className="sidebar-icons" /> Dashboard{" "}
          </div>
        </NavLink>
        <NavLink to="/invitations" activeClassName="sidebar-selected">
          <div className="sidebar-item">
            <ImportContactsIcon className="sidebar-icons" /> Invitations
          </div>
        </NavLink>
        <NavLink to="/files" activeClassName="sidebar-selected">
          <div className="sidebar-item">
            <FolderIcon className="sidebar-icons" /> Files Archive
          </div>
        </NavLink>
        <NavLink to="/teams" activeClassName="sidebar-selected">
          <div className="sidebar-item">
            <GroupIcon className="sidebar-icons" /> Teams
          </div>
        </NavLink>
        <NavLink to="/notifications" activeClassName="sidebar-selected">
          <div className="sidebar-item">
            <NotificationsIcon className="sidebar-icons" /> Notifications
          </div>
        </NavLink>
        <NavLink to="/schedule" activeClassName="sidebar-selected">
          <div className="sidebar-item">
            <CalendarTodayIcon className="sidebar-icons" /> Meeting Schedule
          </div>
        </NavLink>
      </div>
      <div className="seprator"></div>
      <div className="sidebar-list-1">
        <NavLink to="/reserve" activeClassName="sidebar-selected">
          <div className="sidebar-item">
            <DashboardIcon className="sidebar-icons" /> Reserve Meetings
          </div>
        </NavLink>
        <NavLink to="/edit-meetings" activeClassName="sidebar-selected">
          <div className="sidebar-item">
            <DonutLargeIcon className="sidebar-icons" /> Edit Reserved Meetings
          </div>
        </NavLink>
      </div>
      <div className="seprator"></div>
      <div className="sidebar-list-1">
        <NavLink to="/settings" activeClassName="sidebar-selected">
          <div className="sidebar-item">
            <PersonIcon className="sidebar-icons" /> Profile
          </div>
        </NavLink>
        <NavLink to="/settings" activeClassName="sidebar-selected">
          <div className="sidebar-item">
            <SettingsIcon className="sidebar-icons" /> Personal Settings
          </div>
        </NavLink>
        {isLoggedIn ? (
          <div className="sidebar-item" onClick={handleLogout}>
            <PowerSettingsNewIcon className="sidebar-icons" /> Logout
          </div>
        ) : (
          <NavLink to="/login">
            <div className="sidebar-item" style={{ marginBottom: "40px" }}>
              <PowerSettingsNewIcon className="sidebar-icons" /> Login
            </div>
          </NavLink>
        )}
      </div>
    </div>
  );
}
