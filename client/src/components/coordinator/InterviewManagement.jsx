import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import interviewService from '../../services/interviewService';
import toast from 'react-hot-toast';

const InterviewManagement = () => {
  const [pendingInterviews, setPendingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  useEffect(() => {
    fetchPendingInterviews();
  }, []);

  const fetchPendingInterviews = async () => {
    try {
      const data = await interviewService.getPending();
      setPendingInterviews(data);
    } catch (error) {
      console.error('Failed to fetch pending interviews:', error);
      toast.error('Failed to load pending interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveInterview = async (interviewId) => {
    setApproving(interviewId);
    try {
      await interviewService.approve(interviewId);
      await fetchPendingInterviews();
      toast.success('✅ Interview approved! Students have been notified via email.');
    } catch (error) {
      console.error('Failed to approve interview:', error);
      toast.error('Failed to approve interview');
    } finally {
      setApproving(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <p className="text-gray-400">Loading interview requests...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-gray-50 mb-4 flex items-center">
        📅 Interview Management
        {pendingInterviews.length > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {pendingInterviews.length} pending
          </span>
        )}
      </h3>
      
      {pendingInterviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">✅</div>
          <p className="text-gray-400">No pending interview requests</p>
          <p className="text-sm text-gray-500 mt-2">
            All interview schedules are up to date
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-300 mb-4">
            Review and approve interview schedules. Students will be automatically notified via email.
          </p>
          
          {pendingInterviews.map((interview) => (
            <Card key={interview._id} className="bg-gray-700 border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-400 flex items-center justify-between">
                  <span>{interview.job?.title || 'Job Position'}</span>
                  <span className="text-sm bg-yellow-600 text-white px-2 py-1 rounded">
                    Pending Approval
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-300">
                      <strong>Company:</strong> {interview.job?.company || 'N/A'}
                    </p>
                    <p className="text-gray-300">
                      <strong>Recruiter:</strong> {interview.recruiter?.name || 'N/A'}
                    </p>
                    <p className="text-gray-300">
                      <strong>Contact:</strong> {interview.recruiter?.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300">
                      <strong>Date & Time:</strong> {new Date(interview.dateTime).toLocaleString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-gray-300">
                      <strong>Students:</strong> {interview.applicants?.length || 0} selected
                    </p>
                  </div>
                </div>
                
                {interview.applicants && interview.applicants.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-400 mb-2">Selected Students:</p>
                    <div className="flex flex-wrap gap-2">
                      {interview.applicants.slice(0, 3).map((student, index) => (
                        <span key={index} className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs">
                          {student.name}
                        </span>
                      ))}
                      {interview.applicants.length > 3 && (
                        <span className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs">
                          +{interview.applicants.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end pt-3 border-t border-gray-600">
                  <Button
                    onClick={() => handleApproveInterview(interview._id)}
                    disabled={approving === interview._id}
                    className="bg-green-600 hover:bg-green-700 text-white px-6"
                  >
                    {approving === interview._id ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Approving...
                      </>
                    ) : (
                      <>
                        ✅ Approve & Notify Students
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewManagement;