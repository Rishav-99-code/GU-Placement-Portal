import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // For notifications (assuming you installed react-hot-toast)

// Pages
import HomePage from './pages/HomePage';
// --- MODIFICATION HERE: Update import paths for Auth pages ---
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
// --- End of MODIFICATION ---

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Add a route for forgot password page if you create one */}
            {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}

            {/* Placeholder routes for sections for smooth scrolling (optional, can also use IDs) */}
            {/* These routes point back to HomePage as the sections are part of it */}
            <Route path="/overview" element={<HomePage />} />
            <Route path="/why-recruit" element={<HomePage />} />
            <Route path="/past-recruiters" element={<HomePage />} />
            <Route path="/contact-us" element={<HomePage />} />

            {/* Later, protected routes for different roles will go here */}
            {/* Example: */}
            {/* <Route path="/student-dashboard" element={<PrivateRoute element={<StudentDashboard />} role="student" />} /> */}
            {/* <Route path="/recruiter-dashboard" element={<PrivateRoute element={<RecruiterDashboard />} role="recruiter" />} /> */}
            {/* <Route path="/coordinator-dashboard" element={<PrivateRoute element={<CoordinatorDashboard />} role="coordinator" />} /> */}

            {/* Catch-all route for 404 Not Found (optional) */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </main>
        <Footer />
        <Toaster /> {/* For toast notifications later */}
      </div>
    </Router>
  );
}

export default App;