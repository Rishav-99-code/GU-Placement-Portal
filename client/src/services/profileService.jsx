// frontend/src/services/profileService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users'; // Base URL for user-related endpoints

// Helper to get auth header with token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get current user's profile
const getProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`, getAuthHeaders());
  return response.data;
};

// Update current user's profile
const updateProfile = async (profileData) => {
  const response = await axios.put(`${API_URL}/profile`, profileData, getAuthHeaders());
  return response.data;
};

const profileService = {
  getProfile,
  updateProfile,
};

export default profileService;