import React from 'react';

const EmailNotificationStatus = ({ status, message }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return '📧';
      case 'sent':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📬';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'sending':
        return 'text-blue-400';
      case 'sent':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`flex items-center space-x-2 text-sm ${getStatusColor()}`}>
      <span className="text-lg">{getStatusIcon()}</span>
      <span>{message}</span>
    </div>
  );
};

export default EmailNotificationStatus;