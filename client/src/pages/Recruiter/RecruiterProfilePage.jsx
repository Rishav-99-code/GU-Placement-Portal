import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import profileService from '../../services/profileService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {Input} from '../../components/ui/input';
import {Label} from '../../components/ui/label';
import {Button} from '../../components/ui/button';

const RecruiterProfilePage = () => {
  const { authState, updateUser } = useContext(AuthContext);
  const user = authState.user;
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState(user?.recruiterProfile?.companyName || '');
  const [companyWebsite, setCompanyWebsite] = useState(user?.recruiterProfile?.companyWebsite || '');
  const [contactNumber, setContactNumber] = useState(user?.recruiterProfile?.contactNumber || '');
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleLogoUpload = async () => {
    if (!logo) {
      toast.error('Please select a logo to upload.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('logo', logo);
      // Upload logo and receive the updated user object (server handles saving & token generation)
      const updatedUser = await profileService.updateRecruiterLogo(formData);
      updateUser(updatedUser);
      toast.success('Logo uploaded successfully!');
      // Do NOT redirect or mark profile complete here
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload logo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare recruiter profile data
      const updatedProfileData = {
        recruiterProfile: {
          companyName,
          companyWebsite,
          contactNumber,
        },
      };
      // Update profile via API
      const updatedUser = await profileService.updateProfile(updatedProfileData);

      // Update AuthContext with the fresh user object
      updateUser(updatedUser);

      toast.success('Profile updated successfully!');
      navigate('/recruiter/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Please provide your company details to start posting jobs.
      </p>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Company Profile Details</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="companyWebsite">Company Website</Label>
            <Input
              id="companyWebsite"
              value={companyWebsite}
              onChange={e => setCompanyWebsite(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
              required
            />
          </div>
          <div className="pt-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Company Profile'}
            </Button>
          </div>
        </form>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Company Logo</h3>
          {user?.recruiterProfile?.logoUrl && (
            <div className="mb-4">
              <img
                src={`http://localhost:5000${user.recruiterProfile.logoUrl}`}
                alt="Company Logo"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
          <div className="flex items-center space-x-4">
            <Input type="file" onChange={handleLogoChange} />
            <Button onClick={handleLogoUpload} disabled={loading || !logo}>
              {loading ? 'Uploading...' : 'Upload Logo'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfilePage;