import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Modal from "react-modal";
import styled from "@emotion/styled";
import {
  Paper,
  Typography,
  Button,
  Grid,
  FormControl,
  TextField,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axiosConfig";
import "./Edit.css";

Modal.setAppElement("#root");

const theme = createTheme({
  spacing: 8,
});

const Root = styled("div")`
  flex-grow: 1;
  padding: ${theme.spacing(2)};
`;

const StyledPaper = styled(Paper)`
  margin: ${theme.spacing(1)};
  padding: ${theme.spacing(2)};
  text-align: center;
  color: ${theme.palette.text.secondary};
  cursor: pointer;
  height: 100%;
`;

const Image = styled("img")`
  width: 100%;
  height: auto;
  margin-bottom: ${theme.spacing(1)};
`;

const ModalContent = styled("div")`
  padding: ${theme.spacing(2)};
`;

function Edit() {
  const [bookings, setBookings] = useState([]);
  const [meetingRoomImages, setMeetingRoomImages] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [error, setError] = useState("");

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
          fetchBookings(userDetails.username); // Fetch bookings once user details are fetched
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [isLoggedIn, userId]);

  const fetchBookings = async (username) => {
    try {
      const response = await api.get(`/bookings/user/${username}/all`);

      const pastBookings = response.data.filter((booking) => {
        const bookingDate = new Date(
          `${booking.date.substring(0, 4)}-${booking.date.substring(
            4,
            6
          )}-${booking.date.substring(6, 8)}T00:00:00`
        );
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return bookingDate < today;
      });
      setBookings(pastBookings);

      const images = await fetchMeetingRoomImages(pastBookings);
      setMeetingRoomImages(images);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchMeetingRoomImages = async (bookings) => {
    const images = {};
    for (const booking of bookings) {
      if (!images[booking.meetingRoom]) {
        try {
          const response = await api.get(
            `/api/meeting-rooms/name/${booking.meetingRoom}`
          );
          images[booking.meetingRoom] = response.data.image;
        } catch (error) {
          console.error(
            `Error fetching image for room ${booking.meetingRoom}:`,
            error
          );
          images[booking.meetingRoom] = "";
        }
      }
    }
    return images;
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setModalIsOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedBooking((prevBooking) => ({
      ...prevBooking,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const bookingToSave = {
      ...selectedBooking,
    };

    api
      .put(`/bookings/update/${selectedBooking.id}`, bookingToSave)
      .then((response) => {
        if (response.data) {
          setBookings((prevBookings) =>
            prevBookings.map((booking) =>
              booking.id === response.data.id ? response.data : booking
            )
          );
          setModalIsOpen(false);
          setError("");
        }
      })
      .catch((error) => {
        console.error("Error updating booking:", error);
      });
  };

  const handleDelete = () => {
    api
      .delete(`/bookings/${selectedBooking.id}`)
      .then(() => {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== selectedBooking.id)
        );
        setModalIsOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting booking:", error);
      });
  };

  const formatDateString = (dateString) => {
    return `${dateString.substring(0, 4)}-${dateString.substring(
      4,
      6
    )}-${dateString.substring(6, 8)}`;
  };

  const formatTimeString = (timeString) => {
    if (timeString.length === 4) {
      return `${timeString.substring(0, 2)}:${timeString.substring(2, 4)}`;
    }
    return timeString;
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Root>
          <div className="files">
            <Paper elevation={3} style={{ paddingBottom: "10px" }}>
              <div
                className="header"
                style={{ borderBottom: "1px solid #a8a8a850" }}
              >
                <div className="title">Past Meetings</div>
              </div>
              <Grid container spacing={1}>
                {bookings.map((booking) => (
                  <Grid item xs={12} sm={6} md={4} key={booking.id}>
                    <StyledPaper onClick={() => handleEdit(booking)}>
                      <Image
                        src={meetingRoomImages[booking.meetingRoom] || ""}
                        alt={booking.meetingRoom}
                      />
                      <Typography variant="h6" gutterBottom>
                        {booking.meetingTitle}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {formatDateString(booking.date)}
                      </Typography>
                      <Typography variant="body2">
                        Room: {booking.meetingRoom}
                      </Typography>
                      <Typography variant="body2">
                        Time: {formatTimeString(booking.startingTime)} -{" "}
                        {formatTimeString(booking.endingTime)}
                      </Typography>
                    </StyledPaper>
                  </Grid>
                ))}
              </Grid>
              {selectedBooking && (
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={() => setModalIsOpen(false)}
                  contentLabel="Edit Booking"
                  className="modal"
                  overlayClassName="modal-overlay"
                >
                  <ModalContent>
                    <h3>Edit Booking</h3>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Booker"
                        name="booker"
                        value={selectedBooking.booker}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Meeting Title"
                        name="meetingTitle"
                        value={selectedBooking.meetingTitle}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Meeting Room"
                        name="meetingRoom"
                        value={selectedBooking.meetingRoom}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <DatePicker
                        label="Date"
                        value={dayjs(selectedBooking.date, "YYYYMMDD")}
                        readOnly
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            InputProps={{ readOnly: true }}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <TimePicker
                        label="Starting Time"
                        value={dayjs(selectedBooking.startingTime, "HHmm")}
                        readOnly
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            InputProps={{ readOnly: true }}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <TimePicker
                        label="Ending Time"
                        value={dayjs(selectedBooking.endingTime, "HHmm")}
                        readOnly
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            InputProps={{ readOnly: true }}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Meeting Minutes"
                        name="meetingDescription"
                        value={selectedBooking.meetingDescription}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                      />
                    </FormControl>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setModalIsOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </ModalContent>
                </Modal>
              )}
            </Paper>
          </div>
        </Root>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default Edit;
