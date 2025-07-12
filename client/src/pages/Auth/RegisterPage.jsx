import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AuthLayout from '../../components/common/AuthLayout';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const userData = await authService.register({ name, email, password, role });
      login(userData.token, userData);
      toast.success(`Registered successfully as ${userData.role}! Redirecting...`);
      switch (userData.role) {
        case 'student':
          navigate('/student/profile');
          break;
        case 'recruiter':
          navigate('/recruiter/profile');
          break;
        case 'coordinator':
          navigate('/coordinator/profile');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      const message =
        (error.response?.data?.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };

  return (
    <AuthLayout initialTab={role} type="register">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Full Name */}
        <div className="relative z-0 w-full mb-5 group">
          <Input
            type="text"
            id="floating_name"
            placeholder=" "
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Label
            htmlFor="floating_name"
            className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Full Name
          </Label>
        </div>

        {/* Email */}
        <div className="relative z-0 w-full mb-5 group">
          <Input
            type="email"
            id="floating_email"
            placeholder=" "
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </Label>
        </div>

        {/* Password */}
        <div className="relative z-0 w-full mb-5 group">
          <Input
            type="password"
            id="floating_password"
            placeholder=" "
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </Label>
        </div>

        {/* Confirm Password */}
        <div className="relative z-0 w-full mb-5 group">
          <Input
            type="password"
            id="floating_confirm_password"
            placeholder=" "
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Label
            htmlFor="floating_confirm_password"
            className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Confirm Password
          </Label>
        </div>

        <Button type="submit" className="w-full py-2.5 text-lg font-semibold glow-on-hover">
          Register
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Log in here
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
