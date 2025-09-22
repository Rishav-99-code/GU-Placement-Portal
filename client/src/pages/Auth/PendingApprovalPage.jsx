import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const PendingApprovalPage = () => {
  // Check if this is a new registration or login attempt
  const pendingUser = JSON.parse(localStorage.getItem('pendingUser') || '{}');
  const isNewRegistration = !pendingUser.hasLoggedIn;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <span className="inline-block p-3 rounded-full bg-yellow-500/20 text-yellow-500 text-4xl mb-4">
            ⏳
          </span>
          <h1 className="text-2xl font-bold text-gray-100 mb-2">
            {isNewRegistration ? 'Registration Successful!' : 'Account Pending Approval'}
          </h1>
          <p className="text-gray-400">
            {isNewRegistration 
              ? 'Thank you for registering as a coordinator. Your account needs to be approved before you can access the system.'
              : 'Your coordinator account is currently pending approval. You will be notified once an existing coordinator reviews and approves your account.'}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-200 mb-2">What happens next?</h2>
            <ul className="text-sm text-gray-400 text-left list-disc list-inside space-y-2">
              <li>An existing coordinator will review your registration</li>
              <li>You will receive an email notification upon approval</li>
              <li>Once approved, you can log in and access the coordinator dashboard</li>
            </ul>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400 mb-4">
              Need assistance? Contact the administrator or try logging in again later.
            </p>
            <Button
              asChild
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              <Link to="/login">Return to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
