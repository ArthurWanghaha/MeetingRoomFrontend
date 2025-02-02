import React, { useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import Navbar from "../Components/Navbar/Navbar";
import Calendar from "../Components/Calendar/Calendar";
import Invitations from "../Components/Invitations/Invitations";

export default function Dashboard() {
  useEffect(() => {
    var menu = document.getElementsByClassName("sidebar-item");
    for (var i = 0; i < menu.length; i++) {
      if (i != 1) {
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
          </div>
          <div className="sm-container">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}
