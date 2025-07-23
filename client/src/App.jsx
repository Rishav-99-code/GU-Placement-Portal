// frontend/src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext'; // Import AuthContext

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
import StudentApplicationsPage from './pages/Student/StudentApplicationsPage'; // NEW: Import StudentApplicationsPage
import JobDetailsPage from './pages/Student/JobDetailsPage';

import CreateJobPage from './pages/Recruiter/CreateJobPage';
import ViewApplicationsPage from './pages/Recruiter/ViewApplicationsPage';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';


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
              path="/dashboard" // This is a general route users might try to access
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
            <Route path="/student/jobs/:jobId" element={<PrivateRoute allowedRoles={['student']}><JobDetailsPage /></PrivateRoute>} />

            <Route path="/recruiter/dashboard" element={<PrivateRoute allowedRoles={['recruiter']}><RecruiterDashboardPage /></PrivateRoute>} />
            <Route path="/recruiter/profile" element={<PrivateRoute allowedRoles={['recruiter']}><RecruiterProfilePage /></PrivateRoute>} />
            <Route path="/recruiter/create-job" element={<PrivateRoute allowedRoles={['recruiter']}><CreateJobPage /></PrivateRoute>} />
            <Route path="/recruiter/view-applications" element={<PrivateRoute allowedRoles={['recruiter']}><ViewApplicationsPage /></PrivateRoute>} />

            <Route path="/coordinator/dashboard" element={<PrivateRoute allowedRoles={['coordinator']}><CoordinatorDashboardPage /></PrivateRoute>} />
            <Route path="/coordinator/profile" element={<PrivateRoute allowedRoles={['coordinator']}><CoordinatorProfilePage /></PrivateRoute>} />

            {/* General marketing/info pages */}
            <Route path="/overview" element={<HomePage />} />
            <Route path="/why-recruit" element={<HomePage />} />
            <Route path="/past-recruiters" element={<HomePage />} />
            <Route path="/contact-us" element={<HomePage />} />

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<p className="text-center mt-20 text-gray-700 dark:text-gray-300">404 - Page Not Found</p>} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;