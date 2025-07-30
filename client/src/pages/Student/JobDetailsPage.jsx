// frontend/src/pages/Student/JobDetailsPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { Badge } from '../../components/ui/badge';
import BackButton from '../../components/common/BackButton';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService'; // Import application service
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext'; // To get user details for application

const JobDetailsPage = () => {
  const { jobId } = useParams(); // Get jobId from URL parameters
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext); // Get authenticated user's info

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedJob = await jobService.getJobDetails(jobId);
        setJob(fetchedJob);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again later.');
        toast.error('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleApply = async () => {
    if (!authState.isAuthenticated || authState.user?.role !== 'student') {
      toast.error('Please log in as a student to apply for jobs.');
      navigate('/login');
      return;
    }

    // Optional: Check if student profile is complete before applying
    if (!authState.user?.isProfileComplete) {
      toast.error('Please complete your profile before applying for jobs.');
      navigate('/student/profile'); // Redirect to profile completion
      return;
    }

    setIsApplying(true);
    try {
      // You might pass additional data from the student's profile or a modal form if needed
      // For now, we'll just submit the student ID and job ID
      const applicationData = {
        // You can add fields like coverLetter: '...', resumeLink: '...' if your backend supports it
        // Or if the backend expects basic student info, ensure your backend pulls it from req.user
      };
      await applicationService.applyForJob(jobId, applicationData);
      toast.success('Application submitted successfully!');
      navigate('/student/applications'); // Redirect to applications page
    } catch (err) {
      console.error('Error submitting application:', err);
      const errorMessage = err.response?.data?.message || 'Failed to submit application. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-900 text-gray-300">
        <p className="text-xl">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-900 text-red-400">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-900 text-gray-400">
        <p className="text-xl">Job not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-900 text-gray-200 min-h-[calc(100vh-64px)]">
      <BackButton to="/student/jobs" className="text-purple-400 hover:text-purple-300 mb-6" />

      <Card className="bg-gray-800 text-gray-200 shadow-xl rounded-lg p-6 lg:p-8">
        <CardHeader className="border-b border-gray-700 pb-4 mb-4">
          <CardTitle className="text-3xl font-bold text-gray-50 mb-2">{job.title}</CardTitle>
          <CardDescription className="text-lg text-gray-400">{job.company}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><strong>Location:</strong> {job.location || 'N/A'}</p>
            <p><strong>Type:</strong> <Badge className="bg-purple-600 hover:bg-purple-700 text-white">{job.type || 'N/A'}</Badge></p>
            <p><strong>Posted On:</strong> {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Salary:</strong> {job.salary ? `₹${job.salary.toLocaleString()}` : 'Negotiable'}</p>
            <p className="md:col-span-2"><strong>Required Skills:</strong> {job.skillsRequired && job.skillsRequired.length > 0 ? job.skillsRequired.map((skill, index) => (
                <Badge key={index} className="mr-1 mb-1 bg-gray-600 hover:bg-gray-700 text-gray-100">{skill}</Badge>
            )) : 'N/A'}</p>
          </div>

          <Separator className="bg-gray-700" />

          <div>
            <h3 className="text-xl font-semibold text-gray-50 mb-3">Job Description</h3>
            <div className="prose prose-invert max-w-none text-gray-300">
              <p>{job.description || 'No detailed description provided.'}</p>
              {/* You can parse rich text descriptions here if your backend supports it */}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-50 mb-3">Responsibilities</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {job.responsibilities && job.responsibilities.length > 0 ? (
                job.responsibilities.map((resp, index) => <li key={index}>{resp}</li>)
              ) : (
                <li>No specific responsibilities listed.</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-50 mb-3">Qualifications</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {job.qualifications && job.qualifications.length > 0 ? (
                job.qualifications.map((qual, index) => <li key={index}>{qual}</li>)
              ) : (
                <li>No specific qualifications listed.</li>
              )}
            </ul>
          </div>

          {job.applicationDeadline && (
            <p className="text-sm text-red-400 font-medium">
              Application Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
            </p>
          )}

          <div className="flex justify-center mt-6">
            <Button
              onClick={handleApply}
              disabled={isApplying}
              className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-8 rounded-md transition-all duration-200 active:scale-[0.98] active:shadow-inner"
            >
              {isApplying ? 'Applying...' : 'Apply Now'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetailsPage;