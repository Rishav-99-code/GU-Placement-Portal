// frontend/src/pages/Recruiter/JobApplicantsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import applicationService from '../../services/applicationService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import BackButton from '../../components/common/BackButton';
import toast from 'react-hot-toast';

const JobApplicantsPage = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const apps = await applicationService.getApplicantsForJob(jobId);
        setApplicants(apps);
        if (apps[0]?.jobTitle) setJobTitle(apps[0].jobTitle);
      } catch (err) {
        console.error('Fetch applicants error', err);
        toast.error('Failed to load applicants');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        <BackButton className="text-gray-400 hover:text-gray-200 mb-4" />
      </div>
      <Card className="max-w-6xl mx-auto bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-50 text-2xl">Applicants – {jobTitle || 'Job'}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading…</p>
          ) : applicants.length === 0 ? (
            <p>No applicants yet.</p>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">USN</th>
                  <th className="px-4 py-2">Branch</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app._id} className="border-b border-gray-700">
                    <td className="px-4 py-2">{app.student?.name}</td>
                    <td className="px-4 py-2">{app.student?.email}</td>
                    <td className="px-4 py-2">{app.student?.studentProfile?.usn || '-'}</td>
                    <td className="px-4 py-2">{app.student?.studentProfile?.branch || '-'}</td>
                    <td className="px-4 py-2 capitalize">{app.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicantsPage; 