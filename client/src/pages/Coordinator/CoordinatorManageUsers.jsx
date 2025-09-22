// frontend/src/pages/Coordinator/CoordinatorManageUsers.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import BackButton from '../../components/common/BackButton';

const CoordinatorManageUsers = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-2xl">
        <BackButton className="text-gray-400 hover:text-gray-200 mb-4" />
      </div>
      <Card className="w-full max-w-2xl p-8 bg-gray-800 rounded-lg shadow-md">
        <CardHeader className="mb-6">
          <CardTitle className="text-2xl font-bold text-gray-50">Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for user management table/list */}
          <p>User management table coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoordinatorManageUsers;
