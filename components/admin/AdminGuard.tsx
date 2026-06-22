'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { verifyAdminAccess } from '@/lib/db';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/admin/login');
      return;
    }

    const checkAdmin = async () => {
      try {
        const hasAccess = await verifyAdminAccess(user.uid, user.email);
        if (hasAccess) {
          setIsAdmin(true);
        } else {
          toast.error('Access Denied: Admin privileges required.');
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error verifying admin access:', error);
        router.push('/admin/login');
      } finally {
        setVerifying(false);
      }
    };

    checkAdmin();
  }, [user, authLoading, router]);

  if (authLoading || verifying) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Verifying Admin Credentials...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
