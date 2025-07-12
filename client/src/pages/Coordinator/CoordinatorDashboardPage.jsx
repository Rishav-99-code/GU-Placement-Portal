
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const CoordinatorDashboardPage = () => {
  const { authState } = useContext(AuthContext);
  const user = authState.user;

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-4xl font-bold mb-2 text-gray-900">
        Coordinator Dashboard, {user?.name}! ⚙️
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Manage student and company approvals, and oversee the placement process.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-600">Manage Students</CardTitle>
            <CardDescription>View, approve, or manage student accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Approve new student registrations and update student profiles.
            </p>
            <Button className="w-full">View Students</Button>
          </CardContent>
        </Card>

        
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-green-600">Manage Companies</CardTitle>
            <CardDescription>Approve companies and manage their access.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Review new company registrations and manage company details.
            </p>
            <Button variant="outline" className="w-full">View Companies</Button>
          </CardContent>
        </Card>

        
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-red-600">Job Approvals</CardTitle>
            <CardDescription>Review and approve new job listings.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Ensure job postings meet guidelines before going live.
            </p>
            <Button variant="secondary" className="w-full">Approve Jobs</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoordinatorDashboardPage;