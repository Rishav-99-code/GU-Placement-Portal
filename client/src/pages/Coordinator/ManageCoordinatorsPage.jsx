import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table.jsx';
import { Button } from '../../components/ui/button';
import api from "../../services/api";
import BackButton from "../../components/common/BackButton";

const ManageCoordinatorsPage = () => {
  const navigate = useNavigate();
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        setError(null);
        console.log('Fetching coordinators...');
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No token found');
          setError('Authentication token missing. Please login again.');
          toast.error('Please login again');
          navigate('/login');
          return;
        }

        console.log('Making API request with token:', token.substring(0, 10) + '...');
        
        const response = await api.get('/api/users/coordinators?approved=false');
        console.log('Coordinator data received:', response.data);
        
        setCoordinators(response.data);
        toast.success('Coordinator list loaded successfully');
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
          headers: error.config?.headers
        });
        
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch pending coordinators';
        setError(errorMessage);
        toast.error(errorMessage);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else if (error.response?.status === 403) {
          setError('You do not have permission to view coordinators. Please ensure you are logged in as an approved coordinator.');
        } else if (!error.response) {
          setError('Network error - Please check if the server is running and try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinators();
  }, []);

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await api.patch(`/api/users/coordinators/${id}/approve`);
      setCoordinators(coordinators.filter(c => c._id !== id));
      toast.success('Coordinator approved successfully');
    } catch (error) {
      console.error('Error approving coordinator:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to approve coordinator';
      toast.error(errorMessage);
      if (error.response?.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        // Forbidden - probably not an approved coordinator
        toast.error('You do not have permission to approve coordinators');
      }
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-xl text-gray-300">Loading pending coordinators...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-50">Pending Coordinator Approvals</h1>
          <BackButton />
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}
        
        {coordinators.length === 0 ? (
          <p className="text-gray-400">No pending coordinator approvals.</p>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Department</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coordinators.map((coordinator) => (
                  <TableRow key={coordinator._id}>
                    <TableCell className="text-gray-300">{coordinator.name}</TableCell>
                    <TableCell className="text-gray-300">{coordinator.email}</TableCell>
                    <TableCell className="text-gray-300">
                      {coordinator.coordinatorProfile?.department || 'Not specified'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="default"
                        size="sm"
                        disabled={approvingId === coordinator._id}
                        onClick={() => handleApprove(coordinator._id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {approvingId === coordinator._id ? 'Approving...' : 'Approve'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCoordinatorsPage;
