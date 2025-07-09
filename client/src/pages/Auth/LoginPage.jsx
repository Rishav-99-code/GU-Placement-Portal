// frontend/src/pages/Auth/LoginPage.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import FloatingInput from '../../components/common/FloatingInput';
// import { Checkbox } from '../../components/ui/checkbox'; // Removed
// import { Label } from '../../components/ui/label'; // Label is not needed for checkbox anymore

import AuthLayout from '../../components/common/AuthLayout';

const LoginPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initialRole, setInitialRole] = useState('student');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    // Ensure role is one of the valid tabs (student, recruiter, coordinator)
    if (roleParam && ['student', 'recruiter', 'coordinator'].includes(roleParam)) {
      setInitialRole(roleParam);
    } else {
      setInitialRole('student'); // Default if no param or invalid
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, role: initialRole });
  };

  return (
    <AuthLayout initialTab={initialRole} type="login">
      <Button
        variant="outline"
        className="w-full h-12 mb-6 text-base font-semibold border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
        onClick={() => console.log('Sign in with LinkedIn')}
      >
        <img src="https://img.icons8.com/color/48/000000/linkedin.png" alt="LinkedIn" className="w-6 h-6 mr-3" />
        Sign in with LinkedIn
      </Button>

      <div className="relative text-center mb-6">
        <span className="relative z-10 inline-block px-4 bg-white text-gray-500">or</span>
        <div className="absolute inset-x-0 top-1/2 h-px bg-gray-300 -translate-y-1/2"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <FloatingInput
          id="email"
          label="Email"
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

        {/* Removed reCAPTCHA checkbox and label */}

        <Link to="/forgot-password" className="block text-sm text-blue-600 hover:underline text-right mb-6">
          Forgot password?
        </Link>

        <Button
          type="submit"
          className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-base font-bold text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          <span className="relative w-full px-5 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Sign In
          </span>
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-blue-600 hover:underline">
          Register now
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;