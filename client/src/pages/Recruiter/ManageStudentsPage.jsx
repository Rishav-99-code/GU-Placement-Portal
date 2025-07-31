import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import applicationService from '../../services/applicationService';
import jobService from '../../services/jobService';
import { Button } from '../../components/ui/button';
import BackButton from '../../components/common/BackButton';
import toast from 'react-hot-toast';

const ManageStudentsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
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
      if (data.length === 0) {
        toast.info('No applications found for this job yet.');
      }
    } catch (err) {
      console.error('Error fetching applicants:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load applicants.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      setLoading(true);
      await applicationService.updateApplicationStatus(applicationId, status);
      
      setApplicants(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status } : app
      ));
      
      const actionText = status === 'selected' ? 'selected' : 'rejected';
      toast.success(`Candidate ${actionText} successfully and email notification sent!`);
    } catch (err) {
      console.error('Error updating application status:', err);
      const errorMessage = err.response?.data?.message || `Failed to ${status} candidate.`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-6xl">
        <BackButton to="/recruiter/dashboard" className="text-gray-400 hover:text-gray-200 mb-4" />
      </div>
      <Card className="w-full max-w-6xl p-8 bg-gray-800 rounded-lg shadow-md">
        <CardHeader className="mb-6">
          <CardTitle className="text-2xl font-bold text-gray-50">Manage Students</CardTitle>
          <p className="text-gray-400">Select and manage candidates for your job postings</p>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label htmlFor="jobSelect" className="block mb-2 text-gray-300 font-medium">Select Job:</label>
            <select
              id="jobSelect"
              value={selectedJobId}
              onChange={handleJobChange}
              className="w-full p-3 rounded bg-gray-700 text-gray-100 border border-gray-600"
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
              {loading ? 'Loading...' : 'View Candidates'}
            </Button>
          </div>
          
          {error && <p className="text-red-400 mb-4">{error}</p>}
          
          {applicants.length > 0 && (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full bg-gray-900 text-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-4 py-3 text-left">Profile</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">USN</th>
                    <th className="px-4 py-3 text-left">Program</th>
                    <th className="px-4 py-3 text-left">Branch</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Resume</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((app) => (
                    <tr key={app._id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="px-4 py-3">
                        {app.student?.studentProfile?.profilePicUrl ? (
                          <img
                            src={`http://localhost:5000${app.student.studentProfile.profilePicUrl}`}
                            alt={app.student.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                            <span className="text-gray-300 font-semibold">
                              {app.student?.name?.charAt(0) || '?'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">{app.student?.name || '-'}</td>
                      <td className="px-4 py-3">{app.student?.email || '-'}</td>
                      <td className="px-4 py-3">{app.student?.studentProfile?.usn || '-'}</td>
                      <td className="px-4 py-3">{app.student?.studentProfile?.program || '-'}</td>
                      <td className="px-4 py-3">{app.student?.studentProfile?.branch || '-'}</td>
                      <td className="px-4 py-3">{app.student?.studentProfile?.phoneNumber || '-'}</td>
                      <td className="px-4 py-3">
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
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === 'selected' ? 'bg-green-600 text-white' :
                          app.status === 'rejected' ? 'bg-red-600 text-white' :
                          app.status === 'interview' ? 'bg-blue-600 text-white' :
                          'bg-yellow-600 text-white'
                        }`}>
                          {app.status || 'applied'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {app.status !== 'selected' && app.status !== 'rejected' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleStatusUpdate(app._id, 'selected')}
                              disabled={loading}
                            >
                              ✓ Select
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleStatusUpdate(app._id, 'rejected')}
                              disabled={loading}
                            >
                              ✗ Reject
                            </Button>
                          </div>
                        )}
                        {(app.status === 'selected' || app.status === 'rejected') && (
                          <span className="text-gray-400 text-sm">
                            {app.status === 'selected' ? '✓ Selected' : '✗ Rejected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {applicants.length === 0 && selectedJobId && !loading && !error && (
            <div className="text-center py-8">
              <p className="text-gray-400">No candidates found for this job yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageStudentsPage;