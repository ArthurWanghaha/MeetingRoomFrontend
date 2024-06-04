import React from "react";
import { Paper, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Note1 from "../../Images/note1.png";
import Note2 from "../../Images/note2.png";

export default function NotificationBar({ imgcolor, title }) {
  return (
    <Paper
      elevation={3}
      className="notifications-box"
      style={{ transition: "0.5s" }}
    >
      <img src={imgcolor === "green" ? Note1 : Note2} alt="Notification" />
      <div className="notification-text">
        <div
          style={{
            color: "#5e6473",
            textAlign: "left",
            minWidth: "180px",
            maxWidth: "180px",
            marginLeft: "20px",
          }}
        >
          {title}
        </div>
        <div
          className="tracker-para"
          style={{ color: "black", marginLeft: "20px" }}
        >
          20 Jan 2021, 15:39
        </div>
      </div>
      <Button
        className="notification-button"
        variant="contained"
        color="primary"
        style={{ padding: "1rem" }}
      >
        View & Confirm
        <ArrowForwardIosIcon className="notification-arrow" />
      </Button>
    </Paper>
  );
}
