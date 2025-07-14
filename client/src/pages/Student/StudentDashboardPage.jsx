// frontend/src/pages/Student/StudentDashboardPage.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';
import { Link } from 'react-router-dom';
import profileService from '../../services/profileService';
import toast from 'react-hot-toast';

const StudentDashboardPage = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'student') {
      navigate('/login');
    } else {
      const fetchStudentProfile = async () => {
        try {
          const data = await profileService.getProfile();
          setStudentDetails(data.studentDetails || {});
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch student profile for dashboard:', error);
          toast.error('Failed to load dashboard data. Please try logging in again.');
          setLoading(false);
        }
      };
      fetchStudentProfile();
    }
  }, [authState, navigate]);

  if (loading) {
    // Dark mode loading state
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
        <p className="text-xl">Loading student dashboard...</p>
      </div>
    );
  }

  const userName = authState.user?.name || 'Student';
  const profilePic = studentDetails.profilePicUrl || 'https://via.placeholder.com/150'; // Default placeholder

  return (
    // Main container for the dark mode theme
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] overflow-hidden bg-gray-900 text-gray-200">
      {/* Left Half (Darker Background for Cards) */}
      <div className="w-full lg:w-1/2 bg-gray-800 p-4 sm:p-8 lg:p-12 flex flex-col justify-between">
        {/* Profile and Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Avatar className="w-24 h-24 mr-4 ring-2 ring-purple-600 ring-offset-2 ring-offset-gray-800">
              <AvatarImage src={profilePic} alt="Profile Picture" />
              <AvatarFallback className="text-3xl font-bold text-gray-300">{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-200">Hey, {userName}!</h2>
              {/* Assuming you might have a USN or ID here as in the example image */}
              <p className="text-sm text-gray-400">{studentDetails.usn || '123456789'}</p>
            </div>
          </div>

          <div className="space-y-2 text-gray-300">
            <p><strong className="font-medium text-gray-100">Course:</strong> {studentDetails.program || 'B.Tech'}, {studentDetails.branch || 'Computer Science & Engineering'}</p>
            {/* Removed DOB: <p><strong className="font-medium text-gray-100">DOB:</strong> {studentDetails.dateOfBirth || '29-Feb-2000'}</p> */}
            <p><strong className="font-medium text-gray-100">Contact:</strong> {studentDetails.phoneNumber || '12345/67890'}</p>
            <p><strong className="font-medium text-gray-100">Email:</strong> {authState.user?.email || 'unknown@gmail.com'}</p>
            {/* Removed Address: <p><strong className="font-medium text-gray-100">Address:</strong> {studentDetails.address || 'Ghost Town Road, New York, America'}</p> */}
          </div>
          {/* Edit Profile Button - New color scheme, active pop effect */}
          <Button
            className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-md transition-all duration-200 active:scale-[0.98] active:shadow-inner"
          >
            <Link to="/student/profile">Edit Profile</Link>
          </Button>
        </div>

        {/* Quick Links / Navigation Card (Adapted for the left side) */}
        <div>
          <h3 className="text-xl font-bold text-gray-50 mb-4">Student Resources</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              className="group h-28 text-md bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner"
              asChild
            >
              <Link to="#">
                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">📋</span>
                <span className="font-medium">My Applications</span>
              </Link>
            </Button>
            <Button
              className="group h-28 text-md bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner"
              asChild
            >
              <Link to="#">
                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">🏢</span>
                <span className="font-medium">Available Jobs</span>
              </Link>
            </Button>
            <Button
              className="group h-28 text-md bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner"
              asChild
            >
              <Link to="#">
                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">📅</span>
                <span className="font-medium">Interview Schedule</span>
              </Link>
            </Button>
            <Button
              className="group h-28 text-md bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner"
              asChild
            >
              <Link to="#">
                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">❓</span>
                <span className="font-medium">FAQ & Support</span>
              </Link>
            </Button>
            <Button
              className="group h-28 text-md bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner"
              asChild
            >
              <Link to="#">
                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">🔔</span>
                <span className="font-medium">Notifications</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Right Half (Even Darker Background for Main Content) */}
      <div className="w-full lg:w-1/2 bg-gray-900 text-gray-200 p-4 sm:p-8 lg:p-12 flex flex-col justify-between">
        {/* Top Navbar Section (Mock - Actual Navbar is separate) */}
        <div className="flex justify-end items-center space-x-4 mb-8">
            <Button variant="ghost" className="text-purple-400 hover:text-purple-300 active:scale-[0.98]">
              <Link to="#">Change Password</Link>
            </Button>
            <Button variant="ghost" className="text-red-400 hover:text-red-300 active:scale-[0.98]">
              <Link to="#" onClick={() => { /* Implement logout logic here */ }}>Logout</Link>
            </Button>
            {/* Dark mode toggle - already in dark mode so this would be a light mode toggle */}
            <button className="text-gray-400 hover:text-gray-300 active:scale-[0.98]">☀️</button>
        </div>

        {/* Announcements Section - Focused on Jobs, Placements, Internships */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-50 mb-4">Latest Opportunities</h3>
          <div className="space-y-4">
            <Card className="p-4 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <p className="font-semibold text-purple-400">Job Alert 🚀</p>
              <p className="text-sm mb-1">New **Software Engineer** openings at **Tech Solutions Inc.** Apply by July 25th!</p>
              <p className="text-xs text-gray-400">5 minutes ago</p>
            </Card>
            <Card className="p-4 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <p className="font-semibold text-emerald-400">Placement Drive</p>
              <p className="text-sm mb-1">**Infosys Campus Drive** for 2026 Batch - Registrations open now!</p>
              <p className="text-xs text-gray-400">Yesterday</p>
            </Card>
            <Card className="p-4 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <p className="font-semibold text-amber-400">Internship Opportunity</p>
              <p className="text-sm mb-1">Summer **Data Science Internship** at **Analytics Corp.** Apply ASAP!</p>
              <p className="text-xs text-gray-400">3 days ago</p>
            </Card>
            <Card className="p-4 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <p className="font-semibold text-sky-400">Career Workshop 🎓</p>
              <p className="text-sm mb-1">Workshop on **'Cracking Technical Interviews'** this Friday, 3 PM.</p>
              <p className="text-xs text-gray-400">July 8, 2025</p>
            </Card>
            {/* You can add more job/placement/internship related announcements here */}
          </div>
        </div>

        {/* The 'Teachers on leave' section was previously removed */}
        {/* Quick Facts card, adjusted to fit the dark theme and new content */}
        <Card className="p-6 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 mt-auto">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-bold text-gray-50">Quick Facts</CardTitle>
          </CardHeader>
          <Separator className="w-full mb-4 bg-gray-700" />
          <CardContent className="p-0 text-gray-300 space-y-2">
            <p><strong className="font-semibold text-gray-100">Total Applications:</strong> 12</p>
            <p><strong className="font-semibold text-gray-100">Interviews Scheduled:</strong> 3</p>
            <p><strong className="font-semibold text-gray-100">Offers Received:</strong> 1</p>
            <p><strong className="font-semibold text-gray-100">Profile Views:</strong> 45</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboardPage;