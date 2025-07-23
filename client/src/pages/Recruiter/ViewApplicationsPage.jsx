// frontend/src/pages/Recruiter/ViewApplicationsPage.jsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import applicationService from '../../services/applicationService';
import jobService from '../../services/jobService';
import { Button } from '../../components/ui/button';
import toast from 'react-hot-toast';

const ViewApplicationsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    // Fetch jobs posted by this recruiter
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const allJobs = await jobService.getMyJobs();
        setJobs(allJobs);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to load jobs.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleJobChange = (e) => {
    setSelectedJobId(e.target.value);
    setApplicants([]);
    setError(null);
  };

  const handleFetchApplicants = async () => {
    if (!selectedJobId) {
      setError('Please select a job first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getApplicantsForJob(selectedJobId);
      setApplicants(data);
      // If we got data successfully but there are no applicants, show a toast
      if (data.length === 0) {
        toast.info('No applications found for this job yet.');
      }
    } catch (err) {
      console.error('Error fetching applicants:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load applicants.';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (err.response?.status === 403) {
        setError('You are not authorized to view these applications.');
      } else if (err.response?.status === 404) {
        setError('Job not found or has been deleted.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <Card className="w-full max-w-3xl p-8 bg-gray-800 rounded-lg shadow-md">
        <CardHeader className="mb-6">
          <CardTitle className="text-2xl font-bold text-gray-50">View Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="jobSelect" className="block mb-2 text-gray-300 font-medium">Select Job:</label>
            <select
              id="jobSelect"
              value={selectedJobId}
              onChange={handleJobChange}
              className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
            >
              <option value="">-- Select a Job --</option>
              {jobs.map((job) => (
                <option key={job._id || job.id} value={job._id || job.id}>
                  {job.title} @ {job.company}
                </option>
              ))}
            </select>
            <Button
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleFetchApplicants}
              disabled={!selectedJobId || loading}
            >
              {loading ? 'Loading...' : 'View Applicants'}
            </Button>
          </div>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          {applicants.length > 0 && (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full bg-gray-900 text-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Profile Picture</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">USN</th>
                    <th className="px-4 py-2 text-left">Program</th>
                    <th className="px-4 py-2 text-left">Branch</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Resume</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((app) => (
                    <tr key={app._id} className="border-b border-gray-700">
                      <td className="px-4 py-2">
                        {app.student?.studentProfile?.profilePicUrl ? (
                          <img
                            src={`http://localhost:5000${app.student.studentProfile.profilePicUrl}`}
                            alt={app.student.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-2">{app.student?.name || '-'}</td>
                      <td className="px-4 py-2">{app.student?.email || '-'}</td>
                      <td className="px-4 py-2">{app.student?.studentProfile?.usn || '-'}</td>
                      <td className="px-4 py-2">{app.student?.studentProfile?.program || '-'}</td>
                      <td className="px-4 py-2">{app.student?.studentProfile?.branch || '-'}</td>
                      <td className="px-4 py-2">{app.student?.studentProfile?.phoneNumber || '-'}</td>
                      <td className="px-4 py-2">
                        {app.student?.studentProfile?.resumeUrl ? (
                          <a
                            href={`http://localhost:5000${app.student.studentProfile.resumeUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:underline"
                          >
                            View Resume
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-2">{app.status || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {applicants.length === 0 && selectedJobId && !loading && !error && (
            <p className="text-gray-400 mt-6">No applicants for this job yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewApplicationsPage;
