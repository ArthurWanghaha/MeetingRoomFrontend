import React, { useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import Navbar from "../Components/Navbar/Navbar";
import Invitations from "../Components/Invitations/Invitations";
import Calendar from "../Components/Calendar/Calendar";
import SmNotification from "../Components/SmNotification/SmNotification";
import Tasks from "../Components/Schedule/Schedule";
import Files from "../Components/Files/Files";
import Teams from "../Components/Teams/Teams";

export default function Dashboard() {
  useEffect(() => {
    var menu = document.getElementsByClassName("sidebar-item");
    for (var i = 0; i < menu.length; i++) {
      if (i != 0) {
        menu[i].classList.remove("sidebar-selected");
      } else {
        menu[i].classList.add("sidebar-selected");
      }
    }
  }, []);
  return (
    <div className="App">
      <Sidebar />
      <div className="container">
        <Navbar />
        <div className="lg-container">
          <div className="md-container">
            <Invitations />
            <Tasks rowNo="1" />
            <Files />
          </div>
          <div className="sm-container">
            <Calendar />
            <SmNotification />
            <Teams />
          </div>
        </div>
      </div>
    </div>
  );
}
