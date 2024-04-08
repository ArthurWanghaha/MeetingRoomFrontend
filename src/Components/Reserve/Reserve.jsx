import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Pagination from "../Pagination/Pagination";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { List, ListItem, ListItemText } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import api from "../../api/axiosConfig";
import { jwtDecode } from "jwt-decode";

import bearGIF from "../../Images/bear-cute.gif";
import { MeetingRoom } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  image: {
    width: "100%",
    height: "auto",
    marginBottom: theme.spacing(1),
  },
  card: {},
}));

const Reserve = ({
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  handleSearchMeeting,
}) => {
  console.log("test4", selectedStartTime);

  const classes = useStyles();
  const [meetingRooms, setMeetingRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;
  const [totalPages, setTotalPages] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showBookOverlay, setShowBookOverlay] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };
  const [bookings, setBookings] = useState([]);
  const [bookingData, setBookingData] = useState({
    booker: "",
    meetingTitle: "",
    meetingRoom: "", //
    date: formatDateToYYYYMMDD(new Date()),
    meetingDescription: "",
    startingTime: "",
    endingTime: "",
    uploadedFiles: [],
    participants: [],
    teams: [],
  });

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    // Update bookingData.date whenever selectedDate changes
    setBookingData({ ...bookingData, date: selectedDate });
  }, [selectedDate]); // Run whenever selectedDate changes

  useEffect(() => {
    console.log("Selected start time changed:", selectedStartTime);
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      startingTime: selectedStartTime,
    }));
  }, [selectedStartTime, selectedEndTime]);

  useEffect(() => {
    console.log("Selected end time changed:", selectedEndTime);
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      endingTime: selectedEndTime,
    }));
  }, [selectedEndTime, selectedStartTime]);

  const renderTimeFieldMessage = () => {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6">
          Please adjust the timefields to view available meeting rooms.
        </Typography>
        <div className={classes.gifContainer}>
          <img src={bearGIF} alt="Bear GIF" />
        </div>
      </Paper>
    );
  };

  useEffect(() => {
    // Update bookingData.endingTime whenever selectedEndTime changes
    handleSearch(
      bookingData.startingTime,
      bookingData.endingTime,
      bookingData.date
    );
  }, [handleSearchMeeting]); // Run whenever selectedEndTime changes

  const token = localStorage.getItem("token");

  console.log("startingTime", bookingData.startingTime);
  console.log("endingTime", bookingData.endingTime);
  console.log("date", bookingData.date);
  console.log("handleSearchMeeting", handleSearchMeeting);

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

  const handleSearch = async (startTime, endTime, date) => {
    console.log("thistest");
    try {
      const response = await api.get(`/api/meeting-rooms/available`, {
        params: {
          startingTime: startTime,
          endingTime: endTime,
          date: date,
        },
      });

      const availableMeetingRooms = response.data;
      setMeetingRooms(availableMeetingRooms);
      setTotalPages(Math.ceil(availableMeetingRooms.length / roomsPerPage));
    } catch (error) {
      console.error("Error fetching available meeting rooms:", error.message);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await api.get(`/api/${userId}/user-details`); // Replace `${userId}` with the actual user ID
      const userDetails = response.data;
      setBookingData({ ...bookingData, booker: userDetails.username }); // Set the booker's username in bookingData
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleBookVenue = async () => {
    // Check if any required fields are empty
    if (!bookingData.meetingTitle || !bookingData.meetingDescription) {
      alert("Please fill out all required fields before booking.");
      return;
    }

    try {
      const response = await api.post("/bookings/create", bookingData);
      console.log("Booking created successfully:", response.data);
      console.log(bookingData);
      alert("Booking Successful");
    } catch (error) {
      console.error("Error creating booking:", error.message);
    }
  };

  const handleBookingDataChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handleSeeMore = (meetingRoom) => {
    // Display the overlay
    setShowOverlay(true);

    // Set the selected room in the state
    setSelectedRoom(meetingRoom);

    // Extract roomName and date from the selectedRoom
    const { name } = meetingRoom;
    const { date } = bookingData;

    // Make API call to fetch bookings for the selected room and date
    api
      .get(`/bookings/room/${name}/date/${date}`)
      .then((response) => {
        // On successful API response, update the bookings state with the retrieved data
        setBookings(response.data);
        console.log("test2", bookings);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        // Optionally handle errors here
      });
    console.log("test1", bookings);
  };

  const handleBook = (meetingRoom) => {
    setShowBookOverlay(true);
    setBookingData({ ...bookingData, meetingRoom: meetingRoom.name });
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleCloseBookOverlay = () => {
    setShowBookOverlay(false);
  };

  const handleDeleteTeam = (index) => {
    const updatedTeams = [...bookingData.teams];
    updatedTeams.splice(index, 1); // Remove the team at the specified index
    setBookingData({ ...bookingData, teams: updatedTeams });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddParticipant = () => {
    const updatedParticipants = [...bookingData.participants, ""]; // Add an empty string for a new participant
    setBookingData({ ...bookingData, participants: updatedParticipants });
  };

  const handleDeleteParticipant = (index) => {
    const updatedParticipants = [...bookingData.participants];
    updatedParticipants.splice(index, 1); // Remove the team at the specified index
    setBookingData({ ...bookingData, participants: updatedParticipants });
  };

  const handleAddTeam = () => {
    const updatedTeams = [...bookingData.teams, ""]; // Add an empty string for a new team
    setBookingData({ ...bookingData, teams: updatedTeams });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setBookingData({ ...bookingData, uploadedFiles: files });
  };

  const startIndex = (currentPage - 1) * roomsPerPage;
  const endIndex = startIndex + roomsPerPage;
  const displayedMeetingRooms = meetingRooms.slice(startIndex, endIndex);

  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <div className="header" style={{ borderBottom: "1px solid #a8a8a850" }}>
          <div className="title" style={{ fontSize: "1.3rem" }}>
            Reserve a Meeting
          </div>
        </div>
        {bookingData.startingTime || bookingData.endingTime
          ? ""
          : renderTimeFieldMessage()}

        <Grid container spacing={3}>
          {displayedMeetingRooms.map((meetingRoom) => (
            <Grid item xs={12} sm={6} md={4} key={meetingRoom.id}>
              <Paper className={`${classes.paper} ${classes.card}`}>
                <img
                  src={meetingRoom.image}
                  alt={meetingRoom.name}
                  className={classes.image}
                />
                <Typography variant="h6" gutterBottom>
                  {meetingRoom.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Size: {meetingRoom.size}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Location: {meetingRoom.location}
                </Typography>

                <div>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleSeeMore(meetingRoom)}
                  >
                    See More Information
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBook(meetingRoom)}
                    style={{ marginTop: "10px" }}
                  >
                    Book this Venue
                  </Button>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Paper>
      <Modal
        open={showOverlay}
        onClose={handleCloseOverlay}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className={`${classes.modalOverlay}`}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 600,
            maxHeight: "80vh", // Set maximum height to 80% of viewport height
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflowY: "auto", // Enable vertical scrolling if content overflows
          }}
        >
          {selectedRoom && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {selectedRoom.name}
              </Typography>
              <img
                src={selectedRoom.image}
                alt={selectedRoom.name}
                style={{ width: "100%", marginTop: "10px" }}
              />
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Location:</strong> {selectedRoom.location}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <strong>Size:</strong> {selectedRoom.size}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <strong>Info:</strong> {selectedRoom.info}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {bookingData.date.substring(0, 4)}/
                {bookingData.date.substring(4, 6)}/
                {bookingData.date.substring(6, 8)}'s Bookings:
              </Typography>
              {bookings && bookings.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Booker</TableCell>
                        <TableCell>Meeting Title</TableCell>
                        <TableCell>Starting Time</TableCell>
                        <TableCell>Ending Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.booker}</TableCell>
                          <TableCell>{booking.meetingTitle}</TableCell>
                          <TableCell>{booking.startingTime}</TableCell>
                          <TableCell>{booking.endingTime}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1">
                  There is no booking on this day yet.
                </Typography>
              )}
            </>
          )}
        </Box>
      </Modal>
      <Modal
        open={showBookOverlay}
        onClose={handleCloseBookOverlay}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 600,
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
          }}
        >
          {selectedRoom && (
            <>
              <Typography variant="h5" gutterBottom>
                Meeting Details
              </Typography>
              <Typography variant="h8" gutterBottom>
                Date: {bookingData.date.substring(0, 4)}/
                {bookingData.date.substring(4, 6)}/
                {bookingData.date.substring(6, 8)}
              </Typography>
              <br></br>
              <Typography variant="h8" gutterBottom>
                Time: {bookingData.startingTime.substring(0, 2)}:
                {bookingData.startingTime.substring(2, 4)}~
                {bookingData.endingTime.substring(0, 2)}:
                {bookingData.endingTime.substring(2, 4)}
              </Typography>
              <br></br>
              <Typography variant="h8" gutterBottom>
                Location: {selectedRoom.name}
              </Typography>
              <TextField
                label="Meeting Title"
                variant="outlined"
                fullWidth
                margin="normal"
                name="meetingTitle"
                value={bookingData.meetingTitle}
                onChange={handleBookingDataChange}
              />
              <TextField
                label="Meeting Description"
                variant="outlined"
                fullWidth
                margin="normal"
                name="meetingDescription"
                value={bookingData.meetingDescription}
                onChange={handleBookingDataChange}
              />
              <Typography variant="h6" gutterBottom>
                Upload Files
              </Typography>
              <input type="file" onChange={handleFileChange} multiple />
              <Typography variant="h6" gutterBottom>
                Add Participants
              </Typography>
              {bookingData.participants.map((participant, index) => (
                <TextField
                  key={index}
                  label={`Participant ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={participant}
                  onChange={(e) => {
                    const updatedParticipants = [...bookingData.participants];
                    updatedParticipants[index] = e.target.value;
                    setBookingData({
                      ...bookingData,
                      participants: updatedParticipants,
                    });
                  }}
                />
              ))}
              <Box sx={{ display: "flex", marginTop: "20px" }}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#C5EEF2", marginRight: "10px" }}
                  onClick={handleAddParticipant}
                >
                  + Add Participant
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#f2c5ee" }}
                  onClick={handleDeleteParticipant}
                >
                  - Delete Participant
                </Button>
              </Box>

              <Typography
                variant="h6"
                gutterBottom
                style={{ marginTop: "20px" }}
              >
                Add Teams
              </Typography>
              {bookingData.teams.map((team, index) => (
                <TextField
                  key={index}
                  label={`Team ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={team}
                  onChange={(e) => {
                    const updatedTeams = [...bookingData.teams];
                    updatedTeams[index] = e.target.value;
                    setBookingData({ ...bookingData, teams: updatedTeams });
                  }}
                />
              ))}
              <Box sx={{ display: "flex", marginTop: "20px" }}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#C5EEF2", marginRight: "10px" }}
                  onClick={handleAddTeam}
                >
                  + Add Team
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#f2c5ee" }}
                  onClick={handleDeleteTeam}
                >
                  - Delete Team
                </Button>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBookVenue}
                >
                  Book This Venue
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Reserve;
