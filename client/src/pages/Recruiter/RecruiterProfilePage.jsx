// frontend/src/pages/Recruiter/RecruiterProfilePage.js
import React from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const RecruiterProfilePage = () => {
  const { authState } = useContext(AuthContext);
  const user = authState.user;

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Please provide your company details to start posting jobs.
      </p>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Company Profile Details</h2>

        {/* A simple placeholder form */}
        <form className="space-y-6">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" placeholder="e.g., Google" />
          </div>
          <div>
            <Label htmlFor="website">Company Website</Label>
            <Input id="website" placeholder="https://www.example.com" />
          </div>
          <div>
            <Label htmlFor="description">Company Description</Label>
            <Textarea id="description" placeholder="Tell us about your company..." rows={5} />
          </div>
          {/* Add more fields like contact person, industry, etc. */}

          <div className="pt-4">
            <Button className="w-full">Save Company Profile</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterProfilePage;