
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button'; 
import { Menu, X } from 'lucide-react'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleNavLinkClick = (id) => {
    setIsOpen(false); 
    if (location.pathname !== '/') {
      
      window.location.href = `/#${id}`; 
    } else {
      
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Site Title */}
        <Link to="/" className="text-2xl font-bold text-blue-700">
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
          <hr className="my-2" />
        </div>
      )}
    </nav>
  );
};

export default Navbar;