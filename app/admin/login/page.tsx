'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { signInWithEmail } from '@/lib/auth';
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

  if (authLoading) return null; // let the effect handle redirect

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center overflow-hidden p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 relative z-10 shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8">
          <img src="/logo.png" alt="ApexQuant" className="h-32 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 font-display mb-2 mt-2">Admin Portal</h1>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium">
            <ShieldAlert className="w-4 h-4 text-red-500" /> Restricted Access
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admin Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400 transition-all outline-none"
                placeholder="admin@apexquant.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login to Dashboard'}
          </button>
        </form>

      </div>
    </div>
  );
}
