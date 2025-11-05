// frontend/src/pages/Auth/RegisterPage.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import PasswordInput from '../../components/ui/PasswordInput';
import { validatePassword } from '../../utils/passwordValidation';
import AuthLayout from '../../components/common/AuthLayout';
import { AuthContext } from '../../context/AuthContext'; // Still import for context structure
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
  // const { login } = useContext(AuthContext); // No longer needed for auto-login after register

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

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.errors[0]);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const response = await authService.register({ name, email, password, role });
      
      if (role === 'coordinator') {
        // Store minimal info in localStorage for the pending approval page
        localStorage.setItem('pendingUser', JSON.stringify({
          email,
          role,
          name
        }));
        toast.success('Registration successful! Your account is pending approval.');
        navigate('/pending-approval'); // Redirect to pending approval page
      } else {
        // For other roles, proceed as normal
        toast.success('Registration successful! Please log in.');
        navigate(`/login?role=${role}`);
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
            className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Label
            htmlFor="floating_name"
            className="peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Full Name
          </Label>
        </div>

        {/* Email */}
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

        {/* Password with Validation */}
        <div className="space-y-2">
          <PasswordInput
            id="floating_password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showValidation={true}
            showStrength={true}
            required
            className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="floating_confirm_password" className="text-gray-700">
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type="password"
              id="floating_confirm_password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`
                bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500
                ${confirmPassword && password !== confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              `}
              required
            />
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-red-500 text-xs flex items-center">
              <span className="mr-1">❌</span>
              Passwords do not match
            </p>
          )}
          {confirmPassword && password === confirmPassword && password.length > 0 && (
            <p className="text-green-600 text-xs flex items-center">
              <span className="mr-1">✅</span>
              Passwords match
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full py-2.5 text-lg font-semibold bg-gradient-to-r from-purple-700 via-blue-600 to-purple-900 text-white rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Register
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to={`/login?role=${role}`} className="text-blue-600 hover:underline font-medium">
          Log in here
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;