// frontend/src/pages/Coordinator/ManageRecruitersPage.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import BackButton from '../../components/common/BackButton';
import recruiterService from '../../services/recruiterService';
import toast from 'react-hot-toast';

const ManageRecruitersPage = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [jobsModalOpen, setJobsModalOpen] = useState(false);
  const [jobsList, setJobsList] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [appsModalOpen, setAppsModalOpen] = useState(false);
  const [appsList, setAppsList] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const data = await recruiterService.getAll();
        setRecruiters(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load recruiters');
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiters();
  }, []);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      const { recruiter } = await recruiterService.approve(id);
      setRecruiters(recruiters.map(r=>r._id===id? recruiter: r));
      toast.success('Recruiter approved');
    } catch(err) {
      toast.error('Operation failed');
    } finally { setProcessingId(null);} 
  };

  const toggleSuspend = async (id, current) => {
    setProcessingId(id);
    try {
      const { recruiter } = await recruiterService.setSuspended(id, !current);
      setRecruiters(recruiters.map(r=>r._id===id? recruiter: r));
      toast.success(`Recruiter ${!current? 'suspended':'activated'}`);
    } catch(err) {
      toast.error('Failed');
    } finally { setProcessingId(null);} 
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        <BackButton to="/coordinator/dashboard" className="text-gray-400 hover:text-gray-200 mb-4" />
      </div>
      <Card className="max-w-6xl mx-auto bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-50 text-2xl">Manage Recruiters</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading…</p>
          ) : recruiters.length===0 ? (
            <p>No recruiters found.</p>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Company</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Approved</th>
                  <th className="px-4 py-2">Suspended</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recruiters.map(r=> (
                  <tr key={r._id} className="border-b border-gray-700">
                    <td className="px-4 py-2">{r.name}</td>
                    <td className="px-4 py-2">{r.recruiterProfile?.companyName || '-'} {r.recruiterProfile?.logoUrl && (<img src={`http://localhost:5000${r.recruiterProfile.logoUrl}`} alt="logo" className="h-6 inline-block ml-1 align-middle" />)}</td>
                    <td className="px-4 py-2">{r.recruiterProfile?.contactNumber || '-'}</td>
                    <td className="px-4 py-2">{r.email}</td>
                    <td className="px-4 py-2">{r.isApproved ? 'Yes':'No'}</td>
                    <td className="px-4 py-2">{r.isSuspended ? 'Yes':'No'}</td>
                    <td className="px-4 py-2 space-x-2">
                      {!r.isApproved && (
                        <Button size="sm" disabled={processingId===r._id} onClick={()=>handleApprove(r._id)}>Approve</Button>
                      )}
                      <Button size="sm" variant="outline" disabled={processingId===r._id} onClick={()=>toggleSuspend(r._id, r.isSuspended)}>
                        {r.isSuspended? 'Activate':'Suspend'}
                      </Button>
                      <Button size="sm" variant="secondary" onClick={async () => {
                        setJobsModalOpen(true);
                        setJobsLoading(true);
                        try {
                          const jobs = await recruiterService.getJobs(r._id);
                          setJobsList(jobs);
                        } catch(err){ toast.error('Failed to fetch jobs'); }
                        setJobsLoading(false);
                      }}>Jobs</Button>
                      <Button size="sm" variant="secondary" onClick={async () => {
                        setAppsModalOpen(true);
                        setAppsLoading(true);
                        try {
                          const apps = await recruiterService.getApplications(r._id);
                          setAppsList(apps);
                        } catch(err){ toast.error('Failed to fetch applications'); }
                        setAppsLoading(false);
                      }}>Applications</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      {jobsModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-50">Jobs Posted</h2>
            {jobsLoading ? (<p>Loading…</p>) : jobsList.length===0 ? (<p>No jobs.</p>) : (
              jobsList.map(job=> (
                <div key={job._id} className="border border-gray-700 p-4 rounded mb-4">
                  <p><strong>Title:</strong> {job.title}</p>
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Type:</strong> {job.type}</p>
                  <p><strong>Description:</strong> {job.description}</p>
                  {job.requirements?.length>0 && <p><strong>Requirements:</strong> {job.requirements.join(', ')}</p>}
                  {job.responsibilities?.length>0 && <p><strong>Responsibilities:</strong> {job.responsibilities.join(', ')}</p>}
                  {job.skillsRequired?.length>0 && <p><strong>Skills Required:</strong> {job.skillsRequired.join(', ')}</p>}
                  {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
                  {job.applicationDeadline && <p><strong>Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}</p>}
                </div>
              ))
            )}
            <div className="text-right mt-4">
              <Button onClick={()=>setJobsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
      {appsModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-50">Applications</h2>
            {appsLoading ? (<p>Loading…</p>) : appsList.length===0 ? (<p>No applications.</p>) : (
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Student</th>
                    <th className="px-2 py-1">Email</th>
                    <th className="px-2 py-1">USN</th>
                    <th className="px-2 py-1">Branch</th>
                    <th className="px-2 py-1">Job</th>
                    <th className="px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appsList.map(app=> (
                    <tr key={app._id} className="border-b border-gray-700">
                      <td className="px-2 py-1">{app.student?.name}</td>
                      <td className="px-2 py-1">{app.student?.email}</td>
                      <td className="px-2 py-1">{app.student?.studentProfile?.usn || '-'}</td>
                      <td className="px-2 py-1">{app.student?.studentProfile?.branch || '-'}</td>
                      <td className="px-2 py-1">{app.job?.title}</td>
                      <td className="px-2 py-1 capitalize">{app.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="text-right mt-4">
              <Button onClick={()=>setAppsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRecruitersPage; 