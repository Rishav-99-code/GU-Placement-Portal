import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils'; 
import '../../assets/styles/submarine-animation.css'; 

const AuthLayout = ({ children, initialTab, type }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === '/login';

  const handleTabChange = (value) => {
    
    if (isLogin) {
        navigate(`/login?role=${value}`);
    } else {
        navigate(`/register?role=${value}`);
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden min-h-[600px] my-8">

        
        <div className="md:w-2/5 bg-[#306D85] flex flex-col justify-center items-center relative overflow-hidden">
          
          <div className="submarine-animation-container relative z-0 flex justify-center items-center h-full w-full">
            
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
            
          </div>

          
        </div>

        
        <div className="md:w-3/5 bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="flex justify-end mb-4">
            <Link
              to={isLogin ? `/register?role=${initialTab}` : `/login?role=${initialTab}`}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              {isLogin ? 'Sign-up for a new account' : 'Sign-in to your account'}
            </Link>
          </div>

          
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