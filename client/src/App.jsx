import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext'; 
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPassword';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';

import StudentDashboardPage from './pages/Student/StudentDashboardPage';

import RecruiterDashboardPage from './pages/Recruiter/RecruiterDashboardPage';
import CoordinatorDashboardPage from './pages/Coordinator/CoordinatorDashboardPage';

import StudentProfilePage from './pages/Student/StudentProfilePage';
import RecruiterProfilePage from './pages/Recruiter/RecruiterProfilePage';
import CoordinatorProfilePage from './pages/Coordinator/CoordinatorProfilePage';

import AvailableJobsPage from './pages/Student/AvailableJobsPage';
import StudentApplicationsPage from './pages/Student/StudentApplicationsPage'; 
import StudentInterviewSchedulePage from './pages/Student/StudentInterviewSchedulePage'; 
import StudentFAQPage from './pages/Student/StudentFAQPage';
import JobDetailsPage from './pages/Student/JobDetailsPage';

import CreateJobPage from './pages/Recruiter/CreateJobPage';
import ViewApplicationsPage from './pages/Recruiter/ViewApplicationsPage';
import ManageStudentsPage from './pages/Recruiter/ManageStudentsPage';
import ManageJobsPage from './pages/Recruiter/ManageJobsPage';
import EditJobPage from './pages/Recruiter/EditJobPage';
import JobApplicantsPage from './pages/Recruiter/JobApplicantsPage';
import RecruiterAnalytics from './pages/RecruiterAnalytics';

import ManageStudentProfiles from './pages/Coordinator/ManageStudentProfiles';
import ManageRecruitersPage from './pages/Coordinator/ManageRecruitersPage';
import ManageJobPostingsPage from './pages/Coordinator/ManageJobPostingsPage';
import ManageEventsPage from './pages/Coordinator/ManageEventsPage';


import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import ChangePasswordPage from './pages/common/ChangePasswordPage';


function App() {
  const { authState } = useContext(AuthContext);

  const getProfileRoute = (user) => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student': return '/student/profile';
      case 'recruiter': return '/recruiter/profile';
      case 'coordinator': return '/coordinator/profile';
      default: return '/';
    }
  };

  const getDashboardRoute = (user) => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student': return '/student/dashboard';
      case 'recruiter': return '/recruiter/dashboard';
      case 'coordinator': return '/coordinator/dashboard';
      default: return '/';
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:resettoken" element={<ResetPasswordPage />} />

            {/* Dynamic redirect after login/register (or if trying to access /dashboard directly) */}
            <Route
              path="/dashboard" 
              element={
                authState.isAuthenticated ? (
                  authState.user?.isProfileComplete ? (
                    <Navigate to={getDashboardRoute(authState.user)} replace />
                  ) : (
                    <Navigate to={getProfileRoute(authState.user)} replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Specific profile/dashboard routes are protected by PrivateRoute */}
            <Route path="/student/dashboard" element={<PrivateRoute allowedRoles={['student']}><StudentDashboardPage /></PrivateRoute>} />
            <Route path="/student/profile" element={<PrivateRoute allowedRoles={['student']}><StudentProfilePage /></PrivateRoute>} />
            <Route path="/student/jobs" element={<PrivateRoute allowedRoles={['student']}><AvailableJobsPage /></PrivateRoute>} />
            <Route path="/student/applications" element={<PrivateRoute allowedRoles={['student']}><StudentApplicationsPage /></PrivateRoute>} /> {/* NEW: StudentApplicationsPage Route */}
            <Route path="/student/interviews" element={<PrivateRoute allowedRoles={['student']}><StudentInterviewSchedulePage /></PrivateRoute>} />
            <Route path="/student/faq" element={<PrivateRoute allowedRoles={['student']}><StudentFAQPage /></PrivateRoute>} />
            <Route path="/student/jobs/:jobId" element={<PrivateRoute allowedRoles={['student']}><JobDetailsPage /></PrivateRoute>} />

            <Route path="/recruiter/dashboard" element={<PrivateRoute allowedRoles={['recruiter']}><RecruiterDashboardPage /></PrivateRoute>} />
            <Route path="/recruiter/profile" element={<PrivateRoute allowedRoles={['recruiter']}><RecruiterProfilePage /></PrivateRoute>} />
            <Route path="/recruiter/create-job" element={<PrivateRoute allowedRoles={['recruiter']}><CreateJobPage /></PrivateRoute>} />
            <Route path="/recruiter/edit-job/:jobId" element={<PrivateRoute allowedRoles={['recruiter']}><EditJobPage /></PrivateRoute>} />
            <Route path="/recruiter/view-applications" element={<PrivateRoute allowedRoles={['recruiter']}><ViewApplicationsPage /></PrivateRoute>} />
            <Route path="/recruiter/manage-students" element={<PrivateRoute allowedRoles={['recruiter']}><ManageStudentsPage /></PrivateRoute>} />
            <Route path="/recruiter/manage-jobs" element={<PrivateRoute allowedRoles={['recruiter']}><ManageJobsPage /></PrivateRoute>} />
            <Route path="/recruiter/job/:jobId/applicants" element={<PrivateRoute allowedRoles={['recruiter']}><JobApplicantsPage /></PrivateRoute>} />
            <Route path="/recruiter/analytics" element={<PrivateRoute allowedRoles={['recruiter']}><RecruiterAnalytics /></PrivateRoute>} />

            <Route path="/coordinator/dashboard" element={<PrivateRoute allowedRoles={['coordinator']}><CoordinatorDashboardPage /></PrivateRoute>} />
            <Route path="/coordinator/profile" element={<PrivateRoute allowedRoles={['coordinator']}><CoordinatorProfilePage /></PrivateRoute>} />
            <Route path="/coordinator/manage-students" element={<PrivateRoute allowedRoles={['coordinator']}><ManageStudentProfiles /></PrivateRoute>} />
            <Route path="/coordinator/manage-recruiters" element={<PrivateRoute allowedRoles={['coordinator']}><ManageRecruitersPage /></PrivateRoute>} />
            <Route path="/coordinator/manage-jobs" element={<PrivateRoute allowedRoles={['coordinator']}><ManageJobPostingsPage /></PrivateRoute>} />
            <Route path="/coordinator/manage-events" element={<PrivateRoute allowedRoles={['coordinator']}><ManageEventsPage /></PrivateRoute>} />
            <Route path="/coordinator/create-job" element={<PrivateRoute allowedRoles={['coordinator']}><CreateJobPage /></PrivateRoute>} />

            {/* General marketing/info pages */}
            <Route path="/overview" element={<HomePage />} />
            <Route path="/why-recruit" element={<HomePage />} />
            <Route path="/past-recruiters" element={<HomePage />} />
            <Route path="/contact-us" element={<HomePage />} />
            <Route path="/change-password" element={<PrivateRoute allowedRoles={['student','recruiter','coordinator']}><ChangePasswordPage /></PrivateRoute>} />

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<p className="text-center mt-20 text-gray-700 dark:text-gray-300">404 - Page Not Found</p>} />
          </Routes>
        </main>
        {!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && <Footer />}
        <Toaster />
      </div>
    </Router>
  );
}

export default App;