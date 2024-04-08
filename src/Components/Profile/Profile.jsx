import React, { useState, useEffect } from 'react';
import { Menu, MenuItem } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@material-ui/core/Paper';
import api from '../../api/axiosConfig';
import { jwtDecode } from 'jwt-decode';

export default function Profile() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedPictureUrl, setUploadedPictureUrl] = useState(null);
    const token = localStorage.getItem('token');
    const [userData, setUserData] = useState({
        username: '',
        jobTitle: '',
        email: '',
        number: '',
        address: '',
        bio: ''
    });

    const getUserIdFromToken = (token) => {
        if (typeof token === 'string') {
            console.log('Token:', token); // Log the token value
            const decodedToken = jwtDecode(token);
            console.log('decodedToken:', decodedToken);
            return decodedToken.userId; // Assuming 'userId' is the key for user ID in the token payload
        } else {
            console.error('Token is not a string:', token);
            return null; // or handle the error accordingly
        }
    };

    const userId = getUserIdFromToken(token);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await api.get(`/api/${userId}/user-details`);
                const userDetails = response.data;
                setUserData(userDetails);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [userId]); // Fetch user details only when userId changes

    useEffect(() => {
        fetchUploadedPicture();
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFileChange = (event) => {
        console.log('testwded');
        setSelectedFile(event.target.files[0]);
        handleFileUpload(event.target.files[0]);
    };

    const handleFileUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            console.log('test1');

            let userId = getUserIdFromToken(token);
            let targetURL = `/api/${userId}/set-profile-picture`;
            const response = await api.post(targetURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update the uploaded picture URL if the upload was successful
            setUploadedPictureUrl(response.data);

            // Close the menu
            setAnchorEl(null);

            // Optional: Provide feedback to the user about the successful upload
            console.log('Profile picture uploaded successfully:', response.data);
        } catch (error) {
            // Handle error
            console.error('Error uploading profile picture:', error);
            // Optional: Display an error message to the user
            // For example:
            // setError('Error uploading profile picture. Please try again.');
        }
    };

    const fetchUploadedPicture = async () => {
        try {
            let userId = getUserIdFromToken(token);
            let targetURL = `/api/${userId}/get-profile-picture`;
            const response = await api.get(targetURL, { responseType: 'arraybuffer' });
            const blob = new Blob([response.data], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            setUploadedPictureUrl(imageUrl);
        } catch (error) {
            console.error('Error fetching uploaded profile picture:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await editUserDetails(userData);
            console.log('User details updated successfully', userData);
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    const editUserDetails = async (userData) => {
        try {
            let userId = getUserIdFromToken(token);
            await api.put(`/api/${userId}/update-user-details`, userData);
        } catch (error) {
            throw new Error('Failed to update user details');
        }
    };

    return (
        <div className='progress-tracker'>
            <Paper elevation={3}>
                <div className="header">
                    <div className="title" style={{ fontSize: '1.2rem' }}>Profile Settings</div>
                    <div className="progress-right">
                    </div>
                </div>
            </Paper>
            <Paper elevation={3}>
                <Box
                    sx={{
                        my: 1,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Avatar alt="Remy Sharp" src={uploadedPictureUrl} style={{ width: '140px', height: '140px', marginTop: '3%', cursor: 'pointer' }} onClick={handleClick} />

                    <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="User Name"
                            name="username"
                            autoComplete="name"
                            value={userData.username}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="jobTitle"
                            label="Job Title"
                            name="jobTitle"
                            autoComplete="job"
                            value={userData.jobTitle}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={userData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="number"
                            label="Phone Number"
                            name="number"
                            autoComplete="tel"
                            value={userData.number}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="address"
                            label="Office Address"
                            name="address"
                            autoComplete="address"
                            value={userData.address}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="bio"
                            label="Bio"
                            name="bio"
                            autoComplete="bio"
                            value={userData.bio}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '#f2e4c5',
                                color: '#000000',
                                '&:hover': {
                                    backgroundColor: '#f2d345',
                                },
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Box>
            </Paper>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <MenuItem>
                    <label htmlFor="file-upload">Upload Profile Picture</label>
                    <input id="file-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </MenuItem>
                {/* Remove the Save MenuItem from here */}
                <MenuItem onClick={handleClose}>Cancel</MenuItem>
            </Menu>
        </div>
    );
}
