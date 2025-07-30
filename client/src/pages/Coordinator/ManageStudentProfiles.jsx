// frontend/src/pages/Coordinator/ManageStudentProfiles.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import studentService from '../../services/studentService';
import { Button } from '../../components/ui/button';
import BackButton from '../../components/common/BackButton';
import toast from 'react-hot-toast';
import applicationService from '../../services/applicationService';

const ManageStudentProfiles = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [companiesMap, setCompaniesMap] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentService.getAll();
        setStudents(data);
      } catch (err) {
        console.error('Failed to fetch students:', err);
        toast.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    const fetchApplications = async () => {
      try {
        const apps = await applicationService.getAllForCoordinator();
        const map = {};
        apps.forEach(app => {
          const sid = app.student?._id;
          const company = app.job?.company;
          if (sid && company) {
            if (!map[sid]) map[sid] = new Set();
            map[sid].add(company);
          }
        });
        // convert set to array
        const obj = {};
        for (const k in map) obj[k] = Array.from(map[k]);
        setCompaniesMap(obj);
      } catch(err){ console.error(err); }
    };
    fetchStudents();
    fetchApplications();
  }, []);

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await studentService.approve(id);
      setStudents(students.map(s => s._id === id ? { ...s, isApproved: true } : s));
      toast.success('Student approved');
    } catch (err) {
      console.error('Approve error:', err);
      toast.error('Failed to approve student');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-4xl">
        <BackButton to="/coordinator/dashboard" className="text-gray-400 hover:text-gray-200 mb-4" />
      </div>
      <Card className="w-full max-w-4xl p-8 bg-gray-800 rounded-lg shadow-md">
        <CardHeader className="mb-6">
          <CardTitle className="text-2xl font-bold text-gray-50">Manage Student Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading students…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">USN</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Branch</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Semester</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Contact</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Resume</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Blacklist</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Companies Applied</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="px-4 py-2 whitespace-nowrap">{student.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{student.studentProfile?.usn || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{student.email}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{student.studentProfile?.branch || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${student.isApproved ? 'bg-green-700 text-green-100' : 'bg-yellow-700 text-yellow-100'}`}>{student.isApproved ? 'Approved' : 'Pending'}</span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{student.studentProfile?.currentSemester || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{student.studentProfile?.phoneNumber || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {student.studentProfile?.resumeUrl ? (
                          <a href={`http://localhost:5000${student.studentProfile.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">View</a>
                        ) : (
                          '—'
                        )}
                        <label className="ml-2 text-sm cursor-pointer text-purple-400 underline">
                          Upload
                          <input type="file" accept="application/pdf" hidden onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              (async () => {
                                try {
                                  const { student: updated } = await studentService.uploadResume(student._id, file);
                                  setStudents(students.map(s=>s._id===updated._id? updated: s));
                                  toast.success('Resume uploaded');
                                } catch(err) {
                                  toast.error('Upload failed');
                                }
                              })();
                            }
                          }} />
                        </label>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Button variant="outline" size="sm" onClick={async ()=>{
                          const newFlag=!student.isBlacklisted;
                          try {
                            const { student: updated } = await studentService.setBlacklist(student._id, newFlag);
                            setStudents(students.map(s=>s._id===updated._id? updated: s));
                            toast.success(`Student ${newFlag?'blacklisted':'unblacklisted'}`);
                          } catch(err) {
                            toast.error('Operation failed');
                          }
                        }}>
                          {student.isBlacklisted? 'Unblacklist':'Blacklist'}
                        </Button>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {companiesMap[student._id]?.join(', ') || '—'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {!student.isApproved && (
                          <Button size="sm" disabled={approvingId===student._id} onClick={() => handleApprove(student._id)}>
                            {approvingId===student._id? 'Approving…':'Approve'}
                          </Button>
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
    </div>
  );
};

export default ManageStudentProfiles;
