import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import BackButton from '../components/common/BackButton';

const RecruiterAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/analytics/recruiter', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-center text-red-500">Failed to load analytics</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const applicationStatusData = [
    { name: 'Pending', value: analytics.applicationsByStatus.pending },
    { name: 'Accepted', value: analytics.applicationsByStatus.accepted },
    { name: 'Rejected', value: analytics.applicationsByStatus.rejected }
  ];

  const interviewStatusData = [
    { name: 'Pending', value: analytics.interviewsByStatus.pending },
    { name: 'Approved', value: analytics.interviewsByStatus.approved },
    { name: 'Rejected', value: analytics.interviewsByStatus.rejected }
  ];

  return (
    <div className="p-6 space-y-6">
      <BackButton to="/recruiter/dashboard" />
      <h1 className="text-3xl font-bold">Recruiter Analytics</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalJobs}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalApplications}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalInterviews}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Applications/Job</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalJobs > 0 ? Math.round(analytics.totalApplications / analytics.totalJobs) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Application Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Interview Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={interviewStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {interviewStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Job Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Job Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.jobPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jobTitle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#8884d8" name="Applications" />
              <Bar dataKey="interviews" fill="#82ca9d" name="Interviews" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentApplications.map((application) => (
              <div key={application._id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{application.student.name}</p>
                  <p className="text-sm text-gray-600">{application.job.title}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${
                    application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {application.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterAnalytics;