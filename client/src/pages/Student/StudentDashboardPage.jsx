import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import BackButton from '../../components/common/BackButton';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';
import profileService from '../../services/profileService';
import interviewService from '../../services/interviewService';
import applicationService from '../../services/applicationService';
import toast from 'react-hot-toast';
import eventService from '../../services/eventService';

const StudentDashboardPage = () => {
    const { authState, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // This state will specifically hold the studentDetails object
    const [studentDetails, setStudentDetails] = useState({});
    // This state might hold the top-level user details (like name, email, profilePicUrl)
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [interviewSchedules, setInterviewSchedules] = useState([]);
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({
        totalApplications: 0,
        interviewsScheduled: 0,
        offersReceived: 0
    });

    useEffect(() => {
        if (!authState.isAuthenticated || authState.user?.role !== 'student') {
            navigate('/login', { replace: true });
            return;
        }

        // --- Profile Completion Check (Still important) ---
        // Assuming authState.user has an `isProfileComplete` flag set by your backend/login
        if (!authState.user?.isProfileComplete) {
            navigate('/student/profile', { replace: true });
            return;
        }

        const fetchStudentProfile = async () => {
            try {
                // profileService.getProfile() should return the full user object
                // which includes top-level user fields AND a nested studentDetails object.
                const data = await profileService.getProfile();

                // Set top-level user details
                setUserDetails(data);
                // Set nested student-specific details (studentProfile from backend)
                setStudentDetails(data.studentProfile || {});

                // Fetch interview schedules in parallel
                console.log('🔍 Fetching interviews for user:', authState.user?.email);
                const interviews = await interviewService.getMySchedules();
                console.log('📅 Received interviews:', interviews);
                setInterviewSchedules(interviews);

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch student profile for dashboard:', error);
                toast.error('Failed to load dashboard data. Please try logging in again.');
                setLoading(false);
                if (error.response && error.response.status === 401) {
                    logout();
                }
            }
        };

        const fetchStats = async () => {
            try {
                console.log('🔍 Fetching student stats for user:', authState.user?.email);
                const studentStats = await applicationService.getStudentStats();
                console.log('📊 Received stats:', studentStats);
                setStats(studentStats);
            } catch (error) {
                console.error('Failed to fetch student statistics:', error);
                // Don't show error toast for stats as it's not critical
                // Keep default values (0, 0, 0)
            }
        };
        fetchStudentProfile();
        fetchStats();
    }, [authState, navigate, logout]);

    useEffect(()=>{
      const fetchEvents = async () => {
        try {
          const data = await eventService.getEvents();
          setEvents(data.slice(0,4)); // latest 4
        } catch(err) { console.error(err); }
      };
      fetchEvents();
    },[]);

    const typeColor = (type)=>{
      switch(type.toLowerCase()){
        case 'hackathon': return 'text-amber-400';
        case 'workshop': return 'text-sky-400';
        case 'opportunity': return 'text-emerald-400';
        case 'seminar': return 'text-indigo-400';
        default: return 'text-purple-400';
      }
    };

    if (loading || !userDetails) {
        return null; // No loading screen, just return null
    }

    // Access properties from userDetails for top-level info
    const userName = userDetails.name || 'Student';
    // Prefer the uploaded profile picture if available, otherwise fall back to generated avatar
    const profilePic = studentDetails.profilePicUrl
        ? `http://localhost:5000${studentDetails.profilePicUrl}`
        : `https://ui-avatars.com/api/?name=${userName.split(' ').join('+')}&background=8B5CF6&color=fff&size=128`;

    // Access properties from studentDetails state for student-specific info
    // The studentDetails state is already updated correctly from `data.studentDetails` above.

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] overflow-hidden bg-gray-900 text-gray-200">
            {/* Left Half (Darker Background for Cards) */}
            <div className="w-full lg:w-1/2 bg-gray-800 p-4 sm:p-8 lg:p-12 flex flex-col">
                <BackButton className="absolute top-4 left-4" />
                {/* Profile and Welcome Section */}
                <div className="mb-8">
                    <div className="flex items-center mb-6">
                        <Avatar className="w-24 h-24 mr-4 ring-2 ring-purple-600 ring-offset-2 ring-offset-gray-800">
                            <AvatarImage src={profilePic} alt="Profile Picture" />
                            <AvatarFallback className="text-3xl font-bold text-gray-300">{userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-200">Hey, {userName}!</h2>
                            {/* Use studentDetails.usn directly */}
                            <p className="text-sm text-gray-400">{studentDetails.usn || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="space-y-2 text-gray-300">
                        {/* Use studentDetails.program and studentDetails.branch directly */}
                        <p><strong className="font-medium text-gray-100">Course:</strong> {studentDetails.program || 'N/A'}{studentDetails.branch ? `, ${studentDetails.branch}` : ''}</p>
                        {/* Use studentDetails.phoneNumber directly */}
                        <p><strong className="font-medium text-gray-100">Contact:</strong> {studentDetails.phoneNumber || 'N/A'}</p>
                        {/* Use userDetails.email for top-level email */}
                        <p><strong className="font-medium text-gray-100">Email:</strong> {userDetails.email || 'N/A'}</p>
                    </div>
                    {/* Edit Profile Button */}
                    <Button
                        className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-md transition-all duration-200 active:scale-[0.98] active:shadow-inner"
                        asChild
                    >
                        <Link to="/student/profile">Edit Profile</Link>
                    </Button>
                </div>

                {/* Quick Links / Navigation Card - Moved right after Edit Profile */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-50 mb-4">Student Resources</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button
                            className="group h-28 text-md bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner"
                            asChild
                        >
                            <Link to="/student/applications"> {/* Updated Link */}
                                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">📋</span>
                                <span className="font-medium">My Applications</span>
                            </Link>
                        </Button>
                        <Button
                            className="group h-28 text-md bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner"
                            asChild
                        >
                            <Link to="/student/jobs"> {/* Updated Link */}
                                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">🏢</span>
                                <span className="font-medium">Available Jobs</span>
                            </Link>
                        </Button>
                        <Button
                            className="group h-28 text-md bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner"
                            asChild
                        >
                            <Link to="/student/interviews">
                                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">📅</span>
                                <span className="font-medium">Interview Schedule</span>
                            </Link>
                        </Button>
                        <Button
                            className="group h-28 text-md bg-gray-700 text-gray-200 shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-center items-center rounded-lg active:scale-[0.98] active:shadow-inner"
                            asChild
                        >
                            <Link to="/student/faq">
                                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">❓</span>
                                <span className="font-medium">FAQ & Support</span>
                            </Link>
                        </Button>

                    </div>
                </div>
            </div>

            {/* Right Half (Even Darker Background for Main Content) */}
            <div className="w-full lg:w-1/2 bg-gray-900 text-gray-200 p-4 sm:p-8 lg:p-12 flex flex-col justify-between">


                {/* Latest Events & Opportunities Section */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-50 mb-4">Latest Events & Opportunities</h3>
                    {(() => {
                        // Filter out past events as a backup (backend should already handle this)
                        const now = new Date();
                        const upcomingEvents = events.filter(event => 
                            new Date(event.dateTime) >= now.setHours(0, 0, 0, 0)
                        );
                        
                        return upcomingEvents.length === 0 ? (
                            <p className="text-gray-400">No upcoming events or opportunities.</p>
                        ) : (
                            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                                {upcomingEvents.map(event => {
                                    const eventDate = new Date(event.dateTime);
                                    const isToday = eventDate.toDateString() === now.toDateString();
                                    const isTomorrow = eventDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
                                    const daysUntil = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
                                    
                                    return (
                                        <Card key={event._id} className={`p-4 bg-gray-800 text-gray-300 rounded-lg shadow-md ${
                                            isToday ? 'border-2 border-green-500' : 
                                            isTomorrow ? 'border-2 border-blue-500' : 
                                            'hover:shadow-lg transition-shadow duration-200'
                                        }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-semibold text-green-400">{event.title}</p>
                                                {isToday && <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">TODAY</span>}
                                                {isTomorrow && <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">TOMORROW</span>}
                                            </div>
                                            <p className="text-sm mb-2 text-gray-300">{event.description}</p>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">
                                                    📅 {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                                <span className={`font-medium ${
                                                    isToday ? 'text-green-400' : 
                                                    isTomorrow ? 'text-blue-400' : 
                                                    'text-gray-500'
                                                }`}>
                                                    {isToday ? '🔥 Happening today!' : 
                                                     isTomorrow ? '⏰ Tomorrow' :
                                                     daysUntil === 0 ? 'Today' :
                                                     `In ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
                                                </span>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>

                {/* Upcoming Interviews */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-50 mb-4">Upcoming Interviews</h3>
                    {(() => {
                        // Filter out past interviews as a backup (backend should already handle this)
                        const now = new Date();
                        const upcomingInterviews = interviewSchedules
                            .filter(iv => new Date(iv.dateTime) > now)
                            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)); // Sort by date: soonest first
                        
                        return upcomingInterviews.length === 0 ? (
                            <p className="text-gray-400">No upcoming interviews.</p>
                        ) : (
                            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                                {upcomingInterviews.map((iv, index) => {
                                    const interviewDate = new Date(iv.dateTime);
                                    const isToday = interviewDate.toDateString() === now.toDateString();
                                    const isTomorrow = interviewDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
                                    const daysUntil = Math.ceil((interviewDate - now) / (1000 * 60 * 60 * 24));
                                    
                                    return (
                                        <Card key={iv._id} className={`p-4 bg-gray-800 text-gray-300 rounded-lg shadow-md transition-all duration-200 ${
                                            isToday ? 'border-2 border-yellow-500 shadow-yellow-500/20' : 
                                            isTomorrow ? 'border-2 border-blue-500 shadow-blue-500/20' : 
                                            index === 0 && !isToday && !isTomorrow ? 'border border-purple-500' : // Highlight next upcoming
                                            'hover:shadow-lg'
                                        }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-semibold text-purple-400">{iv.job?.title || 'Interview'}</p>
                                                <div className="flex items-center gap-2">
                                                    {isToday && <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded font-medium">TODAY</span>}
                                                    {isTomorrow && <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-medium">TOMORROW</span>}
                                                    {index === 0 && !isToday && !isTomorrow && <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded font-medium">NEXT</span>}
                                                </div>
                                            </div>
                                            <p className="text-sm mb-1 text-gray-300">Company: {iv.job?.company || 'N/A'}</p>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400">
                                                    📅 {interviewDate.toLocaleDateString()} at {interviewDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                                <span className={`text-xs font-medium ${
                                                    isToday ? 'text-yellow-400' : 
                                                    isTomorrow ? 'text-blue-400' : 
                                                    'text-gray-500'
                                                }`}>
                                                    {isToday ? '🔥 Today!' : 
                                                     isTomorrow ? '⏰ Tomorrow' :
                                                     `In ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
                                                </span>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>

                {/* Quick Facts card */}
                <Card className="p-6 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 mt-auto">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-xl font-bold text-gray-50">Quick Facts</CardTitle>
                    </CardHeader>
                    <Separator className="w-full mb-4 bg-gray-700" />
                    <CardContent className="p-0 text-gray-300 space-y-3">
                        <div className="flex items-center justify-between">
                            <span><strong className="font-semibold text-gray-100">Total Applications:</strong></span>
                            <span className="text-lg font-bold text-blue-400">{stats.totalApplications}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span><strong className="font-semibold text-gray-100">Interviews Scheduled:</strong></span>
                            <span className="text-lg font-bold text-yellow-400">{stats.interviewsScheduled}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span><strong className="font-semibold text-gray-100">Offers Received:</strong></span>
                            <span className="text-lg font-bold text-green-400">{stats.offersReceived}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StudentDashboardPage;