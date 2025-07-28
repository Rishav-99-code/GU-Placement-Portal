
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AuthLayout from '../../components/common/AuthLayout';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { resettoken } = useParams(); // Get token from URL params

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!password || !confirmPassword) {
      toast.error('Please enter and confirm your new password.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // Assuming your backend reset password endpoint is /api/users/resetpassword/:resettoken
      await axios.put(`http://localhost:5000/api/users/resetpassword/${resettoken}`, { password });
      toast.success('Password has been reset successfully! Please log in.');
      navigate('/login');
    } catch (error) {
      const message =
        (error.response?.data?.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout type="reset-password">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Reset Password</h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your new password below.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative z-0 w-full mb-5 group">
          <Input
            type="password"
            id="floating_password"
            placeholder=" "
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            New Password
          </Label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <Input
            type="password"
            id="floating_confirm_password"
            placeholder=" "
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <Label
            htmlFor="floating_confirm_password"
            className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Confirm New Password
          </Label>
        </div>

        <Button type="submit" className="w-full py-2.5 text-lg font-semibold glow-on-hover" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600">
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;