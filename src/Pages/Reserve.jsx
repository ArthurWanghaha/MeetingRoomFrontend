import React, { useState } from "react";
import { useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import Navbar from "../Components/Navbar/Navbar";
import Calendar from "../Components/ReserveCalendar/ReserveCalendar";
import Reserve from "../Components/Reserve/Reserve";
import TimePickerComponent from "../Components/TimePickerComponent/TimePickerComponent";

const ReservePage = () => {
  useEffect(() => {
    var menu = document.getElementsByClassName("sidebar-item");
    for (var i = 0; i < menu.length; i++) {
      if (i != 6) {
        menu[i].classList.remove("sidebar-selected");
      } else {
        menu[i].classList.add("sidebar-selected");
      }
    }
  }, []);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [handleSearchMeeting, setHandleSearchMeeting] = useState(true);

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
      console.log("test3", date);
    }
  };

  const handleTimeChange = (startTime, endTime) => {
    if (startTime) {
      setSelectedStartTime(startTime);
      setSelectedEndTime(endTime);
    }
  };

  const handleSearchMeetings = (startTime, endTime, date) => {
    console.log("Searching for meetings between", startTime, "and", endTime);
    setHandleSearchMeeting(!handleSearchMeeting);
  };

  return (
    <div className="App">
      <Sidebar />
      <div className="container">
        <Navbar />
        <div className="lg-container">
          <div className="md-container">
            <Reserve
              selectedDate={selectedDate}
              selectedStartTime={selectedStartTime}
              selectedEndTime={selectedEndTime}
              handleSearchMeeting={handleSearchMeeting}
            />
          </div>
          <div className="sm-container">
            <Calendar onDateChange={handleDateChange} />
            <TimePickerComponent
              onTimeChange={handleTimeChange}
              onSearch={handleSearchMeetings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservePage;
