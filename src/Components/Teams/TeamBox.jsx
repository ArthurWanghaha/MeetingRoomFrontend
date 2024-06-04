import React from "react";
import Avatar from "@mui/material/Avatar";
import "./Teams.css";

export default function TeamBox({ title, image, name, children }) {
  return (
    <div className="team-box">
      <Avatar sx={{ height: 50, width: 50 }} src={image} />{" "}
      <div className="team-box-text">
        <div className="team-box-title">{name}</div>
        <div className="team-box-para">{title}</div>
      </div>
      {children}
    </div>
  );
}
