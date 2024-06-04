import React, { useState, useEffect } from "react";
import { Paper, Button, Menu, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArticleIcon from "@mui/icons-material/Article";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import Folder from "./Folder";
import "./Files.css";
import api from "../../api/axiosConfig";
import { jwtDecode } from "jwt-decode";

export default function Files() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("");

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
      const response = await api.get(`/bookings/user/${username}`);
      const bookingsWithFileCounts = await Promise.all(
        response.data.map(async (booking) => {
          const filesResponse = await api.get(`/files/booking/${booking.id}`);
          return { ...booking, fileCount: filesResponse.data.length };
        })
      );
      setBookings(bookingsWithFileCounts);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get(`/files/booking/${selectedFolder.id}`);
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    if (selectedFolder) {
      fetchDocuments();
    }
  }, [selectedFolder]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
    setAnchorEl(null);
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
  };

  const handleUpload = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    handleFileUpload(event.target.files);
  };

  const handleFileUpload = async (files) => {
    try {
      const formData = new FormData();
      formData.append("bookingId", selectedFolder.id);
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      await api.post("/files/upload", formData);

      setSelectedFiles(null);
      setSelectedFolder(null);
      fetchBookings(currentUser); // Refresh the bookings to update the file counts
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await api.delete(`/files/delete/${fileId}`);
      setDocuments(documents.filter((doc) => doc.id !== fileId));
      fetchBookings(currentUser); // Refresh the bookings to update the file counts
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const sortedBookings = bookings.sort((a, b) => {
    if (sortCriteria === "date") {
      return a.date.localeCompare(b.date);
    } else if (sortCriteria === "name") {
      return a.meetingTitle.localeCompare(b.meetingTitle);
    }
    return 0;
  });

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop();
    switch (extension) {
      case "pdf":
        return (
          <PictureAsPdfIcon style={{ color: "red", marginRight: "8px" }} />
        );
      case "doc":
      case "docx":
        return <ArticleIcon style={{ color: "blue", marginRight: "8px" }} />;
      case "ppt":
      case "pptx":
        return (
          <InsertDriveFileIcon
            style={{ color: "orange", marginRight: "8px" }}
          />
        );
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon style={{ color: "green", marginRight: "8px" }} />;
      default:
        return (
          <DescriptionIcon style={{ color: "gray", marginRight: "8px" }} />
        );
    }
  };

  return (
    <div className="files">
      <Paper elevation={3} style={{ paddingBottom: "10px" }}>
        <div className="header" style={{ borderBottom: "1px solid #a8a8a850" }}>
          <div className="title">Forms & Files</div>
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
                <MenuItem onClick={() => handleSort("date")}>
                  Date of Meeting
                </MenuItem>
                <MenuItem onClick={() => handleSort("name")}>
                  Name of Meeting
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
        <div className="folder-cont">
          {sortedBookings.map((booking) => (
            <Folder
              key={booking.id}
              meeting={booking.meetingTitle}
              num={booking.fileCount}
              date={booking.date}
              onClick={() => handleFolderClick(booking)}
            />
          ))}
        </div>
        {selectedFolder && (
          <div className="overlay">
            <div className="overlay-content">
              <h2 style={{ fontFamily: "Baskerville, serif" }}>
                {selectedFolder.meetingTitle}
              </h2>
              {documents.length === 0 ? (
                <p>No files found.</p>
              ) : (
                documents.map((document) => (
                  <div
                    key={document.id}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <a
                      href={`http://localhost:8080/files/download/${document.id}`}
                      download
                      style={{ flex: 1 }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {getFileIcon(document.title)}
                        <span>{document.title}</span>
                      </div>
                    </a>
                    <DeleteIcon
                      style={{ color: "darkgray", cursor: "pointer" }}
                      onClick={() => handleDeleteFile(document.id)}
                    />
                  </div>
                ))
              )}
              <input
                id="fileInput"
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                >
                  Upload
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setSelectedFolder(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Paper>
    </div>
  );
}
