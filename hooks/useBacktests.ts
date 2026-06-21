import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BacktestData } from '@/lib/db';
import { useAuth } from './useAuth';

export function useBacktests() {
  const { user } = useAuth();
  const [backtests, setBacktests] = useState<BacktestData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBacktests([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'backtests'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BacktestData[];
      
      data.sort((a, b) => {
        const timeA = a.startedAt?.seconds || 0;
        const timeB = b.startedAt?.seconds || 0;
        return timeB - timeA;
      });
      
      setBacktests(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching backtests:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { backtests, loading };
}
