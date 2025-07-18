// frontend/src/components/common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-8 mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Column */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-blue-300">Placement Portal</h3>
          <p className="text-sm text-gray-400">
            Connecting students with their dream careers and companies with the brightest minds.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-300">Quick Links</h3>
          <ul className="space-y-2">
            <li><button onClick={() => window.location.href = '/#overview'} className="text-gray-400 hover:text-white text-sm">Overview</button></li>
            <li><button onClick={() => window.location.href = '/#why-recruit'} className="text-gray-400 hover:text-white text-sm">Why Recruit</button></li>
            <li><button onClick={() => window.location.href = '/#past-recruiters'} className="text-gray-400 hover:text-white text-sm">Past Recruiters</button></li>
            <li><button onClick={() => window.location.href = '/#contact-us'} className="text-gray-400 hover:text-white text-sm">Contact Us</button></li>
            <li><Link to="/login" className="text-gray-400 hover:text-white text-sm">Login</Link></li>
            <li><Link to="/register" className="text-gray-400 hover:text-white text-sm">Register</Link></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-300">Contact Info. </h3>
          <p className="text-sm text-gray-400">
            Placement Office, <br />
            [Gauhati University], <br />
            [Jalukbari, Guwahati, Assam , 781014]
          </p>
          <p className="text-sm text-gray-400 mt-2">Email: <a href="mailto:placements@example.com" className="hover:underline">placements@example.com</a></p>
          <p className="text-sm text-gray-400">Phone: [+91-XXX-XXXXXXX]</p>
        </div>

        {/* Social Media Column (Placeholder) */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-300">Follow Us</h3>
          <div className="flex space-x-4">
            {/* Replace with actual social media icons/links */}
            <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin fa-lg"></i></a>
            <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter fa-lg"></i></a>
            <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} GU Placement Portal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;