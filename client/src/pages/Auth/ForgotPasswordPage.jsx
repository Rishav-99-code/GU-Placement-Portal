import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import BackButton from '../../components/common/BackButton';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('📧 Sending OTP to:', email);
      
      const response = await api.post('/api/auth/forgot-password', { email });
      
      console.log('✅ OTP sent successfully:', response.data);
      
      toast.success('OTP sent to your email! Check your inbox and spam folder.');
      setOtpSent(true);
      
    } catch (error) {
      console.error('❌ Error sending OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    
    try {
      console.log('📧 Resending OTP to:', email);
      
      const response = await api.post('/api/auth/resend-otp', { email });
      
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
        <BackButton to="/login" className="mb-4 text-gray-400 hover:text-gray-200" />
        
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-100">
              🔐 Forgot Password
            </CardTitle>
            <CardDescription className="text-gray-400">
              {otpSent 
                ? 'OTP sent! Check your email and proceed to reset your password.'
                : 'Enter your email address to receive a password reset OTP'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-900/50 border border-green-600 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-green-400 mr-2">✅</span>
                    <h4 className="text-green-300 font-semibold">OTP Sent Successfully!</h4>
                  </div>
                  <p className="text-green-200 text-sm">
                    We've sent a 6-digit OTP to <strong>{email}</strong>. 
                    Please check your inbox and spam folder.
                  </p>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <Button 
                    asChild
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Link to={`/reset-password?email=${encodeURIComponent(email)}`}>
                      Enter OTP & Reset Password
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    {isLoading ? 'Resending...' : 'Resend OTP'}
                  </Button>
                </div>
              </div>
            )}
            
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

export default ForgotPasswordPage;