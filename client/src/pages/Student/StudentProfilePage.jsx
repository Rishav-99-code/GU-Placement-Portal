// frontend/src/pages/Student/StudentProfilePage.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { AuthContext } from '../../context/AuthContext';
import profileService from '../../services/profileService';
import toast from 'react-hot-toast';

const StudentProfilePage = () => {
  const { authState, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usn: '',
    program: '',
    branch: '',
    // cgpa: '' // Add if needed
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await profileService.getProfile();
        if (data.studentDetails) {
          setFormData({
            usn: data.studentDetails.usn || '',
            program: data.studentDetails.program || '',
            branch: data.studentDetails.branch || '',
            // cgpa: data.studentDetails.cgpa || ''
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student profile:', err);
        setError('Failed to load profile data.');
        setLoading(false);
        toast.error('Failed to load profile. Please try again.');
      }
    };

    if (authState.isAuthenticated && authState.user?.role === 'student') {
      fetchProfile();
    } else if (!authState.isAuthenticated) {
      navigate('/login'); // If not authenticated, redirect to login
    }
  }, [authState.isAuthenticated, authState.user, navigate]);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (value, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.usn || !formData.program || !formData.branch) {
      toast.error('Please fill in Roll Number, Program, and Branch.');
      return;
    }

    try {
      const updatedProfileData = {
        studentProfile: {
          usn: formData.usn,
          program: formData.program,
          branch: formData.branch,
          // Add other fields from formData that belong to studentProfile
        }
      };

      const response = await profileService.updateProfile(updatedProfileData);

      // Update the user object in AuthContext and localStorage with the new profile data
      login(response.token, response);

      toast.success('Profile updated successfully!');

      // Redirect to student dashboard after profile completion
      navigate('/student/dashboard');

    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Welcome, {authState.user?.name}!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Please complete your profile to access all features.
      </p>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Profile Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="usn">Roll Number</Label>
            <Input
              id="usn"
              placeholder="e.g., 20XXXXXX"
              value={formData.usn}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="program">Program</Label>
            <Select
              value={formData.program}
              onValueChange={(value) => handleSelectChange(value, 'program')}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B.Tech">B.Tech</SelectItem>
                <SelectItem value="M.Tech">M.Tech</SelectItem>
                <SelectItem value="Ph.D.">Ph.D.</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="branch">Branch</Label>
            <Input
              id="branch"
              placeholder="e.g., Computer Science and Engineering"
              value={formData.branch}
              onChange={handleChange}
              required
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">Save Profile</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfilePage;