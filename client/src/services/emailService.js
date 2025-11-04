import api from './api';

const emailService = {
  getCredentialsStatus: async () => {
    const response = await api.get('/api/email/credentials');
    return response.data; // { email, hasEmailPassword }
  },
  updateCredentials: async (emailPassword) => {
    const response = await api.put('/api/email/credentials', { emailPassword });
    return response.data; // { message }
  },
};

export default emailService;


