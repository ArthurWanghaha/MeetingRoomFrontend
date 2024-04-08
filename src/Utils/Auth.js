// auth.js

// Function to set user authentication token in local storage
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// Function to get user authentication token from local storage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Function to remove user authentication token from local storage
export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Function to check if the user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token; // Convert token to boolean (true if token exists, false otherwise)
};

// Function to perform user logout
export const logout = () => {
  removeAuthToken();
  // Additional logout actions can be added here, such as redirecting to the login page
};

// Function to get user information from local storage
export const getUserInfo = () => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};
