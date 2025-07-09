// frontend/src/components/common/AuthLayout.js
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils'; // Make sure you have this utility
import '../../assets/styles/submarine-animation.css'; // Import the new CSS file

const AuthLayout = ({ children, initialTab, type }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === '/login';

  const handleTabChange = (value) => {
    // This logic ensures the initialTab prop is correctly passed to AuthLayout's Tabs,
    // reflecting the role from the URL or default.
    // If you want actual URL changes on tab clicks:
    if (isLogin) {
        navigate(`/login?role=${value}`);
    } else {
        navigate(`/register?role=${value}`);
    }
    // Note: The `initialTab` prop will be updated by the `useEffect` in LoginPage/RegisterPage
    // when the URL changes, which will then re-render AuthLayout with the new active tab.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden min-h-[600px] my-8">

        {/* Left Section (Solid Background with Animation) */}
        {/* Changed background to a solid color and removed all text content */}
        <div className="md:w-2/5 bg-[#306D85] flex flex-col justify-center items-center relative overflow-hidden">
          {/* The submarine animation will go here */}
          <div className="submarine-animation-container relative z-0 flex justify-center items-center h-full w-full">
            {/* Provided HTML for animation */}
            <div className="sea">
                <div className="circle-wrapper">
                    <div className="bubble"></div>
                    <div className="submarine-wrapper">
                        <div className="submarine-body">
                            <div className="window"></div>
                            <div className="light"></div>
                        </div>
                        <div className="helix"></div>
                        <div className="hat">
                            <div className="leds-wrapper">
                                <div className="periscope"></div>
                                <div className="leds"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End of animation HTML */}
          </div>

          {/* All text content removed from here */}
        </div>

        {/* Right Section (White Background with Form) */}
        <div className="md:w-3/5 bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="flex justify-end mb-4">
            <Link to={isLogin ? '/register' : '/login'} className="text-blue-600 hover:underline text-sm font-medium">
              {isLogin ? 'Sign-up for a new account' : 'Sign-in to your account'}
            </Link>
          </div>

          {/* Role Selection Tabs (Removed Verifier) */}
          <Tabs value={initialTab} onValueChange={handleTabChange} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gray-100 rounded-md">
              <TabsTrigger value="student" className="py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                Student
              </TabsTrigger>
              <TabsTrigger value="recruiter" className="py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                Recruiter
              </TabsTrigger>
              <TabsTrigger value="coordinator" className="py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                Coordinator
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;