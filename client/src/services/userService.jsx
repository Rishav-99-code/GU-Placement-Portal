import api from './api';

const userService = {
  changePassword: async (currentPassword, newPassword) => {
    try {
      console.log('🔐 Changing password...');
      const res = await api.put('/api/users/change-password', { 
        currentPassword, 
        newPassword 
      });
      console.log('✅ Password changed successfully');
      return res.data;
    } catch (error) {
      console.error('❌ Password change failed:', error);
      throw error;
    }
  },
};

export default userService;
