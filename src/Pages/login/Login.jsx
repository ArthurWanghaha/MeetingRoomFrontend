import React, { useState } from 'react';
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
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../../Images/logo.png';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Email format validation

        try {
            const response = await api.post('/api/login', formData);
            console.log('Login successful:', response.data);
          

            // Store the token in localStorage
            localStorage.setItem('token', response.data);

            // Redirect to the dashboard or any other page upon successful login
            alert('Login successful');
            navigate('/'); // Redirect to the dashboard page upon successful login
        } catch (error) {
            console.error('Login failed:', error.response.data);
            alert('Incorrect Email Address or Password');
        }
    };

    return (
        <ThemeProvider theme={createTheme()}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(https://images.pexels.com/photos/6150527/pexels-photo-6150527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
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
                            Sign in
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
                                onChange={handleChange}
                            />
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
                                onChange={handleChange}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <NavLink
                                        to="/"
                                        style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 400,
                                            lineHeight: '1.375em',
                                            color: '#198bdf',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {"Back To Homepage"}
                                    </NavLink>
                                </Grid>
                                <Grid item>
                                    <NavLink
                                        to="/signup"
                                        style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 400,
                                            lineHeight: '1.375em',
                                            color: '#198bdf',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {"Don't have an account? Sign Up"}
                                    </NavLink>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Login;
