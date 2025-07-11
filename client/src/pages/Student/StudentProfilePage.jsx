// frontend/src/pages/Student/StudentProfilePage.js
import React from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const StudentProfilePage = () => {
  const { authState } = useContext(AuthContext);
  const user = authState.user;

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Please complete your profile to access all features.
      </p>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Profile Details</h2>

        {/* A simple placeholder form */}
        <form className="space-y-6">
          <div>
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input id="rollNumber" placeholder="e.g., 20XXXXXX" />
          </div>
          <div>
            <Label htmlFor="program">Program</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select your program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="btech">B.Tech</SelectItem>
                <SelectItem value="mtech">M.Tech</SelectItem>
                <SelectItem value="phd">Ph.D.</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="branch">Branch</Label>
            <Input id="branch" placeholder="e.g., Computer Science and Engineering" />
          </div>
          {/* Add more fields here like CGPA, skills, etc. */}

          <div className="pt-4">
            <Button className="w-full">Save Profile</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfilePage;