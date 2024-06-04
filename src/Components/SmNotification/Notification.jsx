import React from "react";
import { Paper } from "@mui/material";
import Note1 from "../../Images/note1.png";
import Note2 from "../../Images/note2.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function Notification({ imgcolor, title }) {
  return (
    <Paper
      elevation={3}
      className="notification"
      sx={{
        transition: "0.5s",
        display: "flex",
        alignItems: "center",
        padding: 2,
      }}
    >
      <img src={imgcolor === "green" ? Note1 : Note2} alt="Notification Icon" />
      <div className="notification-text" style={{ flexGrow: 1, marginLeft: 2 }}>
        <div
          style={{
            color: "#5e6473",
            textAlign: "left",
            minWidth: "180px",
            maxWidth: "180px",
          }}
        >
          {title}
        </div>
        <div className="tracker-para" style={{ color: "black" }}>
          20 Jan 2021, 15:39
        </div>
      </div>
      <ArrowForwardIosIcon sx={{ color: "#6A707E" }} />
    </Paper>
  );
}
