// frontend/src/services/authService.js
import axios from 'axios'; // We'll use Axios for cleaner HTTP requests

// Install Axios if you haven't: npm install axios
const API_URL = 'http://localhost:5000/api/auth'; // Match your backend URL and auth route

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  // Backend returns user data and token on successful registration
  if (response.data) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  // Backend returns user data and token on successful login
  if (response.data) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
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