import React, { useEffect, useState, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';

const StudentProfilePage = () => {
  const { authState } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedJobs = await jobService.getAvailableJobs();
        setJobs(fetchedJobs);
      } catch (err) {
        setError('Failed to load jobs. Please try again later.');
        toast.error('Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    if (!authState.isAuthenticated || authState.user?.role !== 'student') {
      toast.error('Please log in as a student to apply for jobs.');
      return;
    }
    if (!authState.user?.isProfileComplete) {
      toast.error('Please complete your profile before applying for jobs.');
      return;
    }
    setApplyingJobId(jobId);
    try {
      await applicationService.applyForJob(jobId, {});
      toast.success('Application submitted successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit application. Please try again.';
      toast.error(errorMessage);
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-900 text-gray-200 min-h-[calc(100vh-64px)]">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Student Profile</h1>
      {/* ...profile details here if needed... */}
      <Separator className="mb-8 bg-gray-700" />
      <h2 className="text-2xl font-semibold mb-4 text-gray-100">Available Jobs</h2>
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px] text-gray-300">
          <p className="text-xl">Loading available jobs...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[200px] text-red-400">
          <p className="text-xl">{error}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] text-gray-400">
          <p className="text-xl">No jobs available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job._id} className="bg-gray-800 text-gray-200 shadow-lg rounded-lg p-4">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-50">{job.title}</CardTitle>
                <CardDescription className="text-md text-gray-400">{job.company}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Location:</strong> {job.location || 'N/A'}</p>
                <p><strong>Type:</strong> <Badge className="bg-purple-600 hover:bg-purple-700 text-white">{job.type || 'N/A'}</Badge></p>
                <p><strong>Salary:</strong> {job.salary ? `₹${job.salary.toLocaleString()}` : 'Negotiable'}</p>
                <p><strong>Required Skills:</strong> {job.skillsRequired?.length > 0 ? job.skillsRequired.map((skill, idx) => (
                  <Badge key={idx} className="mr-1 mb-1 bg-gray-600 hover:bg-gray-700 text-gray-100">{skill}</Badge>
                )) : 'N/A'}</p>
                <Button
                  onClick={() => handleApply(job._id)}
                  disabled={applyingJobId === job._id}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-md mt-2"
                >
                  {applyingJobId === job._id ? 'Applying...' : 'Apply Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProfilePage;
