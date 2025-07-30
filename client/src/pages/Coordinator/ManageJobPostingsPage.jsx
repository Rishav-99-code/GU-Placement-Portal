// frontend/src/pages/Coordinator/ManageJobPostingsPage.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import BackButton from '../../components/common/BackButton';
import jobService from '../../services/jobService';
import toast from 'react-hot-toast';
import applicationService from '../../services/applicationService';
import interviewService from '../../services/interviewService';
import { useNavigate } from 'react-router-dom';

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'pending_approval', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' },
];

const ManageJobPostingsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [scheduleModal, setScheduleModal] = useState({ open:false, job:null, applicants:[], selected:[], dateTime:''});
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const all = await jobService.getAvailableJobs(); // returns all jobs
      setJobs(all);
    } catch (err) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const filtered = jobs.filter(j => {
    if (statusFilter && j.status !== statusFilter) return false;
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await jobService.updateJob(id, { status: 'active' });
      toast.success('Job approved');
      fetchJobs();
    } catch(err) { toast.error('Failed'); }
    setProcessingId(null);
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter reason for rejection:');
    if (!reason) return;
    setProcessingId(id);
    try {
      await jobService.rejectJob(id, reason);
      toast.success('Job rejected');
      fetchJobs();
    } catch(err){ toast.error('Failed'); }
    setProcessingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <BackButton to="/coordinator/dashboard" className="text-gray-400 hover:text-gray-200 mb-4" />
      </div>
      <Card className="bg-gray-800 max-w-7xl mx-auto">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-gray-50 text-2xl">Manage Job Postings</CardTitle>
          <Button onClick={() => navigate('/coordinator/create-job')} className="bg-green-600 hover:bg-green-700 text-white">
            Post New Job
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Input placeholder="Search title or company" value={search} onChange={e=>setSearch(e.target.value)} className="bg-gray-700 text-gray-100" />
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-gray-700 text-gray-100 px-2 py-1 rounded">
              {statusOptions.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {loading ? (
            <p>Loading…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">Company</th>
                    <th className="px-3 py-2">Location</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Posted Date</th>
                    <th className="px-3 py-2">Deadline</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(job => (
                    <tr key={job._id} className="border-b border-gray-700">
                      <td className="px-3 py-2">{job.title}</td>
                      <td className="px-3 py-2">{job.company}</td>
                      <td className="px-3 py-2">{job.location}</td>
                      <td className="px-3 py-2">{job.type}</td>
                      <td className="px-3 py-2">{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-2">{job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : '-'}</td>
                      <td className="px-3 py-2 capitalize">{job.status}</td>
                      <td className="px-3 py-2 space-x-2">
                        {job.status==='pending_approval' && (
                          <Button size="sm" disabled={processingId===job._id} onClick={()=>handleApprove(job._id)}>Approve</Button>
                        )}
                        {job.status==='pending_approval' && (
                          <Button size="sm" variant="destructive" disabled={processingId===job._id} onClick={()=>handleReject(job._id)}>Reject</Button>
                        )}
                        {job.status==='active' && (
                          <Button size="sm" variant="secondary" onClick={async ()=>{
                            setProcessingId(job._id);
                            try {
                              const apps = await applicationService.getApplicantsForJob(job._id);
                              setScheduleModal({ open:true, job, applicants: apps, selected:[], dateTime:''});
                            } catch(err){ toast.error('Failed to load applicants'); }
                            setProcessingId(null);
                          }}>Schedule</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {scheduleModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-50">Schedule Interview – {scheduleModal.job.title}</h2>
            {scheduleModal.applicants.length===0 ? <p>No applicants yet.</p> : (
              <div className="space-y-3">
                <div className="max-h-40 overflow-y-auto border border-gray-700 p-2 rounded">
                  {scheduleModal.applicants.map(app => (
                    <label key={app._id} className="flex items-center space-x-2 text-sm text-gray-200 mb-1">
                      <input type="checkbox" checked={scheduleModal.selected.includes(app.student._id)} onChange={e=>{
                        const sel = scheduleModal.selected;
                        if(e.target.checked) sel.push(app.student._id); else sel.splice(sel.indexOf(app.student._id),1);
                        setScheduleModal({...scheduleModal, selected:[...sel]});
                      }} />
                      <span>{app.student.name} ({app.student.email})</span>
                    </label>
                  ))}
                </div>
                <Input type="datetime-local" className="bg-gray-700 text-gray-100" value={scheduleModal.dateTime} onChange={e=>setScheduleModal({...scheduleModal,dateTime:e.target.value})} />
              </div>
            )}
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="ghost" onClick={()=>setScheduleModal({ ...scheduleModal, open:false})}>Cancel</Button>
              <Button disabled={scheduleModal.selected.length===0 || !scheduleModal.dateTime} onClick={async ()=>{
                try {
                  await interviewService.scheduleInterview(scheduleModal.job._id,{ dateTime: scheduleModal.dateTime, applicantIds: scheduleModal.selected});
                  toast.success('Interview scheduled');
                  setScheduleModal({ ...scheduleModal, open:false});
                } catch(err){ toast.error('Failed'); }
              }}>Schedule</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobPostingsPage; 