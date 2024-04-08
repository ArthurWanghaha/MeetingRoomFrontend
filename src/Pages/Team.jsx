import React, { useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import Navbar from "../Components/Navbar/Navbar";
import Calendar from "../Components/Calendar/Calendar";
import TeamsComponent from "../Components/Teams/Teams"; // Renamed import to avoid conflict

export default function Team() {
  useEffect(() => {
    var menu = document.getElementsByClassName("sidebar-item");
    for (var i = 0; i < menu.length; i++) {
      if (i !== 3) {
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
            <TeamsComponent /> {/* Updated component name */}
          </div>
          <div className="sm-container">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}
