// frontend/src/services/studentService.js
import api from './api';

const studentService = {
  getAll: async (approvedFilter = null) => {
    const query = approvedFilter === null ? '' : `?approved=${approvedFilter}`;
    const res = await api.get(`/api/users/students${query}`);
    return res.data;
  },
  approve: async (studentId) => {
    const res = await api.patch(`/api/users/students/${studentId}/approve`);
    return res.data;
  },
  uploadResume: async (studentId, file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await api.put(`/api/users/students/${studentId}/resume`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  setBlacklist: async (studentId, blacklisted) => {
    const res = await api.patch(`/api/users/students/${studentId}/blacklist`, { blacklisted });
    return res.data;
  },
};

export default studentService; 