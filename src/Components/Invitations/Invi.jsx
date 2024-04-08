import React, { useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { createTheme } from "@material-ui/core/styles";
import SwapCallsIcon from "@material-ui/icons/SwapCalls";
import AddIcon from "@material-ui/icons/Add";
import CallMergeIcon from "@material-ui/icons/CallMerge";
import LockIcon from "@material-ui/icons/Lock";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@material-ui/icons/Person";
import { ThemeProvider } from "@material-ui/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffcf33",
    },
    secondary: {
      main: "#71D875",
    },
  },
});

export default function Invi({ progress }) {
  return (
    <ThemeProvider theme={theme}>
      <div className="tracker">
        <div className="tracker-left">
          <div className="tracker-title">Meeting With The Sales Team</div>
        </div>

        <div className="tracker-mid">
          <div className="tracker-info">
            <div className="tracker-info-1">
              <LocationOnIcon style={{ marginRight: "8px" }} /> Location :
              Meeting Room 1
            </div>
            <div className="tracker-info-1">
              <AccessTimeIcon style={{ marginRight: "8px" }} /> 10:00 ~ 12:00
            </div>
            <div className="tracker-info-1">
              <PersonIcon style={{ marginRight: "8px" }} /> Host : CAPD
              Department
            </div>
          </div>
        </div>

        <div className="tracker-right">
          <AddIcon fontSize="large" />
        </div>
      </div>
    </ThemeProvider>
  );
}
