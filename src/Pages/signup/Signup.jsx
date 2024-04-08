import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import './Signup.css'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../../Images/logo.png';
import { NavLink } from 'react-router-dom';
import api from '../../api/axiosConfig';

const theme = createTheme();

export default function SignUpSide() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    institutions: [''],
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, username, institutions, password, confirmPassword, ...formDataWithoutConfirmPassword } = formData;

    if (!email || !username || !password || !confirmPassword) {
      alert('Please fill in all the required fields.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await api.post('/api/signup', formDataWithoutConfirmPassword);
      console.log(response.data); // Log response from the backend
      // Show success message
      alert('User created successfully');
      // Redirect to another route
      navigate('/login'); // Navigate to the login page
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddInstitution = () => {
    setFormData({
      ...formData,
      institutions: [...formData.institutions, '']
    });
  };

  const handleDeleteInstitution = (index) => {
    const updatedInstitutions = [...formData.institutions];
    updatedInstitutions.splice(index, 1);
    setFormData({
      ...formData,
      institutions: updatedInstitutions
    });
  };

  const handleInstitutionChange = (index, value) => {
    const updatedInstitutions = [...formData.institutions];
    updatedInstitutions[index] = value;
    setFormData({
      ...formData,
      institutions: updatedInstitutions
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div>
              <img src={logo} alt="Custom Icon" className="custom-logo" />
            </div>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="User Name"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleInputChange}
              />
              {formData.institutions.map((institution, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id={`institution-${index}`}
                    label={`Institution ${index + 1}`}
                    name={`institution-${index}`}
                    value={institution}
                    onChange={(e) => handleInstitutionChange(index, e.target.value)}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteInstitution(index)}
                  >
                    Delete Institution
                  </Button>
                </Box>
              ))}
              <Button
                type="button"
                fullWidth
                variant="outlined"
                sx={{ mt: 1, mb: 2, marginY: 0 }}
                onClick={handleAddInstitution}
              >
                Add Institution
              </Button>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign Up
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    {/* Forgot password? */}
                  </Link>
                </Grid>
                <Grid item>
                  <NavLink
                    to="/login"
                    style={{
                      fontSize: '0.875rem', // Equivalent to body2 variant's font size
                      fontWeight: 400, // Equivalent to body2 variant's font weight
                      lineHeight: '1.375em', // Equivalent to body2 variant's line height
                      color: '#198bdf', // Inherit color from parent
                      textDecoration: 'none', // Remove default underline
                    }}
                  >
                    {"Back to Login Page"}
                  </NavLink>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Grid>
      <ToastContainer /> {/* Include ToastContainer for notifications */}
    </ThemeProvider>
  );
}
