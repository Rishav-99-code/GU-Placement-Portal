import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button'; 
import { Menu, X, User, LogOut, KeyRound } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu.jsx';
import guLogo from '../../assets/images/gu_logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { authState, logout } = useContext(AuthContext);

  const getDashboardLink = () => {
    if (!authState.isAuthenticated) return '/login';
    switch (authState.user.role) {
      case 'student': return '/student/dashboard';
      case 'recruiter': return '/recruiter/dashboard';
      case 'coordinator': return '/coordinator/dashboard';
      default: return '/';
    }
  };

  const handleNavLinkClick = (id) => {
    setIsOpen(false); 
    if (location.pathname !== '/') {
      // Navigate to homepage with hash
      navigate(`/#${id}`);
    } else {
      // Already on homepage, just scroll to section
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-2 md:px-6">
        <div className="flex items-center flex-1 -ml-2 md:-ml-4">
          {/* Logo/Site Title */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors duration-200 mr-8"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            {/* University Logo */}
            <div className="flex-shrink-0">
              <img 
                src={guLogo} 
                alt="University of Gauhati Logo" 
                className="h-10 w-10 md:h-12 md:w-12 object-contain transition-transform duration-200 hover:scale-105"
                onError={(e) => {
                  // Fallback to text if logo doesn't load
                  e.target.outerHTML = '<div class="h-10 w-10 md:h-12 md:w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">GU</div>';
                }}
              />
            </div>
            
            {/* Site Title */}
            <div className="flex flex-col">
              <span className="text-base md:text-lg leading-tight">Placement Cell</span>
              <span className="text-xs md:text-sm text-blue-600 leading-tight hidden sm:block">Gauhati University</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <button
            onClick={() => handleNavLinkClick('overview')}
            className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 transition-colors duration-200"
          >
            Overview
          </button>
          <button
            onClick={() => handleNavLinkClick('why-recruit')}
            className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 transition-colors duration-200"
          >
            Why Recruit
          </button>
          <button
            onClick={() => handleNavLinkClick('past-recruiters')}
            className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 transition-colors duration-200"
          >
            Past Recruiters
          </button>
          <button
            onClick={() => handleNavLinkClick('contact-us')}
            className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 transition-colors duration-200"
          >
            Contact Us
          </button>

          {/* User Menu */}
          {authState.isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors duration-200"
                >
                  {(() => {
                    // Get profile picture URL based on user role
                    let profilePicUrl = null;
                    
                    if (authState.user?.role === 'student' && authState.user?.studentProfile?.profilePicUrl) {
                      profilePicUrl = authState.user.studentProfile.profilePicUrl;
                    } else if (authState.user?.role === 'recruiter' && authState.user?.recruiterProfile?.logoUrl) {
                      profilePicUrl = authState.user.recruiterProfile.logoUrl;
                    }

                    // Convert relative path to absolute URL
                    if (profilePicUrl && !profilePicUrl.startsWith('http')) {
                      profilePicUrl = `http://localhost:5000${profilePicUrl}`;
                    }

                    return profilePicUrl ? (
                      <img 
                        src={profilePicUrl} 
                        alt="profile" 
                        className="absolute inset-0 h-full w-full object-cover rounded-full"
                        onError={(e) => {
                          // Hide broken image and show fallback
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-lg font-medium">
                          {authState.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    );
                  })()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-white rounded-md border border-gray-200 shadow-lg mt-2"
              >
                <DropdownMenuItem 
                  onClick={() => navigate(getDashboardLink())}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/change-password')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  <span>Change Password</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={logout}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default"
              onClick={() => navigate(getDashboardLink())}
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white mt-2 py-2 shadow-lg rounded-md absolute w-full left-0 z-40">
          <button
            onClick={() => handleNavLinkClick('overview')}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Overview
          </button>
          <button
            onClick={() => handleNavLinkClick('why-recruit')}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Why Recruit
          </button>
          <button
            onClick={() => handleNavLinkClick('past-recruiters')}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Past Recruiters
          </button>
          <button
            onClick={() => handleNavLinkClick('contact-us')}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Contact Us
          </button>

          {/* Mobile User Menu */}
          {authState.isAuthenticated ? (
            <>
              <div className="border-t border-gray-200 my-2" />
              <button
                onClick={() => navigate(getDashboardLink())}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/change-password')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Change Password
              </button>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <div className="border-t border-gray-200 my-2" />
              <button
                onClick={() => navigate('/login')}
                className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100 font-medium"
              >
                Login
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;