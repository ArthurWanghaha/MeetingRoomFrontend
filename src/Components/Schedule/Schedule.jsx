import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import "./Schedule.css";
import api from "../../api/axiosConfig";
import { Paper, Typography, Button, ButtonGroup } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import RoomIcon from "@mui/icons-material/Room";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { fontSize } from "@mui/system";

const MeetingSchedule = () => {
  const [todaysMeetings, setTodaysMeetings] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [showTodayMeetings, setShowTodayMeetings] = useState(true);

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
          fetchMeetings(userDetails.username); // Fetch meetings once user details are fetched
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

  const fetchMeetings = async (username) => {
    try {
      const response = await api.get(
        `/invitations/participant/${username}/accepted-future`
      );
      const allMeetings = response.data;

      const today = dayjs().format("YYYYMMDD");
      const todayMeetings = allMeetings.filter(
        (meeting) => meeting.date === today
      );
      const futureMeetings = allMeetings.filter(
        (meeting) => meeting.date !== today
      );

      setTodaysMeetings(todayMeetings);
      setUpcomingMeetings(futureMeetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const fetchMeetingRoomDetails = async (roomName) => {
    try {
      const response = await api.get(`/api/meeting-rooms/name/${roomName}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching meeting room details:", error);
      return null;
    }
  };

  return (
    <div className="meeting-schedule-container">
      <Paper elevation={3} className="invitation-paper">
        <div
          className="header"
          style={{
            paddingTop: "0px",
            marginBottom: "0px",
            borderBottom: "1px solid #a8a8a850",
          }}
        >
          <Typography
            variant="h4"
            className="title"
            style={{ fontSize: "1.1rem", padding: "0px 0" }}
          >
            My Meeting Schedule
          </Typography>
        </div>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          style={{ margin: "10px 0" }}
        >
          <Button
            variant={showTodayMeetings ? "contained" : "outlined"}
            onClick={() => setShowTodayMeetings(true)}
          >
            Today's Meetings
          </Button>
          <Button
            variant={!showTodayMeetings ? "contained" : "outlined"}
            onClick={() => setShowTodayMeetings(false)}
          >
            Upcoming Meetings
          </Button>
        </ButtonGroup>

        {showTodayMeetings ? (
          <div className="meeting-section">
            <Typography
              variant="h5"
              className="meeting-section-title"
              style={{ fontSize: "1.1rem", padding: "5px 0" }}
            >
              Today's Meetings
            </Typography>
            {todaysMeetings.length === 0 ? (
              <Typography>No meetings today.</Typography>
            ) : (
              todaysMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  fetchMeetingRoomDetails={fetchMeetingRoomDetails}
                />
              ))
            )}
          </div>
        ) : (
          <div className="meeting-section">
            <Typography
              variant="h5"
              className="meeting-section-title"
              style={{ fontSize: "1.1rem", padding: "5px 0" }}
            >
              Upcoming Meetings
            </Typography>
            {upcomingMeetings.length === 0 ? (
              <Typography>No upcoming meetings found.</Typography>
            ) : (
              upcomingMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  fetchMeetingRoomDetails={fetchMeetingRoomDetails}
                />
              ))
            )}
          </div>
        )}
      </Paper>
    </div>
  );
};

const MeetingCard = ({ meeting, fetchMeetingRoomDetails }) => {
  const [meetingRoom, setMeetingRoom] = useState(null);

  useEffect(() => {
    const loadMeetingRoomDetails = async () => {
      const roomDetails = await fetchMeetingRoomDetails(meeting.meetingRoom);
      setMeetingRoom(roomDetails);
    };
    loadMeetingRoomDetails();
  }, [fetchMeetingRoomDetails, meeting.meetingRoom]);

  return (
    <div className="meeting-card">
      {meetingRoom && (
        <img
          src={meetingRoom.image}
          alt={meetingRoom.name}
          className="meeting-room-image"
        />
      )}
      <div className="meeting-details">
        <Typography
          variant="h5"
          style={{
            fontFamily: "Baskerville, serif",
            marginBottom: "10px",
            fontSize: "30px",
          }}
        >
          {meeting.meetingTitle}
        </Typography>
        <Typography className="meeting-detail-item" style={{ opacity: 0.85 }}>
          <PersonIcon /> {meeting.booker}
        </Typography>
        <Typography className="meeting-detail-item" style={{ opacity: 0.85 }}>
          <RoomIcon /> {meeting.meetingRoom}
        </Typography>
        <Typography className="meeting-detail-item" style={{ opacity: 0.85 }}>
          <DateRangeIcon /> {dayjs(meeting.date).format("YYYY/MM/DD")}
        </Typography>
        <Typography className="meeting-detail-item" style={{ opacity: 0.85 }}>
          <AccessTimeIcon /> {meeting.startingTime} - {meeting.endingTime}
        </Typography>
      </div>
    </div>
  );
};

export default MeetingSchedule;
