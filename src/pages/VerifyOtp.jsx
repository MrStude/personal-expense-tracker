import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { apiPost } from '../lib/api.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { toast } from '../hooks/use-toast';

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { completeOtpLogin } = useAuthContext();
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const pendingUser = useMemo(() => {
    if (location.state?.user) return location.state.user;

    try {
      return JSON.parse(sessionStorage.getItem('pendingAuthUser'));
    } catch {
      return null;
    }
  }, [location.state]);

  const email = location.state?.email || pendingUser?.email || '';

  useEffect(() => {
    if (!email) navigate('/login', { replace: true });
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the 6-digit code from your email',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);
    try {
      await apiPost('/otp/verify-otp', { email, otp });
      const completed = completeOtpLogin(pendingUser);

      if (!completed) {
        throw new Error('Login session expired. Please sign in again.');
      }

      toast({
        title: 'OTP verified',
        description: 'You are signed in successfully',
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await apiPost('/otp/send-otp', { email });
      toast({
        title: 'OTP resent',
        description: 'Please check your email',
      });
    } catch (error) {
      toast({
        title: 'Could not resend OTP',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl gradient-primary mb-4">
            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verify your email</h1>
          <p className="text-muted-foreground mt-2">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="otp">OTP Code</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="pl-10 tracking-widest"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </Button>
        </form>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={handleResend}
            className="text-primary font-medium hover:underline disabled:opacity-60"
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend OTP'}
          </button>
          <Link to="/login" className="text-muted-foreground hover:text-foreground">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
