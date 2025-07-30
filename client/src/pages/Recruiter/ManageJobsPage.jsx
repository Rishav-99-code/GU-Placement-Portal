// frontend/src/pages/Recruiter/ManageJobsPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';
import interviewService from '../../services/interviewService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import BackButton from '../../components/common/BackButton';
import toast from 'react-hot-toast';

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalJob, setModalJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [dateTime, setDateTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const myJobs = await jobService.getMyJobs();
        setJobs(myJobs);
      } catch (err) {
        console.error('Failed to load jobs:', err);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const openScheduleModal = async (job) => {
    try {
      const apps = await applicationService.getApplicantsForJob(job._id);
      setApplicants(apps);
      setModalJob(job);
      setSelectedApplicants([]);
      setDateTime('');
      setShowModal(true);
    } catch (err) {
      console.error('Failed to load applicants:', err);
      toast.error('Failed to load applicants');
    }
  };

  const handleSchedule = async () => {
    if (!dateTime || selectedApplicants.length === 0) {
      toast.error('Select date/time and at least one applicant');
      return;
    }
    try {
      await interviewService.scheduleInterview(modalJob._id, {
        dateTime,
        applicantIds: selectedApplicants,
      });
      toast.success('Interview request sent to coordinator');
      setShowModal(false);
    } catch (err) {
      console.error('Schedule error:', err);
      toast.error(err.response?.data?.message || 'Failed to schedule');
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await jobService.deleteJob(jobId);
      setJobs(jobs.filter(j => j._id !== jobId));
      toast.success('Job deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <p className="text-center p-8 text-gray-300">Loading jobs...</p>;
  if (error) return <p className="text-center p-8 text-red-400">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        <BackButton to="/recruiter/dashboard" className="text-gray-400 hover:text-gray-200 mb-4" />
      </div>
      <Card className="max-w-6xl mx-auto bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-50 text-2xl">Manage Posted Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p>No jobs posted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id} className="border-b border-gray-700">
                      <td className="px-4 py-2">{job.title}</td>
                      <td className="px-4 py-2 capitalize">{job.status}</td>
                      <td className="px-4 py-2 space-x-2">
                        <Button size="sm" onClick={() => navigate(`/recruiter/edit-job/${job._id}`)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(job._id)}>Delete</Button>
                        <Button size="sm" onClick={() => navigate(`/recruiter/job/${job._id}/applicants`)}>View Applicants</Button>
                        <Button size="sm" onClick={() => openScheduleModal(job)}>Schedule Interview</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-50">Schedule Interview – {modalJob.title}</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <Label className="text-gray-300">Select Applicants</Label>
                {applicants.length === 0 ? (
                  <p className="text-sm text-gray-400">No applicants yet.</p>
                ) : (
                  <div className="max-h-40 overflow-y-auto border border-gray-700 p-2 rounded">
                    {applicants.map(app => (
                      <label key={app._id} className="flex items-center space-x-2 text-sm text-gray-200 mb-1">
                        <input
                          type="checkbox"
                          checked={selectedApplicants.includes(app.student._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedApplicants([...selectedApplicants, app.student._id]);
                            } else {
                              setSelectedApplicants(selectedApplicants.filter(id => id !== app.student._id));
                            }
                          }}
                        />
                        <span>{app.student.name} ({app.student.email})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="datetime" className="text-gray-300">Date & Time</Label>
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={dateTime}
                  onChange={e => setDateTime(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-100 mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSchedule}>Send to Coordinator</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobsPage;
