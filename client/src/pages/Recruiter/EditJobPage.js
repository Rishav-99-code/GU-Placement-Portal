// frontend/src/pages/Recruiter/EditJobPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import jobService from '../../services/jobService';
import toast from 'react-hot-toast';

const EditJobPage = () => {
  const navigate = useNavigate();
  const { jobId } = useParams(); // Get job ID from URL
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    requirements: '',
    responsibilities: '',
    skillsRequired: '',
    salary: '',
    applicationDeadline: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const job = await jobService.getJobDetails(jobId);
        setFormData({
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          description: job.description,
          // Convert array fields back to comma-separated strings
          requirements: job.requirements ? job.requirements.join(', ') : '',
          responsibilities: job.responsibilities ? job.responsibilities.join(', ') : '',
          skillsRequired: job.skillsRequired ? job.skillsRequired.join(', ') : '',
          salary: job.salary || '',
          // Format date for input type="date"
          applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
          status: job.status,
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch job details for edit:', err);
        setError('Failed to load job details.');
        toast.error('Failed to load job details.');
        setLoading(false);
        if (err.response && err.response.status === 404) {
          navigate('/recruiter/manage-jobs'); // Redirect if job not found
        }
      }
    };
    fetchJobDetails();
  }, [jobId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements ? formData.requirements.split(',').map(item => item.trim()) : [],
        responsibilities: formData.responsibilities ? formData.responsibilities.split(',').map(item => item.trim()) : [],
        skillsRequired: formData.skillsRequired ? formData.skillsRequired.split(',').map(item => item.trim()) : [],
        salary: formData.salary ? parseFloat(formData.salary) : 0,
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : null,
      };

      await jobService.updateJob(jobId, jobData);
      toast.success('Job updated successfully!');
      navigate('/recruiter/manage-jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error.response?.data?.message || 'Failed to update job.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-900 text-gray-300">
        <p className="text-xl">Loading job details...</p>
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
      <Card className="max-w-3xl mx-auto bg-gray-800 text-gray-200 shadow-lg rounded-lg">
        <CardHeader className="border-b border-gray-700 pb-4">
          <CardTitle className="text-2xl font-bold text-gray-50">Edit Job Listing</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-gray-300">Job Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="company" className="text-gray-300">Company Name</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-gray-300">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-gray-300">Job Type</Label>
              <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)} required>
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-100">
                  <SelectValue placeholder="Select a job type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-300">Job Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="requirements" className="text-gray-300">Requirements (comma-separated)</Label>
              <Input
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="responsibilities" className="text-gray-300">Responsibilities (comma-separated)</Label>
              <Input
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="skillsRequired" className="text-gray-300">Skills Required (comma-separated)</Label>
              <Input
                id="skillsRequired"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="salary" className="text-gray-300">Salary (Annual, INR)</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="applicationDeadline" className="text-gray-300">Application Deadline</Label>
              <Input
                id="applicationDeadline"
                name="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={handleChange}
                required
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-gray-300">Job Status</Label>
              <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)} required>
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-100">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Job'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditJobPage;