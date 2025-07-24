import api from '../services/api';

const userService = {
  /**
   * Updates the student profile.
   * @param {object} profileData - The profile data to update.
   * @returns {Promise<object>} The updated user object.
   */
  updateProfile: async (profileData) => {
    try {
      // The backend expects the studentProfile object inside the request body
      const response = await api.put('/api/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Fetches the current user's profile.
   * @returns {Promise<object>} The user profile object.
   */
  getProfile: async () => {
    try {
      const response = await api.get('/api/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },
};

export default userService;
