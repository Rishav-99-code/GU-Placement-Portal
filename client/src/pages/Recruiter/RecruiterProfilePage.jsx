import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import profileService from '../../services/profileService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {Input} from '../../components/ui/input';
import {Label} from '../../components/ui/label';
import {Button} from '../../components/ui/button';

const RecruiterProfilePage = () => {
  const { authState, login } = useContext(AuthContext);
  const user = authState.user;
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState(user?.recruiterDetails?.companyName || '');
  const [companyWebsite, setCompanyWebsite] = useState(user?.recruiterDetails?.companyWebsite || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare recruiter profile data
      const updatedProfileData = {
        recruiterProfile: {
          companyName,
          companyWebsite,
        },
      };
      // Update profile via API
      const response = await profileService.updateProfile(updatedProfileData);

      // Update AuthContext and localStorage with new token and user data
      login(response.token, response);

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
          <div className="pt-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Company Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterProfilePage;