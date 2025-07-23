import api from './api';

const interviewService = {
  scheduleInterview: async (jobId, payload) => {
    const response = await api.post(`/api/interviews/${jobId}/schedule`, payload);
    return response.data;
  },
};

export default interviewService; 