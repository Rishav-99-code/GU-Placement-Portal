// frontend/src/pages/Recruiter/RecruiterDashboardPage.js
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';

const RecruiterDashboardPage = () => {
  const { authState } = useContext(AuthContext);
  const user = authState.user;
  const userName = user?.name || 'Recruiter';
  const profilePic = user?.profilePicUrl || 'https://via.placeholder.com/150';

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] overflow-hidden bg-gray-900 text-gray-200">
      
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 bg-gray-800 p-4 sm:p-8 lg:p-12 flex flex-col justify-between">
        
        {/* Profile & Welcome */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Avatar className="w-24 h-24 mr-4 ring-2 ring-blue-600 ring-offset-2 ring-offset-gray-800">
              <AvatarImage src={profilePic} alt="Profile Picture" />
              <AvatarFallback className="text-3xl font-bold text-gray-300">{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-200">Welcome, {userName}!</h2>
              <p className="text-sm text-gray-400">{user?.companyName || 'Your Company'}</p>
            </div>
          </div>

          <div className="space-y-2 text-gray-300">
            <p><strong className="font-medium text-gray-100">Email:</strong> {user?.email || 'unknown@company.com'}</p>
            <p><strong className="font-medium text-gray-100">Contact:</strong> {user?.phoneNumber || '0000000000'}</p>
          </div>

          <Button className="mt-6 w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition-all duration-200 active:scale-[0.98] active:shadow-inner">
            <Link to="/recruiter/profile">Edit Profile</Link>
          </Button>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-bold text-gray-50 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild className="group h-28 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-[1.02] shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner">
              <Link to="#">
                <span className="text-4xl mb-2 group-hover:-translate-y-1">📝</span>
                <span className="font-medium">Post Job</span>
              </Link>
            </Button>
            <Button asChild className="group h-28 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-[1.02] shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner">
              <Link to="#">
                <span className="text-4xl mb-2 group-hover:-translate-y-1">📄</span>
                <span className="font-medium">Manage Jobs</span>
              </Link>
            </Button>
            <Button asChild className="group h-28 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-[1.02] shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner">
              <Link to="#">
                <span className="text-4xl mb-2 group-hover:-translate-y-1">👥</span>
                <span className="font-medium">View Applicants</span>
              </Link>
            </Button>
            <Button asChild className="group h-28 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-[1.02] shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner">
              <Link to="#">
                <span className="text-4xl mb-2 group-hover:-translate-y-1">📊</span>
                <span className="font-medium">Analytics</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 bg-gray-900 text-gray-200 p-4 sm:p-8 lg:p-12 flex flex-col justify-between">
        
        {/* Top Navbar Actions */}
        <div className="flex justify-end items-center space-x-4 mb-8">
          <Button variant="ghost" className="text-blue-400 hover:text-blue-300 active:scale-[0.98]">
            <Link to="#">Change Password</Link>
          </Button>
          <Button variant="ghost" className="text-red-400 hover:text-red-300 active:scale-[0.98]">
            <Link to="#">Logout</Link>
          </Button>
          <button className="text-gray-400 hover:text-gray-300 active:scale-[0.98]">☀️</button>
        </div>

        {/* Latest Updates */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-50 mb-4">Latest Updates</h3>
          <div className="space-y-4">
            <Card className="p-4 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <p className="font-semibold text-blue-400">Reminder</p>
              <p className="text-sm mb-1">Don’t forget to review pending applications for the <strong>Backend Developer</strong> role.</p>
              <p className="text-xs text-gray-400">10 minutes ago</p>
            </Card>
            <Card className="p-4 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <p className="font-semibold text-green-400">New Applicants</p>
              <p className="text-sm mb-1">3 new candidates applied for <strong>Frontend Engineer</strong>.</p>
              <p className="text-xs text-gray-400">Today</p>
            </Card>
            <Card className="p-4 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <p className="font-semibold text-purple-400">Event</p>
              <p className="text-sm mb-1">Join the <strong>Virtual Career Fair</strong> this Friday at 2 PM.</p>
              <p className="text-xs text-gray-400">2 days ago</p>
            </Card>
          </div>
        </div>

        {/* Quick Facts */}
        <Card className="p-6 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 mt-auto">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-bold text-gray-50">Quick Facts</CardTitle>
          </CardHeader>
          <Separator className="w-full mb-4 bg-gray-700" />
          <CardContent className="p-0 text-gray-300 space-y-2">
            <p><strong className="font-semibold text-gray-100">Jobs Posted:</strong> 5</p>
            <p><strong className="font-semibold text-gray-100">Active Listings:</strong> 3</p>
            <p><strong className="font-semibold text-gray-100">Total Applicants:</strong> 27</p>
            <p><strong className="font-semibold text-gray-100">Interviews Scheduled:</strong> 4</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
