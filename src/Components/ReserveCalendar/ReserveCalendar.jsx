import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Paper from "@mui/material/Paper";
import "./ReserveCalendar.css";

const MyReserveCalendar = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    const formattedDate = formatDateToYYYYMMDD(date);
    setSelectedDate(formattedDate);
    onDateChange(formattedDate);
  };

  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const tileClassName = ({ date, view }) => {
    if (selectedDate && view === "month") {
      const formattedSelectedDate = formatDateToYYYYMMDD(date);
      return formattedSelectedDate === selectedDate ? "selected-day" : "";
    }
    return "";
  };

  return (
    <div className="calendar-container">
      <Paper elevation={3} className="calendar-paper">
        <div className="header">
          <div className="calendar-title" style={{ fontSize: "1rem" }}>
            Select Your Meeting Day
          </div>
        </div>
        <Calendar
          onClickDay={handleDateClick}
          value={selectedDate ? new Date(selectedDate) : null}
          tileClassName={tileClassName}
          className="calendar"
        />
      </Paper>
    </div>
  );
};

export default MyReserveCalendar;
