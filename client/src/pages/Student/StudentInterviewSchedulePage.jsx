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

      {(() => {
        // Filter out past interviews as a backup
        const now = new Date();
        const upcomingInterviews = interviews.filter(iv => 
          new Date(iv.dateTime) > now
        );
        
        return upcomingInterviews.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-400 mb-4">No upcoming interviews scheduled.</p>
            <p className="text-sm text-gray-500">
              Check back later or contact the placement office if you have any questions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingInterviews.map((iv) => {
              const interviewDate = new Date(iv.dateTime);
              const isToday = interviewDate.toDateString() === now.toDateString();
              const isTomorrow = interviewDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
              const daysUntil = Math.ceil((interviewDate - now) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={iv._id} className={`bg-gray-800 text-gray-200 shadow-lg rounded-lg overflow-hidden ${
                  isToday ? 'border-2 border-yellow-500 shadow-yellow-500/20' : 
                  isTomorrow ? 'border-2 border-blue-500 shadow-blue-500/20' : 
                  'hover:shadow-xl transition-shadow duration-300'
                }`}>
                  <CardTitle className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <span className="text-xl font-semibold text-purple-400">
                      {iv.job?.title || 'Interview'}
                    </span>
                    {isToday && (
                      <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded font-bold">
                        TODAY
                      </span>
                    )}
                    {isTomorrow && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-bold">
                        TOMORROW
                      </span>
                    )}
                  </CardTitle>
                  <CardContent className="p-4 space-y-3 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">🏢</span>
                      <span><strong>Company:</strong> {iv.job?.company || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">📅</span>
                      <span><strong>Date/Time:</strong> {interviewDate.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">👤</span>
                      <span><strong>Recruiter:</strong> {iv.recruiter?.name || 'N/A'}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className={`text-xs font-medium ${
                        isToday ? 'text-yellow-400' : 
                        isTomorrow ? 'text-blue-400' : 
                        'text-gray-500'
                      }`}>
                        {isToday ? '⚡ Interview is today! Good luck!' : 
                         isTomorrow ? '🔔 Interview is tomorrow - prepare well!' :
                         `⏰ In ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
};

export default StudentInterviewSchedulePage;