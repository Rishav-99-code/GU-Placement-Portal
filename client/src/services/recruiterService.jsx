// frontend/src/services/recruiterService.js
import api from './api';

const recruiterService = {
  getAll: async (approvedFilter = null) => {
    const query = approvedFilter === null ? '' : `?approved=${approvedFilter}`;
    const res = await api.get(`/api/users/recruiters${query}`);
    return res.data;
  },
  approve: async (recruiterId) => {
    const res = await api.patch(`/api/users/recruiters/${recruiterId}/approve`);
    return res.data;
  },
  setSuspended: async (recruiterId, suspended) => {
    const res = await api.patch(`/api/users/recruiters/${recruiterId}/suspend`, { suspended });
    return res.data;
  },
  getJobs: async (recruiterId) => {
    const res = await api.get(`/api/jobs/recruiter/${recruiterId}`);
    return res.data;
  },
  getApplications: async (recruiterId) => {
    const res = await api.get(`/api/applications/recruiter/${recruiterId}`);
    return res.data;
  },
};

export default recruiterService; 