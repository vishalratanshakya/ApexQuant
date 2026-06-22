'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  sendResetEmail,
} from '@/lib/auth';

type Mode = 'login' | 'signup' | 'forgot';

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    clearMessages();
    try {
      await signInWithGoogle();
      toast.success('Successfully logged in with Google!');
      router.push('/');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
      
      // User simply closed the Google popup, don't show a scary red error
      if (errorMessage.includes('popup-closed-by-user')) {
        return;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      if (mode === 'forgot') {
        await sendResetEmail(email);
        const msg = 'Password reset email sent! Check your inbox.';
        setSuccess(msg);
        toast.success(msg);
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
        toast.success('Account created successfully!');
        router.push('/');
      } else {
        await signInWithEmail(email, password);
        if (email.toLowerCase() === 'admin@gmail.com') {
          toast.success('Welcome back, Admin!');
          router.push('/admin');
        } else {
          toast.success('Welcome back to ApexQuant!');
          router.push('/');
        }
      }
    } catch (err: unknown) {
      let msg = 'Something went wrong. Please try again.';
      if (err instanceof Error) {
        if (err.message.includes('user-not-found') || err.message.includes('wrong-password')) {
          msg = 'Invalid email or password.';
        } else if (err.message.includes('email-already-in-use')) {
          msg = 'An account with this email already exists.';
        } else if (err.message.includes('weak-password')) {
          msg = 'Password must be at least 6 characters.';
        } else if (err.message.includes('invalid-email')) {
          msg = 'Please enter a valid email address.';
        }
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };


  const modeConfig = {
    login: { title: 'Welcome back', subtitle: 'Sign in to your ApexQuant account', btn: 'Sign In' },
    signup: { title: 'Create account', subtitle: 'Join 12,000+ traders on ApexQuant', btn: 'Create Account' },
    forgot: { title: 'Reset password', subtitle: "We'll send you a reset link", btn: 'Send Reset Link' },
  };

  const config = modeConfig[mode];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Title */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="text-center mb-8"
        >
          <h1 className="font-display font-black text-3xl text-white mb-2">{config.title}</h1>
          <p className="text-slate-400 text-sm">{config.subtitle}</p>
        </motion.div>
      </AnimatePresence>

      {/* Login / Signup Toggle */}
      {mode !== 'forgot' && (
        <div className="flex p-1 rounded-xl bg-slate-100 border border-border mb-6">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              id={`tab-${m}`}
              onClick={() => { setMode(m); clearMessages(); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === m
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {m === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>
      )}

      {/* Error / Success alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-loss/10 border border-loss/30 text-loss text-sm mb-4"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-success/10 border border-success/30 text-success text-sm mb-4"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Sign In (not shown in forgot mode) */}
      {mode !== 'forgot' && (
        <button
          id="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl border border-border bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all duration-200 mb-4 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          Continue with Google
        </button>
      )}

      {/* Divider */}
      {mode !== 'forgot' && (
        <div className="flex items-center gap-4 mb-4 relative">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-slate-400 font-medium bg-white px-2 relative z-10">or with email</span>
          <div className="absolute inset-0 flex items-center" aria-hidden="true" />
        </div>
      )}

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name field (signup only) */}
        {mode === 'signup' && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="signup-name"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-dark w-full pl-11 pr-4 py-3.5 rounded-xl text-sm"
            />
          </div>
        )}

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="login-email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-dark w-full pl-11 pr-4 py-3.5 rounded-xl text-sm"
          />
        </div>

        {/* Password (not for forgot) */}
        {mode !== 'forgot' && (
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="login-password"
              type={showPass ? 'text' : 'password'}
              placeholder={mode === 'signup' ? 'Create a password (6+ chars)' : 'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input-dark w-full pl-11 pr-12 py-3.5 rounded-xl text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              tabIndex={-1}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Forgot password link */}
        {mode === 'login' && (
          <div className="flex justify-end">
            <button
              type="button"
              id="forgot-password-link"
              onClick={() => { setMode('forgot'); clearMessages(); }}
              className="text-xs text-accent hover:text-primary transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit button */}
        <button
          id="auth-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-primary text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {config.btn}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Back to login (forgot mode) */}
        {mode === 'forgot' && (
          <button
            type="button"
            onClick={() => { setMode('login'); clearMessages(); }}
            className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors py-2"
          >
            ← Back to login
          </button>
        )}
      </form>

      {/* T&C */}
      {mode === 'signup' && (
        <p className="text-xs text-slate-500 text-center mt-4 font-medium">
          By signing up, you agree to our{' '}
          <a href="#" className="text-accent hover:underline font-semibold">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-accent hover:underline font-semibold">Privacy Policy</a>
        </p>
      )}
    </div>
  );
}
