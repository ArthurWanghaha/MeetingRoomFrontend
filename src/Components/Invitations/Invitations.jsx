import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Paper } from "@mui/material";
import "./Invitations.css";
import api from "../../api/axiosConfig";
import PersonIcon from "@mui/icons-material/Person";
import RoomIcon from "@mui/icons-material/Room";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PendingIcon from "@mui/icons-material/Pending";

const Invitation = () => {
  const [invitations, setInvitations] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const getUserIdFromToken = (token) => {
    if (typeof token === "string") {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;
    } else {
      console.error("Token is not a string:", token);
      return null;
    }
  };

  const userId = getUserIdFromToken(token);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserDetails = async () => {
        try {
          const response = await api.get(`/api/${userId}/user-details`);
          const userDetails = response.data;
          setCurrentUser(userDetails.username);
          fetchInvitations(userDetails.username); // Fetch invitations once user details are fetched
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    } else {
      // If the user is logged out, set the username to 'Logged out user'
      setCurrentUser("Logged out user");
    }
  }, [isLoggedIn, userId]);

  const fetchInvitations = async (username) => {
    try {
      console.log("Fetching invitations for user:", username);
      const response = await api.get(`/invitations/participant/${username}`);
      const sortedInvitations = response.data.sort((a, b) =>
        a.status === "Pending" ? -1 : b.status === "Pending" ? 1 : 0
      );
      setInvitations(sortedInvitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/invitations/update/${id}/${status}`);
      fetchInvitations(currentUser); // Refresh the invitations after updating
    } catch (error) {
      console.error("Error updating invitation status:", error);
    }
  };

  const formatDate = (dateStr) => {
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    return `${year}/${month}/${day}`;
  };

  const formatTime = (timeStr) => {
    const hours = timeStr.slice(0, 2);
    const minutes = timeStr.slice(2, 4);
    return `${hours}:${minutes}`;
  };

  return (
    <div className="invitation-container">
      <Paper elevation={3} className="invitation-paper">
        <div className="header" style={{ borderBottom: "1px solid #a8a8a850" }}>
          <div className="title-invi">My Invitations</div>
        </div>
        {invitations.length === 0 ? (
          <p>No invitations found.</p>
        ) : (
          invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="invitation-card"
              style={{
                opacity: invitation.status !== "Pending" ? 0.6 : 1,
              }}
            >
              <div className="invitation-status">
                {invitation.status === "Pending" ? (
                  <PendingIcon />
                ) : (
                  <AssignmentTurnedInIcon />
                )}{" "}
                {invitation.status}
              </div>
              <h2 className="meeting-title-s">{invitation.meetingTitle}</h2>
              <div className="invitation-details">
                <div className="details-column">
                  <p>
                    <PersonIcon /> {invitation.booker}
                  </p>
                  <p>
                    <RoomIcon /> {invitation.meetingRoom}
                  </p>
                </div>
                <div className="details-column">
                  <p>
                    <DateRangeIcon /> {formatDate(invitation.date)}
                  </p>
                  <p>
                    <AccessTimeIcon /> {formatTime(invitation.startingTime)} -{" "}
                    {formatTime(invitation.endingTime)}
                  </p>
                </div>
                <div className="details-column">
                  <button
                    onClick={() =>
                      handleStatusChange(invitation.id, "Accepted")
                    }
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(invitation.id, "Declined")
                    }
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </Paper>
    </div>
  );
};

export default Invitation;
