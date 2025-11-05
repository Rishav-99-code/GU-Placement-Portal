// frontend/src/services/authService.js
import axios from 'axios'; // We'll use Axios for cleaner HTTP requests

const API_URL = 'http://localhost:5000/api/auth';

const register = async (userData) => {
  try {
    console.log('📝 Attempting registration for:', userData.email, 'as', userData.role);
    
    const response = await axios.post(`${API_URL}/register`, userData);
    
    console.log('✅ Registration successful:', response.data);
    
    // Important: Do NOT store token or user data here after registration.
    // The user will be redirected to the login page.
    return response.data;
  } catch (error) {
    console.error('❌ Registration failed:', error);
    
    // Extract meaningful error message
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.response) {
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.status === 400) {
        errorMessage = 'Invalid registration data. Please check your information.';
      } else if (error.response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your internet connection.';
    }
    
    const enhancedError = new Error(errorMessage);
    enhancedError.response = error.response;
    throw enhancedError;
  }
};

// Login user with simple error handling
const login = async (userData) => {
  try {
    console.log('🔐 AuthService: Attempting login for:', userData.email);
    
    const response = await axios.post(`${API_URL}/login`, userData);
    
    console.log('✅ AuthService: Login successful');

    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('❌ AuthService: Login failed:', error.response?.status, error.response?.data);
    
    // Just throw a simple error - let the component handle the message
    throw new Error('Login failed');
  }
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