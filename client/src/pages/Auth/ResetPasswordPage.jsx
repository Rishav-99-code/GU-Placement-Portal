import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import PasswordInput from '../../components/ui/PasswordInput';
import { validatePassword } from '../../utils/passwordValidation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import BackButton from '../../components/common/BackButton';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Get email from URL params
    const emailFromParams = searchParams.get('email');
    if (emailFromParams) {
      setFormData(prev => ({ ...prev, email: emailFromParams }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.otp || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.errors[0]);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔐 Resetting password for:', formData.email);
      
      const response = await api.post('/api/auth/reset-password', {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      
      console.log('✅ Password reset successful:', response.data);
      
      toast.success('Password reset successful! You can now log in with your new password.', {
        duration: 5000
      });
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error resetting password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('📧 Resending OTP to:', formData.email);
      
      const response = await api.post('/api/auth/resend-otp', { email: formData.email });
      
      console.log('✅ OTP resent successfully:', response.data);
      
      toast.success('New OTP sent to your email!');
      
    } catch (error) {
      console.error('❌ Error resending OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <BackButton to="/forgot-password" className="mb-4 text-gray-400 hover:text-gray-200" />
        
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-100">
              🔐 Reset Password
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter the OTP sent to your email and create a new password
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="otp" className="text-gray-300">OTP Code</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                  >
                    Resend OTP
                  </Button>
                </div>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest font-mono"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Check your email inbox and spam folder for the OTP
                </p>
              </div>

              <PasswordInput
                id="newPassword"
                label="New Password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                showValidation={true}
                showStrength={true}
                required
              />

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    className={`
                      bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 pr-10
                      ${formData.confirmPassword && formData.newPassword !== formData.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                    `}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1 flex items-center">
                    <span className="mr-1">❌</span>
                    Passwords do not match
                  </p>
                )}
                {formData.confirmPassword && formData.newPassword === formData.confirmPassword && formData.newPassword.length > 0 && (
                  <p className="text-green-400 text-xs mt-1 flex items-center">
                    <span className="mr-1">✅</span>
                    Passwords match
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Remember your password?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                  Back to Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;