import React, { useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import Navbar from "../Components/Navbar/Navbar";
import Profile from "../Components/Profile/Profile";

export default function PersonalSettings() {
  useEffect(() => {
    var menu = document.getElementsByClassName("sidebar-item");
    for (var i = 0; i < menu.length; i++) {
      if (i != 9) {
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
        <div className="lg-mid-container">
          <div className="ok-container">
            <Profile />
          </div>
        </div>
      </div>
    </div>
  );
}
