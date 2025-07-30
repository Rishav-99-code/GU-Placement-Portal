// frontend/src/pages/Recruiter/CreateJobPage.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import BackButton from '../../components/common/BackButton';
import api from '../../services/api';

const CreateJobPage = () => {
  const [form, setForm] = React.useState({
    title: '',
    company: '',
    location: '',
    companyDetails: '',
    description: '',
    type: '',
    salary: '',
    skillsRequired: '',
    applicationDeadline: '',
    responsibilities: '',
    qualifications: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const jobData = {
        ...form,
        salary: form.salary ? parseFloat(form.salary) : 0,
        skillsRequired: form.skillsRequired.split(',').map(s => s.trim()).filter(Boolean),
        responsibilities: form.responsibilities.split(',').map(s => s.trim()).filter(Boolean),
        qualifications: form.qualifications.split(',').map(s => s.trim()).filter(Boolean),
        applicationDeadline: form.applicationDeadline ? new Date(form.applicationDeadline) : null,
      };
      const response = await api.post('/api/jobs', jobData);
      setSuccess('Job posted successfully!');
      setForm({
        title: '',
        company: '',
        location: '',
        companyDetails: '',
        description: '',
        type: '',
        salary: '',
        skillsRequired: '',
        applicationDeadline: '',
        responsibilities: '',
        qualifications: '',
      });
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to post job';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-xl">
        <BackButton className="text-gray-400 hover:text-gray-200 mb-4" />
      </div>
      <Card className="w-full max-w-xl p-8 bg-gray-800 rounded-lg shadow-md">
        <CardHeader className="mb-6">
          <CardTitle className="text-2xl font-bold text-gray-50">Post a New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium" htmlFor="title">Job Title</label>
              <input type="text" id="title" name="title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100" placeholder="e.g. Software Engineer" />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="company">Company</label>
              <input type="text" id="company" name="company" value={form.company} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100" placeholder="e.g. Google" />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="location">Location</label>
              <input type="text" id="location" name="location" value={form.location} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100" placeholder="e.g. Bangalore" />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="type">Job Type</label>
              <select id="type" name="type" value={form.type} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100">
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="companyDetails">Company Details</label>
              <textarea id="companyDetails" name="companyDetails" value={form.companyDetails} onChange={handleChange} rows={2} className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100" placeholder="Brief about the company" />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="description">Job Description</label>
              <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100" placeholder="Describe the job role and requirements" />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="salary">Salary (₹)</label>
              <input type="number" id="salary" name="salary" value={form.salary} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100" placeholder="e.g. 500000" />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="skillsRequired">Skills Required (comma separated)</label>
              <input type="text" id="skillsRequired" name="skillsRequired" value={form.skillsRequired} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100" placeholder="e.g. React, Node.js, MongoDB" />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="applicationDeadline">Application Deadline</label>
              <input type="date" id="applicationDeadline" name="applicationDeadline" value={form.applicationDeadline} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100" />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="responsibilities">Responsibilities (comma separated)</label>
              <input type="text" id="responsibilities" name="responsibilities" value={form.responsibilities} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100" placeholder="e.g. Develop features, Write tests" />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="qualifications">Qualifications (comma separated)</label>
              <input type="text" id="qualifications" name="qualifications" value={form.qualifications} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100" placeholder="e.g. B.Tech, MCA" />
            </div>
            <Button type="submit" className="bg-blue-700 text-white w-full" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </Button>
            {success && <p className="text-green-400 mt-2">{success}</p>}
            {error && <p className="text-red-400 mt-2">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJobPage;
