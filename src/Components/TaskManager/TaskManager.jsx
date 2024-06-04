import React from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import "./TaskManager.css";

export default function TaskManager() {
  return (
    <div className="task-manager">
      <Paper elevation={3}>
        <div
          className="header"
          style={{
            paddingTop: "16px",
            marginBottom: "0px",
            borderBottom: "1px solid #a8a8a850",
          }}
        >
          <div className="title">Task Manager</div>
        </div>
        <div className="task-btn-cont">
          <div className="task-btn-cont-1">
            <Button
              variant="contained"
              className="task-btn"
              sx={{ marginBottom: 1 }}
            >
              Create New Task
            </Button>
          </div>
          <div className="task-btn-cont-1">
            <Button
              variant="contained"
              className="task-btn"
              sx={{ marginBottom: 1 }}
            >
              Assign Task
            </Button>
          </div>
          <div className="task-btn-cont-1">
            <Button
              variant="contained"
              className="task-btn"
              sx={{ marginBottom: 1 }}
            >
              End Task
            </Button>
          </div>
          <div className="task-btn-cont-1">
            <Button
              variant="contained"
              className="task-btn"
              sx={{ marginBottom: 1 }}
            >
              Remove Task
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}
