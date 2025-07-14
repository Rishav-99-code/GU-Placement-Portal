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
    phoneNumber: '', // New
    currentSemester: '', // New
    resumeFile: null,    // New for file input
    profilePicFile: null, // New for file input
    resumeUrl: '', // To display existing URL or save new one
    profilePicUrl: '', // To display existing URL or save new one
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
            phoneNumber: data.studentDetails.phoneNumber || '', // Populate new field
            currentSemester: data.studentDetails.currentSemester || '', // Populate new field
            resumeUrl: data.studentDetails.resumeUrl || '', // Populate existing URL
            profilePicUrl: data.studentDetails.profilePicUrl || '', // Populate existing URL
            resumeFile: null, // Reset file input
            profilePicFile: null, // Reset file input
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
    const { id, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [id]: files[0], // For file inputs
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
      toast.error('Please fill in Roll Number, Program, Branch, Phone Number, and Current Semester.');
      return;
    }

    // You will need to implement actual file upload logic here.
    // For a real application, you'd send formData.resumeFile and formData.profilePicFile
    // to a file upload service (e.g., Cloudinary, S3) and get back a URL.
    // For this example, we'll assume the URLs are somehow generated or mock-uploaded.
    // A simple approach for now is to just send a placeholder URL if a file is selected.

    let resumeUrlToSend = formData.resumeUrl;
    let profilePicUrlToSend = formData.profilePicUrl;

    // --- Placeholder for actual file upload logic ---
    // If you have a file selected, you'd upload it and get a URL back.
    // Example:
    // if (formData.resumeFile) {
    //   const uploadedResumeResponse = await fileUploadService.upload(formData.resumeFile);
    //   resumeUrlToSend = uploadedResumeResponse.url;
    // }
    // if (formData.profilePicFile) {
    //   const uploadedProfilePicResponse = await fileUploadService.upload(formData.profilePicFile);
    //   profilePicUrlToSend = uploadedProfilePicResponse.url;
    // }
    // --- End Placeholder ---

    // For demonstration, if a new file is selected, create a dummy URL
    if (formData.resumeFile && !formData.resumeUrl) {
      resumeUrlToSend = `https://example.com/resumes/${authState.user?._id}-${Date.now()}.pdf`;
      toast('Simulating resume upload...');
    }
    if (formData.profilePicFile && !formData.profilePicUrl) {
      profilePicUrlToSend = `https://example.com/profilepics/${authState.user?._id}-${Date.now()}.jpg`;
      toast('Simulating profile picture upload...');
    }


    try {
      const updatedProfileData = {
        studentProfile: {
          usn: formData.usn,
          program: formData.program,
          branch: formData.branch,
          phoneNumber: formData.phoneNumber,
          currentSemester: formData.currentSemester,
          resumeUrl: resumeUrlToSend,
          profilePicUrl: profilePicUrlToSend,
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
          {/* New Fields */}
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="e.g., +919876543210"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="currentSemester">Current Semester</Label>
            <Input
              id="currentSemester"
              type="number"
              placeholder="e.g., 5"
              value={formData.currentSemester}
              onChange={handleChange}
              min="1"
              max="10" // Adjust max as needed
              required
            />
          </div>

          {/* File Uploads */}
          <div>
            <Label htmlFor="resumeFile">Upload Resume (PDF)</Label>
            <Input
              id="resumeFile"
              type="file"
              accept=".pdf"
              onChange={handleChange}
            />
            {formData.resumeUrl && (
              <p className="text-sm text-gray-500 mt-1">
                Current Resume:{' '}
                <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View
                </a>
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="profilePicFile">Upload Profile Picture (JPG/PNG)</Label>
            <Input
              id="profilePicFile"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleChange}
            />
            {formData.profilePicUrl && (
              <div className="mt-1">
                <p className="text-sm text-gray-500">Current Profile Picture:</p>
                <img src={formData.profilePicUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover mt-2" />
              </div>
            )}
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