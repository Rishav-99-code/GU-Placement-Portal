// frontend/src/pages/Auth/LoginPage.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AuthLayout from '../../components/common/AuthLayout';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roleParam = queryParams.get('role');
    if (roleParam && ['student', 'recruiter', 'coordinator'].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    try {
      const userData = await authService.login({ email, password });
      console.log('Login response:', userData); // Debug log
      login(userData.token, userData);
      toast.success(`Logged in successfully as ${userData.role}!`);

      // Robust redirect logic
      if (userData.role === 'student') {
        if (userData.isProfileComplete) {
          navigate('/student/dashboard');
        } else {
          navigate('/student/profile');
        }
      } else if (userData.role === 'recruiter') {
        if (userData.isProfileComplete) {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/recruiter/profile');
        }
      } else if (userData.role === 'coordinator') {
        if (userData.isProfileComplete) {
          navigate('/coordinator/dashboard');
        } else {
          navigate('/coordinator/profile');
        }
      } else {
        // Fallback: go to login if role is missing or unknown
        toast.error('Unknown user role. Please contact support.');
        navigate('/login');
      }
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };

  return (
    <AuthLayout initialTab={role} type="login">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Log In</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative z-0 w-full mb-5 group">
          <Input
            type="email"
            id="floating_email"
            className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </Label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <Input
            type="password"
            id="floating_password"
            className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </Label>
        </div>

        <div className="flex justify-between items-center text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full py-2.5 text-lg font-semibold glow-on-hover">
          Log In
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to={`/register?role=${role}`} className="text-blue-600 hover:underline font-medium">
          Sign up here
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;