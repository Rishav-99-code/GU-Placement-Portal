// frontend/src/pages/common/ChangePasswordPage.jsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage = () => {
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pwd.length < 6) { toast.error('Password too short'); return; }
    if (pwd !== confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await userService.changePassword(pwd);
      toast.success('Password updated');
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200 p-6">
      <Card className="bg-gray-800 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-gray-50 text-2xl">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="password" placeholder="New Password" value={pwd} onChange={e=>setPwd(e.target.value)} className="bg-gray-700 text-gray-100" />
            <Input type="password" placeholder="Confirm Password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="bg-gray-700 text-gray-100" />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>{loading?'Saving…':'Save'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordPage; 