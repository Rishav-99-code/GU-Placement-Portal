// frontend/src/services/profileService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile'; // Corrected Base URL

// Helper to get auth header with token
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  if (isMultipart) {
    headers['Content-Type'] = 'multipart/form-data';
  }
  return { headers };
};

// Get current user's profile
const getProfile = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

// Update student's profile
const updateStudentProfile = async (formData) => {
  const response = await axios.put(`${API_URL}/student`, formData, getAuthHeaders(true));
  return response.data;
};

// Update current user's profile (for recruiter)
const updateProfile = async (profileData) => {
  const response = await axios.put(API_URL, profileData, getAuthHeaders());
  return response.data;
};

// Update recruiter logo (returns updated user object)
const updateRecruiterLogo = async (logoData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`http://localhost:5000/api/users/profile/logo`, logoData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // updated user object containing recruiterProfile & isProfileComplete
};

const profileService = {
  getProfile,
  updateProfile,
  updateStudentProfile, // Added
  updateRecruiterLogo,
};

export default profileService;