// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  // Use import.meta.env for environment variables in Vite
  // Set baseURL to your server's root, WITHOUT the /api part, as the routes will add it.
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming you store token in localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;