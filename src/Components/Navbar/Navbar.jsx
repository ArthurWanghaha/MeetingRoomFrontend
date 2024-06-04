import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Avatar } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import "./Navbar.css";
import api from "../../api/axiosConfig";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [uploadedPictureUrl, setUploadedPictureUrl] = useState(null);
  const [username, setUsername] = useState("");

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token; // Check if the user is logged in

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
          setUsername(userDetails.username);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    } else {
      // If the user is logged out, set the username to 'Logged out user'
      setUsername("Logged out user");
    }
  }, [isLoggedIn, userId]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUploadedPicture();
    }
  }, [isLoggedIn]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const fetchUploadedPicture = async () => {
    try {
      const response = await api.get(`/api/${userId}/get-profile-picture`, {
        responseType: "arraybuffer",
      });
      const blob = new Blob([response.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      setUploadedPictureUrl(imageUrl);
    } catch (error) {
      console.error("Error fetching uploaded profile picture:", error);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="input-cont">
          <div className="input-box">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              className="input-field"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
      <div className="navbar-right">
        <Avatar
          alt="Remy Sharp"
          src={uploadedPictureUrl}
          style={{ width: "60px", height: "60px" }}
        />
        <div className="AdminDash">@{username}</div>
        <NotificationsIcon className="AdminDash" />
      </div>
    </div>
  );
}
