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
      window.history.pushState({}, '', `/#${id}`);
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Site Title */}
        <Link 
          to="/" 
          className="text-2xl font-bold text-blue-700"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          Placement Cell,GU
        </Link>

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
                  {authState.user?.profilePicture ? (
                    <img 
                      src={authState.user.profilePicture} 
                      alt="profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">
                        {authState.user?.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
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
        <div className="md:hidden">
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