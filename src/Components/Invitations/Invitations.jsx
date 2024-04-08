import React from "react";
import "./Invitations.css";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Invi from "./Invi.jsx";
import Pagination from "../Pagination/Pagination.jsx";

export default function Invitations() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="progress-tracker">
      <Paper elevation={3}>
        <div className="header">
          <div className="title">Meeting Invitations</div>
          <div className="progress-right">
            <div>
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
                <MenuItem onClick={handleClose}>Date of Meeting</MenuItem>
                <MenuItem onClick={handleClose}>Name of Meeting</MenuItem>
                <MenuItem onClick={handleClose}>Place</MenuItem>
              </Menu>
            </div>
          </div>
        </div>

        <Invi progress="39" />
        <Invi progress="93" />
        <Invi progress="51" />
        <Invi progress="73" />
        <Pagination />
      </Paper>
    </div>
  );
}
