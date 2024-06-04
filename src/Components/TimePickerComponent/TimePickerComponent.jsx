import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import "./TimePickerComponent.css";

export default function TimePickerValue({ onTimeChange, onSearch }) {
  const currentTime = dayjs();
  const roundedMinutes = Math.ceil(currentTime.minute() / 15) * 15; // Round up to nearest 15 minutes
  const initialStartTime = currentTime
    .startOf("hour")
    .add(roundedMinutes, "minutes");

  const formatTimeToHHmm = (time) => {
    return time.format("HHmm"); // Format time as HHmm
  };

  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(dayjs(startTime));
  const [startTimeChanged, setStartTimeChanged] = useState(false); // Track if start time has been changed
  const [endTimeChanged, setEndTimeChanged] = useState(false); // Track if end time has been changed
  const [searchEnabled, setSearchEnabled] = useState(false);

  useEffect(() => {
    // Enable search button only if start time and end time have been changed
    setSearchEnabled(startTimeChanged || endTimeChanged);
  }, [startTimeChanged, endTimeChanged]);

  const handleStartTimeChange = (newStartTime) => {
    const formattedStartTime = formatTimeToHHmm(newStartTime);
    setStartTime(newStartTime);
    setStartTimeChanged(true); // Indicate that start time has been changed

    // Ensure the ending time is at least 15 minutes after the new start time
    if (dayjs(newStartTime).isAfter(endTime)) {
      const newEndTime = dayjs(newStartTime).add(15, "minutes");
      setEndTime(newEndTime);
      onTimeChange(formattedStartTime, formatTimeToHHmm(newEndTime));
    } else {
      onTimeChange(formattedStartTime, formatTimeToHHmm(endTime));
    }
  };

  const handleEndTimeChange = (newEndTime) => {
    const formattedEndTime = formatTimeToHHmm(newEndTime);
    setEndTime(newEndTime);
    setEndTimeChanged(true); // Indicate that end time has been changed

    // Ensure the difference between end time and start time is at least 15 minutes
    if (
      dayjs(newEndTime).diff(startTime, "minutes") >= 15 &&
      dayjs(newEndTime).isAfter(startTime)
    ) {
      onTimeChange(formatTimeToHHmm(startTime), formattedEndTime);
    } else {
      const newStartTime = dayjs(newEndTime).subtract(15, "minutes");
      setStartTime(newStartTime);
      onTimeChange(formatTimeToHHmm(newStartTime), formattedEndTime);
    }
  };

  const handleSearch = () => {
    // Trigger the onSearch function with selected start time, end time, and date
    const date = dayjs().format("YYYYMMDD"); // Get current date
    onSearch(formatTimeToHHmm(startTime), formatTimeToHHmm(endTime), date);
  };

  return (
    <div className="timepicker-container">
      <Paper elevation={3}>
        <div className="header" style={{ borderBottom: "1px solid #a8a8a850" }}>
          <div className="title" style={{ fontSize: "1rem" }}>
            Select Your Meeting Time
          </div>
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="timepicker-wrapper">
            <div className="timepicker-column">
              <TimePicker
                label="Starting Time"
                value={startTime}
                onChange={handleStartTimeChange}
                ampm={false}
                minutesStep={15} // Set step to 15 minutes
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ borderColor: startTimeChanged ? "black" : "red" }}
                  />
                )}
              />
            </div>
            <div className="timepicker-column">
              <TimePicker
                label="Ending Time"
                value={endTime}
                onChange={handleEndTimeChange}
                ampm={false}
                minutesStep={15} // Set step to 15 minutes
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ borderColor: endTimeChanged ? "black" : "red" }}
                  />
                )}
              />
            </div>
            <div className="timepicker-column search-button">
              {searchEnabled && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  fullWidth
                >
                  Search
                </Button>
              )}
            </div>
          </div>
        </LocalizationProvider>
      </Paper>
    </div>
  );
}
