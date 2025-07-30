import React, { useEffect, useState } from 'react';
import interviewService from '../../services/interviewService';
import { Card, CardTitle, CardContent } from '../../components/ui/card';
import BackButton from '../../components/common/BackButton';
import toast from 'react-hot-toast';

const StudentInterviewSchedulePage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await interviewService.getMySchedules();
        setInterviews(data);
      } catch (err) {
        console.error('Failed to fetch interviews:', err);
        setError('Failed to load interviews.');
        toast.error('Failed to load interviews.');
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-900 text-gray-300">
        <p className="text-xl">Loading interview schedule...</p>
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
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-50 text-center">Upcoming Interviews</h1>

      {interviews.length === 0 ? (
        <p className="text-center text-lg text-gray-400">No interviews scheduled.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((iv) => (
            <Card key={iv._id} className="bg-gray-800 text-gray-200 shadow-lg rounded-lg overflow-hidden">
              <CardTitle className="p-4 border-b border-gray-700 text-xl font-semibold text-purple-400">
                {iv.job?.title || 'Interview'}
              </CardTitle>
              <CardContent className="p-4 space-y-2 text-sm">
                <p><strong>Company:</strong> {iv.job?.company || 'N/A'}</p>
                <p><strong>Date/Time:</strong> {new Date(iv.dateTime).toLocaleString()}</p>
                <p><strong>Recruiter:</strong> {iv.recruiter?.name || 'N/A'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentInterviewSchedulePage;