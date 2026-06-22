'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { doc, onSnapshot } from 'firebase/firestore';
import { UserProfileData } from '@/lib/db';
import { db } from '@/lib/firebase';

export function useSubscription() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserProfileData;
        // Provide fallback defaults for existing users without subscription field
        if (!data.subscription) {
          data.subscription = {
            plan: 'Free',
            status: 'active',
            expiresAt: null,
            backtestCreditsUsed: 0,
            backtestCreditsLimit: 10,
          };
        }
        setProfile(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const plan = profile?.subscription?.plan || 'Free';
  const isPro = plan === 'Pro' || plan === 'Enterprise';
  const isEnterprise = plan === 'Enterprise';
  
  const backtestCreditsUsed = profile?.subscription?.backtestCreditsUsed || 0;
  const backtestCreditsLimit = isPro ? Infinity : (profile?.subscription?.backtestCreditsLimit || 10);
  const remainingBacktests = isPro ? 'Unlimited' : Math.max(0, backtestCreditsLimit - backtestCreditsUsed);
  const canRunBacktest = isPro || backtestCreditsUsed < backtestCreditsLimit;

  // Broker Limits
  const currentBrokers = profile?.brokers?.length || 0;
  const brokerLimit = isPro ? 5 : 1;
  const canConnectBroker = currentBrokers < brokerLimit;

  return {
    profile,
    plan,
    isPro,
    isEnterprise,
    loading,
    backtestCreditsUsed,
    backtestCreditsLimit,
    remainingBacktests,
    canRunBacktest,
    canDeployLive: isPro,
    maxActiveStrategies: isPro ? 20 : 3,
    maxSavedStrategies: isPro ? 20 : 3,
    canConnectBroker,
    brokerLimit,
    currentBrokers
  };
}
