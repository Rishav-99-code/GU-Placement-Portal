import api from './api';

const interviewService = {
  // Recruiter schedules interview
  scheduleInterview: async (jobId, payload) => {
    const response = await api.post(`/api/interviews/${jobId}/schedule`, payload);
    return response.data;
  },

  // Coordinator: fetch pending interviews
  getPending: async () => {
    const response = await api.get('/api/interviews/pending');
    return response.data;
  },

  // Coordinator: approve interview
  approve: async (interviewId) => {
    const response = await api.patch(`/api/interviews/${interviewId}/approve`);
    return response.data;
  },

  // Student: fetch upcoming approved interviews for dashboard
  getMySchedules: async () => {
    const response = await api.get('/api/interviews/student');
    return response.data;
  },
};

export default interviewService; 