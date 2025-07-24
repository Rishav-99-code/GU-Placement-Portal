// frontend/src/services/eventService.js
import api from './api';

const eventService = {
  getEvents: async () => {
    const res = await api.get('/api/events');
    return res.data;
  },
  createEvent: async (data) => {
    const res = await api.post('/api/events', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  },
  updateEvent: async (id, data) => {
    const res = await api.put(`/api/events/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  },
  deleteEvent: async (id) => {
    const res = await api.delete(`/api/events/${id}`);
    return res.data;
  },
};

export default eventService; 