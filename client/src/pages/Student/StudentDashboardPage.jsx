// frontend/src/pages/Student/StudentDashboardPage.js
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '../../components/ui/button'; // Assuming you have this
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'; // Assuming you have these

const StudentDashboardPage = () => {
  const { authState } = useContext(AuthContext);
  const user = authState.user;

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-4xl font-bold mb-2 text-gray-900">
        Welcome to your Dashboard, {user?.name}! 👋
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Here you can find relevant job opportunities and manage your applications.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1: View Job Listings */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-600">Explore Jobs</CardTitle>
            <CardDescription>Discover new placement opportunities.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Browse through various job listings from top companies.
            </p>
            <Button className="w-full">View All Jobs</Button>
          </CardContent>
        </Card>

        {/* Card 2: My Applications */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-green-600">My Applications</CardTitle>
            <CardDescription>Track the status of your submitted applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              See which applications are pending, shortlisted, or rejected.
            </p>
            <Button variant="outline" className="w-full">View Status</Button>
          </CardContent>
        </Card>

        {/* Card 3: Profile Management */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-purple-600">Manage Profile</CardTitle>
            <CardDescription>Update your academic and personal details.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Keep your resume, skills, and academic records up-to-date.
            </p>
            <Button variant="secondary" className="w-full">Edit Profile</Button>
          </CardContent>
        </Card>

        {/* You can add more cards here */}
        {/* <Card> ... </Card> */}
      </div>
    </div>
  );
};

export default StudentDashboardPage;