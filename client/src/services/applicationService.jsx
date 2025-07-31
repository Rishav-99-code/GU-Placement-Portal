// frontend/src/services/applicationService.js
import api from './api'; // Ensure this points to your configured axios instance

const applicationService = {
  /**
   * Fetches all applications for the authenticated student.
   * @returns {Promise<Array>} A promise that resolves to an array of application objects.
   */
  getStudentApplications: async () => {
    try {
      // The endpoint should be what your backend uses for fetching student-specific applications
      const response = await api.get('/api/applications/student'); // Example endpoint
      return response.data;
    } catch (error) {
      console.error('Error fetching student applications:', error);
      throw error;
    }
  },

  /**
   * Submits a new application for a job.
   * @param {string} jobId - The ID of the job to apply for.
   * @param {object} applicationData - Data for the application (e.g., student ID, cover letter, resume details).
   * @returns {Promise<object>} A promise that resolves to the created application object.
   */
  applyForJob: async (jobId, applicationData) => {
    try {
      // Endpoint for submitting an application
      const response = await api.post(`/api/applications/jobs/${jobId}/apply`, applicationData); // Corrected endpoint
      return response.data;
    } catch (error) {
      console.error(`Error applying for job ${jobId}:`, error);
      throw error;
    }
  },

  /**
   * Fetches all applicants for a specific job (recruiter view).
   * @param {string} jobId - The ID of the job.
   * @returns {Promise<Array>} A promise that resolves to an array of application objects with student details.
   */
  getApplicantsForJob: async (jobId) => {
    try {
      const response = await api.get(`/api/jobs/${jobId}/applicants`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching applicants for job ${jobId}:`, error);
      throw error;
    }
  },

  // Coordinator: get all applications
  getAllForCoordinator: async () => {
    const res = await api.get('/api/applications/all');
    return res.data;
  },

  // Update application status (select/reject candidate)
  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await api.patch(`/api/jobs/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating application ${applicationId} status:`, error);
      throw error;
    }
  },

  // You might add functions to withdraw an application, etc.
  // withdrawApplication: async (applicationId) => { ... }
};

export default applicationService;