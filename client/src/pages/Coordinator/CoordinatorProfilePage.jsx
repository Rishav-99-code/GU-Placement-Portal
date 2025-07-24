// frontend/src/pages/Coordinator/CoordinatorProfilePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import profileService from '../../services/profileService';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'; // Import Select components

const CoordinatorProfilePage = () => {
  const { authState, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    department: '',
    coordinatorType: '', // New field
    branch: '',          // New field
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'coordinator') {
      navigate('/login', { replace: true });
      return;
    }

    const fetchCoordinatorProfile = async () => {
      try {
        const data = await profileService.getProfile();
        // Set initial form data from fetched profile
        setFormData(prevData => ({
          ...prevData, // Keep default empty strings if fields are missing
          ...data.coordinatorProfile, // Override with fetched data
        }));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch coordinator profile:', error);
        toast.error('Failed to load profile data.');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          logout();
        }
      }
    };

    fetchCoordinatorProfile();
  }, [authState, navigate, logout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send update to server and receive the updated user object
      const updatedUser = await profileService.updateProfile({ coordinatorProfile: formData });

      // Persist in AuthContext/localStorage
      updateUser(updatedUser);

      toast.success('Coordinator profile updated successfully!');
      navigate('/coordinator/dashboard', { replace: true });
    } catch (error) {
      console.error('Failed to update coordinator profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile.');
      if (error.response && error.response.status === 401) {
        logout();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
        <p className="text-xl">Loading coordinator profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen p-4 sm:p-8">
      <div className="max-w-xl mx-auto bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-50 mb-6 text-center">Complete Your Coordinator Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Department */}
          <div>
            <Label htmlFor="department" className="text-gray-300 mb-2 block">Department</Label>
            <Input
              id="department"
              name="department"
              type="text"
              value={formData.department}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Training & Placement Cell"
              required
            />
          </div>

          {/* Coordinator Type (Dropdown) */}
          <div>
            <Label htmlFor="coordinatorType" className="text-gray-300 mb-2 block">Your Role</Label>
            <Select
              name="coordinatorType"
              value={formData.coordinatorType}
              onValueChange={(value) => handleSelectChange('coordinatorType', value)}
              required
            >
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500">
                <SelectValue placeholder="Select your specific role" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-gray-200 border-gray-600">
                <SelectItem value="Placement Coordinator">Placement Coordinator</SelectItem>
                <SelectItem value="Branch Coordinator">Branch Coordinator</SelectItem>
                <SelectItem value="Student Representative">Student Representative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Branch (Input field, potentially a dropdown later if fixed options) */}
          <div>
            <Label htmlFor="branch" className="text-gray-300 mb-2 block">Associated Branch (e.g., CSE, ECE, IT)</Label>
            <Input
              id="branch"
              name="branch"
              type="text"
              value={formData.branch}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Computer Science, Electrical Engineering"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-md transition-all duration-200 active:scale-[0.98] active:shadow-inner" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CoordinatorProfilePage;