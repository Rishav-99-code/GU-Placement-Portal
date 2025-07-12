
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext'; // Import AuthContext


import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

import StudentDashboardPage from './pages/Student/StudentDashboardPage';
import RecruiterDashboardPage from './pages/Recruiter/RecruiterDashboardPage';
import CoordinatorDashboardPage from './pages/Coordinator/CoordinatorDashboardPage';

import StudentProfilePage from './pages/Student/StudentProfilePage';
import RecruiterProfilePage from './pages/Recruiter/RecruiterProfilePage';
import CoordinatorProfilePage from './pages/Coordinator/CoordinatorProfilePage';


import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';


const StudentDashboard = () => <div>Student Dashboard Content</div>;
const RecruiterDashboard = () => <div>Recruiter Dashboard Content</div>;
const CoordinatorDashboard = () => <div>Coordinator Dashboard Content</div>;



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
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dynamic redirect after login/register */}
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

            <Route path="/recruiter/dashboard" element={<PrivateRoute allowedRoles={['recruiter']}><RecruiterDashboardPage /></PrivateRoute>} />
            <Route path="/recruiter/profile" element={<PrivateRoute allowedRoles={['recruiter']}><RecruiterProfilePage /></PrivateRoute>} />

            <Route path="/coordinator/dashboard" element={<PrivateRoute allowedRoles={['coordinator']}><CoordinatorDashboardPage /></PrivateRoute>} />
            <Route path="/coordinator/profile" element={<PrivateRoute allowedRoles={['coordinator']}><CoordinatorProfilePage /></PrivateRoute>} />

            
            <Route path="/overview" element={<HomePage />} />
            <Route path="/why-recruit" element={<HomePage />} />
            <Route path="/past-recruiters" element={<HomePage />} />
            <Route path="/contact-us" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;