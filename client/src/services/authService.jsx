// frontend/src/services/authService.js
import axios from 'axios'; // We'll use Axios for cleaner HTTP requests

const API_URL = 'http://localhost:5000/api/auth';

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  // Important: Do NOT store token or user data here after registration.
  // The user will be redirected to the login page.
  return response.data;
};

// Login user (remains unchanged as it correctly handles token and user storage)
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);

  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user (remains unchanged)
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;