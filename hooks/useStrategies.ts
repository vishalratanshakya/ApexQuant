import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StrategyData } from '@/lib/db';
import { useAuth } from './useAuth';

export function useStrategies() {
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<StrategyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStrategies([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'strategies'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StrategyData[];
      
      data.sort((a, b) => {
        const timeA = a.updatedAt?.seconds || 0;
        const timeB = b.updatedAt?.seconds || 0;
        return timeB - timeA;
      });
      
      setStrategies(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching strategies:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { strategies, loading };
}
