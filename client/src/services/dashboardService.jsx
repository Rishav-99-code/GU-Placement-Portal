// frontend/src/services/dashboardService.js
import api from './api';

const dashboardService = {
  // Coordinator stats
  getCoordinatorStats: async () => {
    const response = await api.get('/api/dashboard/coordinator/stats');
    return response.data;
  },
};

export default dashboardService; 