
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';
import profileService from '../../services/profileService';
import interviewService from '../../services/interviewService';
import toast from 'react-hot-toast';
import dashboardService from '../../services/dashboardService';


import { LogOutIcon } from 'lucide-react';

const CoordinatorDashboardPage = () => {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  // Store the entire user object fetched from profileService, not just coordinatorProfile
  const [fullUserDetails, setFullUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [approving, setApproving] = useState(false);

  
  const [pendingInterviews, setPendingInterviews] = useState([]);
  const [approvingInterview, setApprovingInterview] = useState(false);
  // Stats state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'coordinator') {
      navigate('/login', { replace: true });
      return;
    }

    const fetchCoordinatorProfile = async () => {
      try {
        // Fetch the complete user object, which includes coordinatorProfile nested within
        const data = await profileService.getProfile();
        setFullUserDetails(data); // Set the entire fetched user object
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch coordinator profile for dashboard:', error);
        toast.error('Failed to load dashboard data. Please try logging in again.');
        setLoading(false);
        if (error.response && error.response.status === 401) {
          logout();
        }
      }
    };
    fetchCoordinatorProfile();
    // Fetch pending jobs for approval
    const fetchPendingJobs = async () => {
      try {
        const res = await fetch('/api/jobs/all');
        const jobs = await res.json();
        setPendingJobs(jobs.filter(j => j.status === 'pending_approval'));
      } catch (err) {
        setPendingJobs([]);
      }
    };
    fetchPendingJobs();

    // Fetch pending interviews for approval
    const fetchPendingInterviews = async () => {
      try {
        const data = await interviewService.getPending();
        setPendingInterviews(data);
      } catch (err) {
        setPendingInterviews([]);
      }
    };
    fetchPendingInterviews();

    // Save for later use
    CoordinatorDashboardPage.fetchPendingJobs = fetchPendingJobs;
    CoordinatorDashboardPage.fetchPendingInterviews = fetchPendingInterviews;
  }, [authState, navigate, logout]);

  // Fetch coordinator dashboard stats once on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getCoordinatorStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch coordinator stats:', err);
        toast.error('Failed to load coordinator statistics');
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !fullUserDetails) { // Ensure fullUserDetails is available
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
        <p className="text-xl">Loading coordinator dashboard...</p>
      </div>
    );
  }

  // Use fullUserDetails for all dynamic datayut 
  const coordinatorName = fullUserDetails.name || 'Coordinator';
  const coordinatorEmail = fullUserDetails.email || 'coordinator@example.com';
  const coordinatorProfile = fullUserDetails.coordinatorProfile || fullUserDetails.coordinatorDetails || {}; // Fallback for legacy key

  const coordinatorAvatar = fullUserDetails.profilePicUrl || `https://ui-avatars.com/api/?name=${coordinatorName.split(' ').join('+')}&background=8B5CF6&color=fff&size=128`;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] overflow-hidden bg-gray-900 text-gray-200">
      {/* Left Panel: Profile, Welcome, and Quick Actions */}
      <div className="w-full lg:w-1/2 bg-gray-800 p-4 sm:p-8 lg:p-12 flex flex-col justify-between">
        
        {/* Coordinator Profile Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Avatar className="w-24 h-24 mr-4 ring-2 ring-purple-600 ring-offset-2 ring-offset-gray-800">
              <AvatarImage src={coordinatorAvatar} alt={`${coordinatorName} Avatar`} />
              <AvatarFallback className="text-3xl font-bold text-gray-300">{coordinatorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-200">Welcome, {coordinatorName}!</h2>
              <p className="text-sm text-gray-400">{coordinatorEmail}</p>
            </div>
          </div>

          <div className="space-y-2 text-gray-300">
            {/* Use coordinatorProfile for specific fields */}
            <p><strong className="font-medium text-gray-100">Role:</strong> {coordinatorProfile.coordinatorType || 'N/A'}</p>
            <p><strong className="font-medium text-gray-100">Department:</strong> {coordinatorProfile.department || 'N/A'}</p>
            <p><strong className="font-medium text-gray-100">Branch:</strong> {coordinatorProfile.branch || 'N/A'}</p>
          </div>
          <Button
            className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-md transition-all duration-200 active:scale-[0.98] active:shadow-inner"
            asChild
          >
            <Link to="/coordinator/profile">Edit Coordinator Profile</Link>
          </Button>
        </div>

        {/* Quick Actions / Coordinator Tools */}
        <div>
          <h3 className="text-xl font-bold text-gray-50 mb-4">Coordinator Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              className="group h-28 text-md bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner"
              asChild
            >
              <Link to="/coordinator/manage-students">
                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">🎓</span>
                <span className="font-medium text-center">Manage Students</span>
              </Link>
            </Button>
            <Button
              className="group h-28 text-md bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner"
              asChild
            >
              <Link to="/coordinator/manage-recruiters">
                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">🏢</span>
                <span className="font-medium text-center">Manage Recruiters</span>
              </Link>
            </Button>
            <Button
              className="group h-28 text-md bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner"
              asChild
            >
              <Link to="/coordinator/manage-jobs">
                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">📋</span>
                <span className="font-medium text-center">Manage Job Postings</span>
              </Link>
            </Button>
             <Button
              className="group h-28 text-md bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner"
              asChild
            >
              <Link to="/coordinator/manage-events">
                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">🎊</span>
                <span className="font-medium text-center">Manage Events</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel: Pending Jobs and Stats */}
      <div className="w-full lg:w-1/2 bg-gray-900 text-gray-200 p-4 sm:p-8 lg:p-12 flex flex-col justify-between">
        
        {/* Top Right Controls (Logout, Change Password, Theme Toggle) */}
        <div className="flex justify-end items-center space-x-4 mb-8">
            <Button variant="ghost" className="text-purple-400 hover:text-purple-300 active:scale-[0.98]" asChild>
              <Link to="/change-password">Change Password</Link>
            </Button>
            <Button variant="ghost" className="text-red-400 hover:text-red-300 active:scale-[0.98]" onClick={logout}>
              <LogOutIcon className="inline-block h-4 w-4 mr-1" /> Logout
            </Button>
            <button className="text-gray-400 hover:text-gray-300 active:scale-[0.98]">☀️</button>
        </div>

        {/* Pending Job Approvals */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-50 mb-4">Pending Job Approvals</h3>
          {pendingJobs.length === 0 ? (
            <p className="text-gray-400">No jobs pending approval.</p>
          ) : (
            <div className="space-y-4">
              {pendingJobs.map(job => (
                <Card key={job._id} className="p-4 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardTitle className="text-lg font-bold text-blue-400">{job.company}</CardTitle>
                  <CardContent>
                    <p><strong>Title:</strong> {job.title}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Type:</strong> {job.type}</p>
                    <p><strong>Description:</strong> {job.description}</p>
                    <p><strong>Company Details:</strong> {job.companyDetails}</p>
                    {job.logoUrl && <img src={job.logoUrl} alt="Logo" className="h-10 mt-2" />}
                    <Button
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                      disabled={approving}
                      onClick={async () => {
                        setApproving(true);
                        try {
                          await fetch(`/api/jobs/${job._id}/approve`, { method: 'PATCH' });
                          // Re-fetch jobs after approval
                          await CoordinatorDashboardPage.fetchPendingJobs();
                          toast.success('Job approved!');
                        } catch (err) {
                          toast.error('Failed to approve job');
                        } finally {
                          setApproving(false);
                        }
                      }}
                    >Approve</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pending Interview Approvals */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-50 mb-4">Pending Interview Schedules</h3>
          {pendingInterviews.length === 0 ? (
            <p className="text-gray-400">No interviews awaiting approval.</p>
          ) : (
            <div className="space-y-4">
              {pendingInterviews.map((iv) => (
                <Card key={iv._id} className="p-4 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardTitle className="text-lg font-bold text-purple-400">
                    {iv.job?.title || 'Job'} – {iv.applicants?.length} Applicant{iv.applicants?.length === 1 ? '' : 's'}
                  </CardTitle>
                  <CardContent>
                    <p><strong>Company:</strong> {iv.job?.company || 'N/A'}</p>
                    <p><strong>Date&nbsp;/&nbsp;Time:</strong> {new Date(iv.dateTime).toLocaleString()}</p>
                    <p><strong>Recruiter:</strong> {iv.recruiter?.name || 'N/A'} ({iv.recruiter?.email})</p>
                    <div className="mt-4 flex space-x-2">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={approvingInterview}
                        onClick={async () => {
                          setApprovingInterview(true);
                          try {
                            await interviewService.approve(iv._id);
                            await CoordinatorDashboardPage.fetchPendingInterviews();
                            toast.success('Interview approved – students notified.');
                          } catch (err) {
                            toast.error('Failed to approve interview');
                          } finally {
                            setApprovingInterview(false);
                          }
                        }}
                      >
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        {/* Coordinator Quick Stats */}
        <Card className="p-6 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 mt-auto">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-bold text-gray-50">Overall Stats</CardTitle>
          </CardHeader>
          <Separator className="w-full mb-4 bg-gray-700" />
          <CardContent className="p-0 text-gray-300 space-y-2">
            <p><strong className="font-semibold text-gray-100">Total Registered Students:</strong> {statsLoading ? '…' : stats?.totalStudents ?? '-'}</p>
            <p><strong className="font-semibold text-gray-100">Approved Student Profiles:</strong> {statsLoading ? '…' : stats?.approvedStudentProfiles ?? '-'}</p>
            <p><strong className="font-semibold text-gray-100">Total Registered Recruiters:</strong> {statsLoading ? '…' : stats?.totalRecruiters ?? '-'}</p>
            <p><strong className="font-semibold text-gray-100">Approved Recruiter Profiles:</strong> {statsLoading ? '…' : stats?.approvedRecruiterProfiles ?? '-'}</p>
            <p><strong className="font-semibold text-gray-100">Active Job Postings:</strong> {statsLoading ? '…' : stats?.activeJobPostings ?? '-'}</p>
            <p><strong className="font-semibold text-gray-100">Interviews Scheduled (This Week):</strong> {statsLoading ? '…' : stats?.interviewsScheduledThisWeek ?? '-'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoordinatorDashboardPage;