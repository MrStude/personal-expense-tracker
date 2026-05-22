import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { apiPost } from '../lib/api.js';
import { toast } from '../hooks/use-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: 'Email required',
        description: 'Enter your account email first',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    try {
      await apiPost('/otp/send-otp', { email });
      setOtpSent(true);
      toast({
        title: 'OTP sent',
        description: 'Please check your email',
      });
    } catch (error) {
      toast({
        title: 'Could not send OTP',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the 6-digit code from your email',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please confirm your new password',
        variant: 'destructive',
      });
      return;
    }

    setIsResetting(true);
    try {
      await apiPost('/auth/reset-password', { email, otp, password });
      toast({
        title: 'Password reset',
        description: 'You can now sign in with your new password',
      });
      navigate('/login', { replace: true });
    } catch (error) {
      toast({
        title: 'Reset failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl gradient-primary mb-4">
            <KeyRound className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
          <p className="text-muted-foreground mt-2">
            Verify your email and choose a new password
          </p>
        </div>

        <form onSubmit={otpSent ? resetPassword : sendOtp} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={otpSent}
                required
              />
            </div>
          </div>

          {otpSent && (
            <>
              <div className="space-y-2">
                <Label htmlFor="reset-otp">OTP Code</Label>
                <Input
                  id="reset-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="tracking-widest"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirm Password</Label>
                <Input
                  id="confirm-new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={isSending || isResetting}
          >
            {isSending || isResetting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {otpSent ? 'Resetting...' : 'Sending...'}
              </>
            ) : otpSent ? (
              'Reset Password'
            ) : (
              'Send OTP'
            )}
          </Button>
        </form>

        {otpSent && (
          <button
            type="button"
            onClick={sendOtp}
            className="text-sm text-primary font-medium hover:underline disabled:opacity-60"
            disabled={isSending}
          >
            Resend OTP
          </button>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Remembered your password?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
