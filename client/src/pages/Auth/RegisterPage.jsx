import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import FloatingInput from '../../components/common/FloatingInput';
// import { Checkbox } from '../../components/ui/checkbox'; // Removed

import AuthLayout from '../../components/common/AuthLayout';

const RegisterPage = () => {
  const location = useLocation();
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && ['student', 'recruiter', 'coordinator'].includes(roleParam)) { 
      setRole(roleParam);
    } else {
      setRole('student');
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Register attempt:', { name, email, password, role });
  };

  return (
    <AuthLayout initialTab={role} type="register">
      <Button
        variant="outline"
        className="w-full h-12 mb-6 text-base font-semibold border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
        onClick={() => console.log('Sign up with LinkedIn')}
      >
        <img src="https://img.icons8.com/color/48/000000/linkedin.png" alt="LinkedIn" className="w-6 h-6 mr-3" />
        Sign up with LinkedIn
      </Button>

      <div className="relative text-center mb-6">
        <span className="relative z-10 inline-block px-4 bg-white text-gray-500">or</span>
        <div className="absolute inset-x-0 top-1/2 h-px bg-gray-300 -translate-y-1/2"></div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Role selection is now handled by the Tabs in AuthLayout */}
        <FloatingInput
          id="name"
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mb-6" // Added mb-6 here
        />
        <FloatingInput
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-6" // Added mb-6 here
        />
        <div className="relative mb-6">
          <FloatingInput
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 peer-focus:text-blue-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          </div>
        </div>
        <div className="relative mb-6">
          <FloatingInput
            id="confirm-password"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 peer-focus:text-blue-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          </div>
        </div>

        {/* Removed reCAPTCHA checkbox and label */}

        <Button
          type="submit"
          className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-base font-bold text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          <span className="relative w-full px-5 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Register
          </span>
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Login now
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;