
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const RecruiterDashboardPage = () => {
  const { authState } = useContext(AuthContext);
  const user = authState.user;

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-4xl font-bold mb-2 text-gray-900">
        Recruiter Dashboard, {user?.name}! 🏢
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Manage your company's listings and engage with potential hires.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-600">Post New Job</CardTitle>
            <CardDescription>Create a new job listing for students.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Define roles, requirements, and application deadlines.
            </p>
            <Button className="w-full">Create Job Listing</Button>
          </CardContent>
        </Card>

        {/* Card 2: Manage Job Listings */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-green-600">Manage Listings</CardTitle>
            <CardDescription>View and edit your existing job posts.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Update job details, close listings, or view applicants.
            </p>
            <Button variant="outline" className="w-full">View My Jobs</Button>
          </CardContent>
        </Card>

        
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-orange-600">View Applicants</CardTitle>
            <CardDescription>Review applications for your jobs.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Browse student profiles, resumes, and shortlist candidates.
            </p>
            <Button variant="secondary" className="w-full">Review Applications</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;