'use client';
import { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth';

interface Props {
  onNext: () => void;
}

export default function Step1Auth({ onNext }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Successfully logged in with Google!');
      onNext();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUpWithEmail(email, password);
      toast.success('Account created successfully!');
      onNext();
    } catch (err: unknown) {
      let msg = 'Something went wrong. Please try again.';
      if (err instanceof Error) {
        if (err.message.includes('email-already-in-use')) {
          msg = 'An account with this email already exists. Try Google sign-in instead.';
        } else if (err.message.includes('weak-password')) {
          msg = 'Password must be at least 6 characters.';
        } else if (err.message.includes('invalid-email')) {
          msg = 'Please enter a valid email address.';
        }
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full justify-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black font-display text-text mb-2 tracking-tight">
          Welcome to ApexQuant
        </h2>
        <p className="text-slate-500 font-medium">
          Let&apos;s build your first strategy in under <span className="text-primary font-bold">5 minutes</span>
        </p>
      </div>

      <div className="max-w-sm w-full mx-auto">
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl border border-border bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all duration-200 mb-6 shadow-sm"
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

        <div className="flex items-center gap-4 mb-6 relative">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-slate-400 font-medium bg-white px-2 relative z-10">or sign up with email</span>
          <div className="absolute inset-0 flex items-center" aria-hidden="true" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-dark w-full pl-11 pr-4 py-3.5 rounded-xl text-sm"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input-dark w-full pl-11 pr-4 py-3.5 rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-primary text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
