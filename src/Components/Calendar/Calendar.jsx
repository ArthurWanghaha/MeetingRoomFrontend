import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { TextField, Paper } from "@mui/material";
import "./Calendar.css";

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="calendar-containers">
      <Paper elevation={3} className="calendar-paper">
        <Calendar
          onClickDay={handleDateClick}
          value={selectedDate}
          className="calendar"
        />
        <TextField
          label="Selected Date"
          value={selectedDate.toDateString()}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </Paper>
    </div>
  );
}
