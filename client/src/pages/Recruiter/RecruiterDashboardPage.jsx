
import React, { useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';

const RecruiterDashboardPage = () => {
  const { authState, logout } = useContext(AuthContext);
  const user = authState.user;
  const userName = user?.name || 'Recruiter';
  const logoUrl = user?.recruiterProfile?.logoUrl
    ? `http://localhost:5000${user.recruiterProfile.logoUrl}`
    : 'https://placehold.co/150x150?text=Logo';

  // State for dashboard stats
  const [stats, setStats] = React.useState({ jobsPosted: 0, activeListings: 0, totalApplicants: 0, interviewsScheduled: 0 });
  const [latestUpdates, setLatestUpdates] = React.useState([]);

  // Keep track of previously fetched applicants to detect new ones
  const applicantsMapRef = useRef({}); // { [jobId]: Application[] }

  React.useEffect(() => {
    let intervalId;

    const collectUpdates = async () => {
      try {
        // Fetch recruiter jobs
        const jobs = await jobService.getMyJobs();

        // Fetch applicants for each job concurrently
        const applicantsArr = await Promise.all(jobs.map(job => applicationService.getApplicantsForJob(job._id)));

        // Update stats (jobs, listings, applicants, interviews)
        const totalApplicants = applicantsArr.reduce((sum, arr) => sum + arr.length, 0);
        const interviewsScheduled = applicantsArr.flat().filter(app => app.status === 'interview').length;
        setStats({
          jobsPosted: jobs.length,
          activeListings: jobs.filter(j => j.status === 'active').length,
          totalApplicants,
          interviewsScheduled,
        });

        const updates = [];
        const newApplicantsMap = { ...applicantsMapRef.current };

        applicantsArr.forEach((applicants, idx) => {
          const job = jobs[idx];

          // 1. Reminder to review pending applications
          const pendingCount = applicants.filter(app => app.status === 'pending').length;
          if (pendingCount > 0) {
            updates.push({
              type: 'Reminder',
              color: 'blue',
              message: `You have ${pendingCount} pending application${pendingCount > 1 ? 's' : ''} for ${job.title}.`,
              time: new Date().toLocaleTimeString(),
            });
          }

          // 2. Detect new applicants compared to previous fetch
          const prevCount = newApplicantsMap[job._id]?.length || 0;
          if (applicants.length > prevCount) {
            const diff = applicants.length - prevCount;
            updates.push({
              type: 'New Applicants',
              color: 'green',
              message: `${diff} new candidate${diff > 1 ? 's have' : ' has'} applied for ${job.title}.`,
              time: new Date().toLocaleTimeString(),
            });
          }

          // Update map for future comparisons
          newApplicantsMap[job._id] = applicants;
        });

        // Store latest applicant snapshot
        applicantsMapRef.current = newApplicantsMap;

        // Prepend new updates (if any) to the list, keep most recent 20
        if (updates.length > 0) {
          setLatestUpdates(prev => [...updates, ...prev].slice(0, 20));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    // Initial fetch
    collectUpdates();

    // Poll every 30 seconds for real-time-ish updates
    intervalId = setInterval(collectUpdates, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] overflow-hidden bg-gray-900 text-gray-200">
      
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 bg-gray-800 p-4 sm:p-8 lg:p-12 flex flex-col justify-between">
        
        {/* Profile & Welcome */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Avatar className="w-24 h-24 mr-4 ring-2 ring-blue-600 ring-offset-2 ring-offset-gray-800">
              <AvatarImage src={logoUrl} alt="Company Logo" />
              <AvatarFallback className="text-3xl font-bold text-gray-300">{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-200">Welcome, {userName}!</h2>
              <p className="text-sm text-gray-400">{user?.recruiterProfile?.companyName || 'Your Company'}</p>
            </div>
          </div>

          <div className="space-y-2 text-gray-300">
            <p><strong className="font-medium text-gray-100">Email:</strong> {user?.email || 'unknown@company.com'}</p>
            <p><strong className="font-medium text-gray-100">Contact:</strong> {user?.recruiterProfile?.contactNumber || '00000000'}</p>
          </div>

          <Button asChild className="mt-6 w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition-all duration-200 active:scale-[0.98] active:shadow-inner">
            <Link to="/recruiter/profile">Edit Profile</Link>
          </Button>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-bold text-gray-50 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild className="group h-28 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-[1.02] shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner">
              <Link to="/recruiter/create-job">
                <span className="text-4xl mb-2 group-hover:-translate-y-1">📝</span>
                <span className="font-medium">Post Job</span>
              </Link>
            </Button>
            <Button asChild className="group h-28 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-[1.02] shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner">
              <Link to="/recruiter/manage-jobs">
                <span className="text-4xl mb-2 group-hover:-translate-y-1">📄</span>
                <span className="font-medium">Manage Jobs</span>
              </Link>
            </Button>
            <Button asChild className="group h-28 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-[1.02] shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner">
              <Link to="/recruiter/manage-students">
                <span className="text-4xl mb-2 group-hover:-translate-y-1">👥</span>
                <span className="font-medium">Manage Students</span>
              </Link>
            </Button>
            <Button asChild className="group h-28 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-[1.02] shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner">
              <Link to="/recruiter/analytics">
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
          <Button variant="ghost" className="text-blue-400 hover:text-blue-300 active:scale-[0.98]" asChild>
            <Link to="/change-password">Change Password</Link>
          </Button>
          <Button variant="ghost" className="text-red-400 hover:text-red-300 active:scale-[0.98]" onClick={logout}>
            Logout
          </Button>
          <button className="text-gray-400 hover:text-gray-300 active:scale-[0.98]">☀️</button>
        </div>

        {/* Latest Updates */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-50 mb-4">Latest Updates</h3>
          <div className="space-y-4">
            {latestUpdates.map((u, i) => (
              <Card key={i} className="p-4 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <p className={`font-semibold text-${u.color}-400`}>{u.type}</p>
                <p className="text-sm mb-1">{u.message}</p>
                <p className="text-xs text-gray-400">{u.time}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Facts */}
        <Card className="p-6 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 mt-auto">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-bold text-gray-50">Quick Facts</CardTitle>
          </CardHeader>
          <Separator className="w-full mb-4 bg-gray-700" />
          <CardContent className="p-0 text-gray-300 space-y-2">
            <p><strong className="font-semibold text-gray-100">Jobs Posted:</strong> {stats.jobsPosted}</p>
            <p><strong className="font-semibold text-gray-100">Active Listings:</strong> {stats.activeListings}</p>
            <p><strong className="font-semibold text-gray-100">Total Applicants:</strong> {stats.totalApplicants}</p>
            <p><strong className="font-semibold text-gray-100">Interviews Scheduled:</strong> {stats.interviewsScheduled}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
