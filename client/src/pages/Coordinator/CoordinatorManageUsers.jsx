// frontend/src/pages/Coordinator/CoordinatorManageUsers.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

const CoordinatorManageUsers = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
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
