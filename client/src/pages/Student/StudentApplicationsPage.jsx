// frontend/src/pages/Student/StudentApplicationsPage.js
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import BackButton from '../../components/common/BackButton';
import applicationService from '../../services/applicationService';
import interviewService from '../../services/interviewService';
import toast from 'react-hot-toast';

const StudentApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [interviewMap, setInterviewMap] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const [apps, interviews] = await Promise.all([
          applicationService.getStudentApplications(),
          interviewService.getMySchedules(),
        ]);

        const iMap = {};
        interviews.forEach(iv => {
          if (iv.job) iMap[iv.job._id] = iv.dateTime;
        });
        setInterviewMap(iMap);
        setApplications(apps);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load your applications. Please try again later.');
        toast.error('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'under review':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'interview scheduled':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'rejected':
        return 'bg-red-600 hover:bg-red-700';
      case 'offered':
        return 'bg-green-600 hover:bg-green-700';
      case 'applied':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-900 text-gray-300">
        <p className="text-xl">Loading your applications...</p>
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

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-900 text-gray-200 min-h-[calc(100vh-64px)]">
      <BackButton to="/student/dashboard" className="text-gray-400 hover:text-gray-200 mb-4" />
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-50">My Job Applications</h1>

      {applications.length === 0 ? (
        <p className="text-center text-lg text-gray-400">You haven't submitted any applications yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <Card key={app._id} className="bg-gray-800 text-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
              <CardHeader className="border-b border-gray-700 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-50">{app.jobTitle || 'N/A'}</CardTitle>
                <CardDescription className="text-gray-400">{app.companyName || 'N/A'}</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <p><strong>Applied On:</strong> {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    {(() => {
                      const interviewDate = interviewMap[app.jobId];
                      if (interviewDate) {
                        return (
                          <Badge className={`${getStatusColor('interview scheduled')} text-white`}>
                            Interview: {new Date(interviewDate).toLocaleDateString()}
                          </Badge>
                        );
                      }
                      return (
                        <Badge className={`${getStatusColor('applied')} text-white`}>
                          Applied
                        </Badge>
                      );
                    })()}
                  </p>
                  <p className="text-gray-300">
                    <strong>Location:</strong> {app.jobLocation || 'N/A'}
                  </p>
                  <p className="text-gray-300">
                    <strong>Type:</strong> {app.jobType || 'N/A'}
                  </p>
                </div>
                <Separator className="my-4 bg-gray-700" />
                <div className="flex justify-between items-center text-xs text-gray-500">
                  {/* You can add a link to job details or application details here */}
                  {/* Example: <Link to={`/student/applications/${app._id}`} className="text-purple-400 hover:underline">View Application</Link> */}
                  {app.notes && (
                      <span className="italic">Notes: {app.notes}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplicationsPage;