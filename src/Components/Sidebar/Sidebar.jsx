import React, { useEffect, useState } from "react";
import Logo from "../../Images/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import HomeIcon from "@mui/icons-material/Home";
import TimelineIcon from "@mui/icons-material/Timeline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import SettingsIcon from "@mui/icons-material/Settings";
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
        <img src={Logo} id="sidebar-logo" className="small-logo" alt="Logo" />
        <MenuIcon fontSize="large" style={{ color: "white" }} />
      </div>
      <div className="sidebar-list-1">
        <NavLink to="/" activeClassName="sidebar-selected" exact>
          <div className="sidebar-item">
            <DashboardIcon className="sidebar-icons" /> Dashboard
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
        <NavLink to="/edit" activeClassName="sidebar-selected">
          <div className="sidebar-item">
            <DonutLargeIcon className="sidebar-icons" /> View Past Meetings
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
