import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Mail, Lock, User, Phone, Loader2, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { apiPost } from '../lib/api.js';
import { toast } from '../hooks/use-toast';

const SPECIAL_CHAR_REGEX = new RegExp("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]");

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const { register, isLoading } = useAuthContext();
  const navigate = useNavigate();

  // Password validation functions
  const validatePassword = (pass) => {
    const errors = [];
    
    if (pass.length < 8) {
      errors.push('At least 8 characters');
    }
    
    if (!/[A-Z]/.test(pass)) {
      errors.push('At least one uppercase letter');
    }
    
    if (!/[a-z]/.test(pass)) {
      errors.push('At least one lowercase letter');
    }
    
    if (!/\d/.test(pass)) {
      errors.push('At least one number');
    }
    
    if (!SPECIAL_CHAR_REGEX.test(pass)) {
      errors.push('At least one special character');
    }
    
    return errors;
  };

  const validatePasswordOnBlur = () => {
    if (!password) {
      setPasswordError('');
      return;
    }
    
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setPasswordError('Password must contain: ' + errors.join(', '));
    } else {
      setPasswordError('');
    }
  };

  const validateConfirmPasswordOnBlur = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('');
      return;
    }
    
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    // First condition: Password complexity validation
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setPasswordError('Password must contain: ' + passwordErrors.join(', '));

      // Focus on password field
      document.getElementById('password')?.focus();
      return;
    }

    // Second condition: Password and confirm password must match
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');

      // Focus on confirm password field
      document.getElementById('confirmPassword')?.focus();
      return;
    }

    // Clear any previous errors
    setPasswordError('');
    setConfirmPasswordError('');

    // If all validations pass, proceed with registration
    const pendingUser = await register(name, email, password, phone.trim() || undefined);

    if (pendingUser) {
      try {
        await apiPost('/otp/send-otp', { email });
      } catch (error) {
        sessionStorage.removeItem('pendingAuthUser');
        toast({
          title: 'OTP failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'OTP sent',
        description: 'Please check your email to verify your account',
      });
      navigate('/verify-otp', { state: { email, user: pendingUser, mode: 'register' } });
    } else {
      toast({
        title: 'Registration failed',
        description: 'User already exists or server error',
        variant: 'destructive',
      });
    }
  };

  // Helper function to check individual password requirements
  const getPasswordValidationStatus = () => {
    if (!password) return null;
    
    const checks = [
      { 
        label: 'At least 8 characters', 
        valid: password.length >= 8 
      },
      { 
        label: 'At least one uppercase letter', 
        valid: /[A-Z]/.test(password) 
      },
      { 
        label: 'At least one lowercase letter', 
        valid: /[a-z]/.test(password) 
      },
      { 
        label: 'At least one number', 
        valid: /\d/.test(password) 
      },
      { 
        label: 'At least one special character', 
        valid: SPECIAL_CHAR_REGEX.test(password) 
      },
    ];
    
    return checks;
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle password change and clear error when user starts typing
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (confirmPasswordError) {
      setConfirmPasswordError('');
    }
  };

  // Check if passwords match
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNC0yIDQtMiA0LTItMi0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-primary-foreground">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/20 mb-8">
            <Wallet className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Get Started</h1>
          <p className="text-lg text-primary-foreground/80 text-center max-w-md">
            Join thousands of users who are already managing their finances smarter.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-primary-foreground/10" />
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary-foreground/10" />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl gradient-primary mb-4">
              <Wallet className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Expense Tracker</h1>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Create an account</h2>
            <p className="text-muted-foreground mt-2">
              Start tracking your expenses today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+919876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={validatePasswordOnBlur}
                  className={`pl-10 pr-10 ${passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  required
                  aria-describedby={passwordError ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {/* Password Error Message */}
              {passwordError && (
                <div 
                  id="password-error"
                  className="flex items-start mt-1 text-sm text-red-600"
                  role="alert"
                >
                  <XCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
              
              {/* Password Requirements Checklist (only show if no error) */}
              {password && !passwordError && (
                <div className="mt-3 p-3 bg-muted/50 rounded-md">
                  <p className="text-sm font-medium mb-2">Password must contain:</p>
                  <ul className="space-y-1">
                    {getPasswordValidationStatus()?.map((check, index) => (
                      <li key={index} className="flex items-center text-xs">
                        {check.valid ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-400 mr-2" />
                        )}
                        <span className={check.valid ? 'text-green-600' : 'text-muted-foreground'}>
                          {check.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onBlur={validateConfirmPasswordOnBlur}
                  className={`pl-10 pr-10 ${confirmPasswordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  required
                  aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {/* Confirm Password Error Message */}
              {confirmPasswordError && (
                <div 
                  id="confirm-password-error"
                  className="flex items-start mt-1 text-sm text-red-600"
                  role="alert"
                >
                  <XCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                  <span>{confirmPasswordError}</span>
                </div>
              )}
              
              {/* Password Match Indicator (only show if no error and both fields have values) */}
              {password && confirmPassword && !confirmPasswordError && (
                <div className="flex items-center mt-2">
                  {passwordsMatch ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-400 mr-2" />
                      <span className="text-sm text-red-500">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              variant="gradient" 
              size="lg" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
