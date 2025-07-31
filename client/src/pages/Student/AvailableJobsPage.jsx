import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge'; // Assuming you have a Badge component
import { Separator } from '../../components/ui/separator';
import BackButton from '../../components/common/BackButton';
import jobService from '../../services/jobService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'; // For linking to job details

const AvailableJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const fetchedLocations = await jobService.getJobLocations();
        setLocations(fetchedLocations);
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };
    fetchLocations();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        // Pass filters to the service
        const fetchedJobs = await jobService.getAvailableJobs({
          search: debouncedSearchTerm,
          location: filterLocation,
          type: filterType,
        });
        setJobs(fetchedJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
        toast.error('Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [debouncedSearchTerm, filterLocation, filterType]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationChange = (e) => {
    setFilterLocation(e.target.value);
  };

  const handleTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-900 text-gray-300">
        <p className="text-xl">Loading available jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-900 text-red-400">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-900 text-gray-200 min-h-[calc(100vh-64px)]">
      <BackButton to="/student/dashboard" className="text-gray-400 hover:text-gray-200 mb-4" />
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-50">Available Job Opportunities</h1>

      {/* Filter and Search Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search by title or company..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
        />
        <select
          value={filterLocation}
          onChange={handleLocationChange}
          className="block w-full p-2.5 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={handleTypeChange}
          className="block w-full p-2.5 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Internship">Internship</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      {jobs.length === 0 ? (
        <p className="text-center text-lg text-gray-400">No jobs found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const companyUrl = `https://www.google.com/search?q=${encodeURIComponent(job.company + ' careers')}`;
            const logoUrl = job.recruiterLogoUrl
              ? `http://localhost:5000${job.recruiterLogoUrl}`
              : 'https://placehold.co/100x100?text=Logo';

            return (
              <Card key={job._id || job.id} className="bg-gray-800 text-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
                <CardHeader className="border-b border-gray-700 pb-4 flex items-center space-x-4">
                  <img src={logoUrl} alt={`${job.company} Logo`} className="w-16 h-16 object-contain rounded-md" />
                  <div>
                    <CardTitle className="text-xl font-bold text-blue-400">
                      <a href={companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{job.company}</a>
                    </CardTitle>
                    <CardDescription className="text-gray-400">{job.title}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <p><strong>Location:</strong> {job.location || 'N/A'}</p>
                    <p><strong>Type:</strong> <Badge className="bg-purple-600 hover:bg-purple-700 text-white">{job.type || 'N/A'}</Badge></p>
                    <p className="text-gray-300 line-clamp-3">{job.description || 'No description provided.'}</p>
                  </div>
                  <Separator className="my-4 bg-gray-700" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                    <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200">
                      <Link to={`/student/jobs/${job._id || job.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AvailableJobsPage;