'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { signInWithGoogle, signInWithEmail } from '@/lib/auth';
import { verifyAdminAccess } from '@/lib/db';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Activity, Mail, Lock, Loader2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in and verified as admin, redirect
  useEffect(() => {
    if (user && !authLoading) {
      verifyAdminAccess(user.uid, user.email).then(isAdmin => {
        if (isAdmin) {
          router.push('/admin');
        }
      });
    }
  }, [user, authLoading, router]);

  const handlePostLogin = async (uid: string, userEmail?: string | null) => {
    setIsLoading(true);
    try {
      const isAdmin = await verifyAdminAccess(uid, userEmail);
      if (isAdmin) {
        toast.success('Welcome back, Admin.');
        router.push('/admin');
      } else {
        await signOut(auth);
        toast.error('Access Denied: Admin privileges required.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Authentication failed.');
      await signOut(auth);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    
    setIsLoading(true);
    try {
      let result;
      try {
        result = await signInWithEmail(email, password);
      } catch (err: any) {
        // Auto-create the admin account if it doesn't exist
        if (email === 'admin@gmail.com' && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.message?.includes('invalid-credential'))) {
          const { signUpWithEmail } = await import('@/lib/auth');
          result = await signUpWithEmail(email, password);
        } else {
          throw err;
        }
      }
      await handlePostLogin(result.user.uid, result.user.email);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message || 'Failed to login');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      await handlePostLogin(result.user.uid, result.user.email);
    } catch (error: any) {
      setIsLoading(false);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(error.message || 'Google sign-in failed');
      }
    }
  };

  if (authLoading) return null; // let the effect handle redirect

  return (
    <div className="min-h-screen bg-[#0f172a] relative flex items-center justify-center overflow-hidden p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg shadow-blue-500/30">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white font-display mb-2">ApexQuant Admin Portal</h1>
          <div className="flex items-center justify-center gap-2 text-blue-200 text-sm font-medium">
            <ShieldAlert className="w-4 h-4" /> Restricted Access
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Admin Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-all outline-none"
                placeholder="admin@apexquant.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4 before:h-px before:flex-1 before:bg-slate-700 after:h-px after:flex-1 after:bg-slate-700">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Or</span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="mt-6 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>

      </div>
    </div>
  );
}
