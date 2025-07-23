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
  const { authState, login, updateUser } = useContext(AuthContext); // Added updateUser
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usn: '',
    program: '',
    branch: '',
    phoneNumber: '',
    currentSemester: '',
    resumeFile: null,
    profilePicFile: null,
    resumeUrl: '',
    profilePicUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // The getProfile() call should return the full user object,
        // which contains studentDetails as a nested object.
        const data = await profileService.getProfile();

        // Populate formData from the fetched data
        setFormData({
            usn: data.studentProfile?.usn || '',
            program: data.studentProfile?.program || '',
            branch: data.studentProfile?.branch || '',
            phoneNumber: data.studentProfile?.phoneNumber || '',
            currentSemester: data.studentProfile?.currentSemester || '',
            resumeUrl: data.studentProfile?.resumeUrl || '',
            profilePicUrl: data.studentProfile?.profilePicUrl || '',
            resumeFile: null,
            profilePicFile: null,
        });

        // Also update the AuthContext user if it's not already complete
        // This is a safety measure to ensure AuthContext is in sync
        if (!authState.user?.isProfileComplete && data.studentProfile && data.studentProfile.usn && data.studentProfile.program) {
             // Assuming the backend returns the isProfileComplete status
             updateUser({ ...authState.user, isProfileComplete: true, ...data }); // Merge current user with full profile data
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching student profile:', err);
        setError('Failed to load profile data.');
        setLoading(false);
        toast.error('Failed to load profile. Please try again.');
        // If 401, potentially token expired, so log out
        if (err.response && err.response.status === 401) {
            // Assuming `logout` is available in AuthContext if needed here
            // logout();
        }
      }
    };

    if (authState.isAuthenticated && authState.user?.role === 'student') {
      fetchProfile();
    } else if (!authState.isAuthenticated) {
      navigate('/login');
    }
  }, [authState.isAuthenticated, authState.user, navigate, updateUser]); // Added updateUser to dependencies

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files && files.length > 0) { // Check if files exist and not empty
      setFormData((prevData) => ({
        ...prevData,
        [id]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSelectChange = (value, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.usn || !formData.program || !formData.branch || !formData.phoneNumber || !formData.currentSemester) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const data = new FormData();
    const studentProfile = {
      usn: formData.usn,
      program: formData.program,
      branch: formData.branch,
      phoneNumber: formData.phoneNumber,
      currentSemester: formData.currentSemester,
    };
    data.append('studentProfile', JSON.stringify(studentProfile));

    if (formData.resumeFile) {
      data.append('resume', formData.resumeFile);
    }
    if (formData.profilePicFile) {
      data.append('profilePic', formData.profilePicFile);
    }

    try {
      const updatedUser = await profileService.updateStudentProfile(data);
      updateUser(updatedUser); // Update user in AuthContext
      toast.success('Profile updated successfully!');
      navigate('/student/dashboard'); // Redirect to dashboard after successful update
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        'Failed to update profile.';
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
    <div className="container mx-auto p-8 max-w-4xl bg-gray-900 text-gray-200 min-h-screen"> {/* Adjusted for dark mode consistency */}
      <h1 className="text-4xl font-bold mb-2 text-gray-50">Welcome, {authState.user?.name}!</h1>
      <p className="text-lg text-gray-400 mb-8">
        Please complete your profile to access all features.
      </p>

      <div className="bg-gray-800 shadow-lg rounded-lg p-8"> {/* Adjusted for dark mode consistency */}
        <h2 className="text-2xl font-semibold text-gray-50 mb-6">Student Profile Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="usn" className="text-gray-300">Roll Number</Label>
            <Input
              id="usn"
              placeholder="e.g., 20XXXXXX"
              value={formData.usn}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="program" className="text-gray-300">Program</Label>
            <Select
              value={formData.program}
              onValueChange={(value) => handleSelectChange(value, 'program')}
              required
            >
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500">
                <SelectValue placeholder="Select your program" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-gray-200 border-gray-600">
                <SelectItem value="B.Tech">B.Tech</SelectItem>
                <SelectItem value="M.Tech">M.Tech</SelectItem>
                <SelectItem value="Ph.D.">Ph.D.</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="branch" className="text-gray-300">Branch</Label>
            <Input
              id="branch"
              placeholder="e.g., Computer Science and Engineering"
              value={formData.branch}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          {/* New Fields */}
          <div>
            <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="e.g., +919876543210"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="currentSemester" className="text-gray-300">Current Semester</Label>
            <Input
              id="currentSemester"
              type="number"
              placeholder="e.g., 5"
              value={formData.currentSemester}
              onChange={handleChange}
              min="1"
              max="10"
              className="bg-gray-700 border-gray-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          {/* File Uploads */}
          <div>
            <Label htmlFor="resumeFile" className="text-gray-300">Upload Resume (PDF)</Label>
            <Input
              id="resumeFile"
              type="file"
              accept=".pdf"
              onChange={(e) => setFormData({ ...formData, resumeFile: e.target.files[0] })}
              className="bg-gray-700 border-gray-600 text-gray-200 file:bg-purple-600 file:text-white file:border-none file:hover:bg-purple-700 file:cursor-pointer"
            />
            {formData.resumeUrl && (
              <p className="text-sm text-gray-400 mt-1">
                Current Resume:{' '}
                <a href={`http://localhost:5000${formData.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                  View
                </a>
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="profilePicFile" className="text-gray-300">Upload Profile Picture (JPG/PNG)</Label>
            <Input
              id="profilePicFile"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => setFormData({ ...formData, profilePicFile: e.target.files[0] })}
              className="bg-gray-700 border-gray-600 text-gray-200 file:bg-purple-600 file:text-white file:border-none file:hover:bg-purple-700 file:cursor-pointer"
            />
            {formData.profilePicUrl && (
              <div className="mt-1">
                <p className="text-sm text-gray-400">Current Profile Picture:</p>
                <img src={`http://localhost:5000${formData.profilePicUrl}`} alt="Profile" className="w-20 h-20 rounded-full object-cover mt-2 ring-2 ring-purple-600 ring-offset-2 ring-offset-gray-800" />
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-md transition-all duration-200 active:scale-[0.98] active:shadow-inner">Save Profile</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfilePage;