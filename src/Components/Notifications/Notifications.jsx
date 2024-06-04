import React, { useState } from "react";
import { Paper, Button, Menu, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationBar from "./NotificationBar";
import "./Notifications.css";

export default function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="notifications">
      <Paper elevation={3}>
        <div className="header">
          <div className="title">Notifications</div>
          <div className="progress-right">
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              Sort By <ExpandMoreIcon />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Date of Activity</MenuItem>
              <MenuItem onClick={handleClose}>Name of Activity</MenuItem>
              <MenuItem onClick={handleClose}>Place</MenuItem>
            </Menu>
          </div>
        </div>
      </Paper>

      <div style={{ marginTop: "25px" }}>
        <NotificationBar imgcolor="green" title="New Acquisition Process" />
        <NotificationBar imgcolor="yellow" title="Completed Form" />
        <NotificationBar imgcolor="yellow" title="Corrected Form" />
        <NotificationBar imgcolor="green" title="New Acquisition" />
        <NotificationBar imgcolor="yellow" title="Completed Form" />
        <NotificationBar imgcolor="yellow" title="Corrected Form" />
        <NotificationBar imgcolor="green" title="New Acquisition" />
      </div>
    </div>
  );
}
