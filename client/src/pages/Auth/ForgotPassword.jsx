// frontend/src/pages/Auth/ForgotPasswordPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AuthLayout from '../../components/common/AuthLayout';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      // Assuming your backend forgot password endpoint is /api/users/forgotpassword
      await axios.post('http://localhost:5000/api/users/forgotpassword', { email });
      toast.success('If an account with that email exists, a password reset link has been sent to your inbox.');
      navigate('/login'); // Redirect to login, user can then check email
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
    <AuthLayout type="forgot-password">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Forgot Password</h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative z-0 w-full mb-5 group">
          <Input
            type="email"
            id="floating_email"
            placeholder=" "
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </Label>
        </div>

        <Button type="submit" className="w-full py-2.5 text-lg font-semibold glow-on-hover" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600">
        Remember your password?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Log in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;