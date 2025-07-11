// frontend/src/pages/Coordinator/CoordinatorProfilePage.js
import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';

const CoordinatorProfilePage = () => {
  const { authState } = useContext(AuthContext);
  const user = authState.user;

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
      <p className="text-lg text-gray-600 mb-8">
        This is your coordinator dashboard. You can manage your profile details here.
      </p>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Coordinator Profile</h2>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        {/* Add more fields for the coordinator here */}
        <div className="pt-6">
            <Button>Update Profile</Button>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorProfilePage;