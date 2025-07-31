// frontend/src/services/jobService.js
import api from './api'; // Assuming you have an axios instance configured here

const jobService = {
  /**
   * Fetches a list of available job opportunities.
   * @param {object} [filters={}] - Optional filters like search term, industry, location, etc.
   * @returns {Promise<Array>} A promise that resolves to an array of job objects.
   */
  getAvailableJobs: async (filters = {}) => {
    try {
      // Construct query parameters from filters object
      const queryParams = new URLSearchParams(filters).toString();
      // Adjust endpoint: /api is included here, combined with baseURL from api.js (which is just http://localhost:5000)
      const response = await api.get(`/api/jobs?${queryParams}`);
      return response.data; // Assuming your backend returns an array of jobs directly
    } catch (error) {
      console.error('Error fetching available jobs:', error);
      throw error;
    }
  },

  /**
   * Fetches details for a specific job.
   * @param {string} jobId - The ID of the job to fetch.
   * @returns {Promise<object>} A promise that resolves to a single job object.
   */
  getJobDetails: async (jobId) => {
    try {
      // Adjust endpoint
      const response = await api.get(`/api/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching job details for ${jobId}:`, error);
      throw error;
    }
  },

  getMyJobs: async () => {
    try {
      const response = await api.get('/api/jobs/my-jobs');
      return response.data;
    } catch (error) {
      console.error('Error fetching my jobs:', error);
      throw error;
    }
  },

  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.patch(`/api/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/api/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  rejectJob: async (jobId, reason) => {
    const res = await api.patch(`/api/jobs/${jobId}/reject`, { reason });
    return res.data;
  },

  getJobLocations: async () => {
    try {
      const response = await api.get('/api/jobs/locations');
      return response.data;
    } catch (error) {
      console.error('Error fetching job locations:', error);
      throw error;
    }
  },

  // You might add more functions later, e.g., applyForJob:
  // applyForJob: async (jobId, applicationData) => { ... }
};

export default jobService;