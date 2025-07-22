// frontend/src/pages/Recruiter/CreateJobPage.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const CreateJobPage = () => {
  const [form, setForm] = React.useState({
    title: '',
    company: '',
    location: '',
    companyDetails: '',
    description: '',
    type: '',
  });
  const [logoFile, setLogoFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (logoFile) {
        formData.append('logoFile', logoFile);
      }
      const res = await fetch('/api/jobs', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Job posted successfully!');
        setForm({ title: '', company: '', location: '', companyDetails: '', description: '', type: '' });
        setLogoFile(null);
      } else {
        setError(data.error || 'Failed to post job');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
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
              <label className="block mb-1 font-medium" htmlFor="logoFile">Company Logo (PNG, JPG, PDF)</label>
              <input type="file" id="logoFile" name="logoFile" accept=".png,.jpg,.jpeg,.pdf" onChange={handleFileChange} className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100" />
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
