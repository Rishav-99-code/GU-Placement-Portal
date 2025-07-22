// frontend/src/pages/Recruiter/ManageJobsPage.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

const ManageJobsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <Card className="w-full max-w-2xl p-8 bg-gray-800 rounded-lg shadow-md">
        <CardHeader className="mb-6">
          <CardTitle className="text-2xl font-bold text-gray-50">Manage Posted Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for job management table/list */}
          <p>Job management table coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageJobsPage;
