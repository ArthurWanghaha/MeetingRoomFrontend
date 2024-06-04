import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  Typography,
  TextField,
  Modal,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Pagination from "../Pagination/Pagination";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axiosConfig";
import bearGIF from "../../Images/bear-cute.gif";

const Root = styled("div")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Image = styled("img")({
  width: "100%",
  height: "auto",
  marginBottom: 16,
});

const GifContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 16,
});

const formatDateToYYYYMMDD = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

const Reserve = ({
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  handleSearchMeeting,
}) => {
  const [meetingRooms, setMeetingRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;
  const [totalPages, setTotalPages] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showBookOverlay, setShowBookOverlay] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [bookingData, setBookingData] = useState({
    booker: "",
    meetingTitle: "",
    meetingRoom: "",
    date: formatDateToYYYYMMDD(new Date()),
    meetingDescription: "",
    startingTime: "",
    endingTime: "",
    participants: [],
    teams: [],
  });

  useEffect(() => {
    fetchUserDetails();
    fetchTeams(bookingData.booker);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate;
      setBookingData((prevData) => ({
        ...prevData,
        date: formattedDate,
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedStartTime && selectedEndTime) {
      setBookingData((prevData) => ({
        ...prevData,
        startingTime: selectedStartTime,
        endingTime: selectedEndTime,
      }));
    }
  }, [selectedStartTime, selectedEndTime]);

  useEffect(() => {
    if (handleSearchMeeting) {
      handleSearch(
        bookingData.startingTime,
        bookingData.endingTime,
        bookingData.date
      );
    }
  }, [handleSearchMeeting]);

  const token = localStorage.getItem("token");

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

  const fetchUserDetails = async () => {
    try {
      const response = await api.get(`/api/${userId}/user-details`);
      const userDetails = response.data;
      setBookingData((prevData) => ({
        ...prevData,
        booker: userDetails.username,
      }));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchTeams = async (username) => {
    try {
      const response = await api.get(`/teams/member/${username}`);
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleSearch = async (startTime, endTime, date) => {
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

  const handleBookVenue = async () => {
    if (!bookingData.meetingTitle || !bookingData.meetingDescription) {
      alert("Please fill out all required fields before booking.");
      return;
    }

    try {
      const response = await api.post("/bookings/create", bookingData);
      alert("Booking Successful");
      handleCloseBookOverlay();
    } catch (error) {
      console.error("Error creating booking:", error.message);
    }
  };

  const handleBookingDataChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSeeMore = (meetingRoom) => {
    setShowOverlay(true);
    setSelectedRoom(meetingRoom);

    const { name } = meetingRoom;
    const { date } = bookingData;

    api
      .get(`/bookings/room/${name}/date/${date}`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  };

  const handleBook = (meetingRoom) => {
    setShowBookOverlay(true);
    setBookingData((prevData) => ({
      ...prevData,
      meetingRoom: meetingRoom.name,
    }));
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleCloseBookOverlay = () => {
    setShowBookOverlay(false);
  };

  const handleDeleteTeam = (index) => {
    const updatedTeams = [...bookingData.teams];
    updatedTeams.splice(index, 1);
    setBookingData((prevData) => ({
      ...prevData,
      teams: updatedTeams,
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddParticipant = () => {
    const updatedParticipants = [...bookingData.participants, ""];
    setBookingData((prevData) => ({
      ...prevData,
      participants: updatedParticipants,
    }));
  };

  const handleDeleteParticipant = () => {
    const updatedParticipants = [...bookingData.participants];
    updatedParticipants.pop();
    setBookingData((prevData) => ({
      ...prevData,
      participants: updatedParticipants,
    }));
  };

  const handleAddTeam = () => {
    const updatedTeams = [...bookingData.teams, ""];
    setBookingData((prevData) => ({
      ...prevData,
      teams: updatedTeams,
    }));
  };

  const startIndex = (currentPage - 1) * roomsPerPage;
  const endIndex = startIndex + roomsPerPage;
  const displayedMeetingRooms = meetingRooms.slice(startIndex, endIndex);

  const renderTimeFieldMessage = () => (
    <StyledPaper>
      <Typography variant="h6">
        Please adjust the time fields to view available meeting rooms.
      </Typography>
      <GifContainer>
        <img src={bearGIF} alt="Bear GIF" />
      </GifContainer>
    </StyledPaper>
  );

  return (
    <Root>
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
              <StyledPaper>
                <Image src={meetingRoom.image} alt={meetingRoom.name} />
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
              </StyledPaper>
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
              <Typography
                id="modal-modal-title"
                variant="h5"
                component="h2"
                style={{
                  borderBottom: "1px solid #a8a8a850",
                  fontFamily: "Playfair Display, serif",
                  fontStyle: "italic",
                }}
              >
                {selectedRoom.name}
              </Typography>

              <Image
                src={selectedRoom.image}
                alt={selectedRoom.name}
                style={{ width: "100%", marginTop: "10px" }}
              />

              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong style={{ fontFamily: "Playfair Display, serif" }}>
                  Location:
                </strong>{" "}
                {selectedRoom.location}
              </Typography>

              <Typography sx={{ mt: 2 }}>
                <strong style={{ fontFamily: "Playfair Display, serif" }}>
                  Size:
                </strong>{" "}
                {selectedRoom.size}
              </Typography>

              <Typography sx={{ mt: 2 }}>
                <strong style={{ fontFamily: "Playfair Display, serif" }}>
                  Info:
                </strong>{" "}
                {selectedRoom.info}
              </Typography>

              <Typography
                variant="h6"
                gutterBottom
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {bookingData.date.substring(0, 4)}/
                {bookingData.date.substring(4, 6)}/
                {bookingData.date.substring(6, 8)}'s Bookings:
              </Typography>

              {bookings && bookings.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{ fontFamily: "Playfair Display, serif" }}
                        >
                          Booker
                        </TableCell>
                        <TableCell
                          style={{ fontFamily: "Playfair Display, serif" }}
                        >
                          Meeting Title
                        </TableCell>
                        <TableCell
                          style={{ fontFamily: "Playfair Display, serif" }}
                        >
                          Starting Time
                        </TableCell>
                        <TableCell
                          style={{ fontFamily: "Playfair Display, serif" }}
                        >
                          Ending Time
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell
                            style={{ fontFamily: "Playfair Display, serif" }}
                          >
                            {booking.booker}
                          </TableCell>
                          <TableCell
                            style={{ fontFamily: "Playfair Display, serif" }}
                          >
                            {booking.meetingTitle}
                          </TableCell>
                          <TableCell
                            style={{ fontFamily: "Playfair Display, serif" }}
                          >
                            {booking.startingTime}
                          </TableCell>
                          <TableCell
                            style={{ fontFamily: "Playfair Display, serif" }}
                          >
                            {booking.endingTime}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography
                  variant="body1"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
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
              <br />
              <Typography variant="h8" gutterBottom>
                Time: {bookingData.startingTime.substring(0, 2)}:
                {bookingData.startingTime.substring(2, 4)}~
                {bookingData.endingTime.substring(0, 2)}:
                {bookingData.endingTime.substring(2, 4)}
              </Typography>
              <br />
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
              <FormControl fullWidth margin="normal">
                <InputLabel>Teams</InputLabel>
                <Select
                  multiple
                  value={bookingData.teams}
                  onChange={(e) =>
                    setBookingData((prevData) => ({
                      ...prevData,
                      teams: e.target.value,
                    }))
                  }
                >
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.name}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                    setBookingData((prevData) => ({
                      ...prevData,
                      participants: updatedParticipants,
                    }));
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
                {bookingData.participants.length > 0 && (
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#f2c5ee" }}
                    onClick={handleDeleteParticipant}
                  >
                    - Delete Participant
                  </Button>
                )}
              </Box>
              <Box sx={{ display: "flex", marginTop: "20px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBookVenue}
                >
                  Book this Venue
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Root>
  );
};

export default Reserve;
