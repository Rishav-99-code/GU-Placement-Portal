import api from './api';

const userService = {
  changePassword: async (newPassword) => {
    const res = await api.put('/api/users/profile', { password: newPassword });
    return res.data;
  },
};

export default userService;
