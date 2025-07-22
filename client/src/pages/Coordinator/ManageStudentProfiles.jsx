// frontend/src/pages/Coordinator/ManageStudentProfiles.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

const ManageStudentProfiles = () => {
  // Dummy student data
  const dummyStudents = [
    { id: 1, name: 'Amit Sharma', usn: '1GU21CS001', email: 'amit.sharma@example.com', branch: 'CSE', status: 'Active' },
    { id: 2, name: 'Priya Singh', usn: '1GU21EC002', email: 'priya.singh@example.com', branch: 'ECE', status: 'Pending' },
    { id: 3, name: 'Rahul Verma', usn: '1GU21ME003', email: 'rahul.verma@example.com', branch: 'ME', status: 'Active' },
    { id: 4, name: 'Sneha Patel', usn: '1GU21CE004', email: 'sneha.patel@example.com', branch: 'CE', status: 'Inactive' },
  ];
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <Card className="w-full max-w-4xl p-8 bg-gray-800 rounded-lg shadow-md">
        <CardHeader className="mb-6">
          <CardTitle className="text-2xl font-bold text-gray-50">Manage Student Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">USN</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Branch</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {dummyStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{student.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{student.usn}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{student.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{student.branch}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${student.status === 'Active' ? 'bg-green-700 text-green-100' : student.status === 'Pending' ? 'bg-yellow-700 text-yellow-100' : 'bg-gray-700 text-gray-300'}`}>{student.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageStudentProfiles;
