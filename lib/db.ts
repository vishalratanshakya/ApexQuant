import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  serverTimestamp, 
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDocs,
  getDoc,
  where
} from 'firebase/firestore';
import { db } from './firebase';

export interface StrategyData {
  id?: string;
  userId?: string;
  name: string;
  instrument: string;
  timeframe: string;
  period?: string;
  positionType?: string;
  orderType?: string;
  status: 'Draft' | 'Backtesting' | 'Live' | 'Paused';
  conditions: any[];
  stopLoss?: number;
  targetProfit?: number;
  trailingSL?: boolean;
  reEntry?: string;
  updatedAt?: any;
  createdAt?: any;
}

export interface BacktestData {
  id?: string;
  userId?: string;
  strategyId: string;
  strategyName: string;
  status: string;
  startedAt?: any;
  completedAt?: any;
  results?: any; // PnL, Win Rate, etc.
}

export interface LiveStrategyData {
  id?: string;
  userId?: string;
  strategyId: string;
  status: 'Running' | 'Paused' | 'Stopped';
  startedAt?: any;
}

// ---------------------------------------------------------
// USER PROFILES
// ---------------------------------------------------------
export interface UserProfileData {
  displayName?: string;
  email?: string;
  phone?: string;
  location?: string;
  experience?: 'Beginner' | 'Intermediate' | 'Advanced' | '';
  bio?: string;
  plan?: 'Free' | 'Pro' | 'Enterprise';
  brokers?: {
    id: string;
    name: string;
    connectedAt: any;
  }[];
  createdAt?: any;
  updatedAt?: any;
}

export async function createUserProfile(userId: string, data: any) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() as UserProfileData : null;
}

export async function updateUserProfile(userId: string, data: Partial<UserProfileData>) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

// ---------------------------------------------------------
// STRATEGIES CRUD (Top-Level Collection)
// ---------------------------------------------------------

export async function saveStrategy(userId: string, strategy: Partial<StrategyData>): Promise<string> {
  const strategiesRef = collection(db, 'strategies');
  const payload = { ...strategy, userId };
  delete payload.id;
  
  if (strategy.id) {
    const docRef = doc(db, 'strategies', strategy.id);
    await updateDoc(docRef, { ...payload, updatedAt: serverTimestamp() });
    return strategy.id;
  } else {
    const docRef = await addDoc(strategiesRef, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return docRef.id;
  }
}

export async function getStrategies(userId: string): Promise<StrategyData[]> {
  const q = query(collection(db, 'strategies'), where('userId', '==', userId));
  const snap = await getDocs(q);
  const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as StrategyData));
  
  // Sort descending by updatedAt locally to avoid needing Firebase Composite Indexes
  return data.sort((a, b) => {
    const timeA = a.updatedAt?.seconds || 0;
    const timeB = b.updatedAt?.seconds || 0;
    return timeB - timeA;
  });
}

export async function getStrategyById(userId: string, strategyId: string): Promise<StrategyData | null> {
  const docRef = doc(db, 'strategies', strategyId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  const data = snap.data() as StrategyData;
  if (data.userId !== userId) return null;
  return { id: snap.id, ...data };
}

export async function deleteStrategy(userId: string, strategyId: string) {
  const docRef = doc(db, 'strategies', strategyId);
  await deleteDoc(docRef);
}

// ---------------------------------------------------------
// BACKTESTS CRUD (Top-Level Collection)
// ---------------------------------------------------------

export async function saveBacktest(userId: string, backtest: Partial<BacktestData>): Promise<string> {
  const backtestsRef = collection(db, 'backtests');
  const payload = { ...backtest, userId };
  delete payload.id;

  if (backtest.id) {
    const docRef = doc(db, 'backtests', backtest.id);
    await updateDoc(docRef, { ...payload });
    return backtest.id;
  } else {
    const docRef = await addDoc(backtestsRef, { ...payload, startedAt: serverTimestamp() });
    return docRef.id;
  }
}

export async function createBacktest(userId: string, strategyId: string, strategyName: string): Promise<string> {
  const backtestsRef = collection(db, 'backtests');
  const docRef = await addDoc(backtestsRef, {
    userId,
    strategyId,
    strategyName,
    status: 'Running',
    startedAt: serverTimestamp()
  });
  
  // Update strategy status
  const strategyRef = doc(db, 'strategies', strategyId);
  await updateDoc(strategyRef, { status: 'Backtesting', updatedAt: serverTimestamp() });
  
  return docRef.id;
}

export async function getBacktests(userId: string): Promise<BacktestData[]> {
  const q = query(collection(db, 'backtests'), where('userId', '==', userId));
  const snap = await getDocs(q);
  const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BacktestData));
  
  // Sort descending by startedAt locally to avoid needing Firebase Composite Indexes
  return data.sort((a, b) => {
    const timeA = a.startedAt?.seconds || 0;
    const timeB = b.startedAt?.seconds || 0;
    return timeB - timeA;
  });
}

export async function getBacktestById(userId: string, backtestId: string): Promise<BacktestData | null> {
  const docRef = doc(db, 'backtests', backtestId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  const data = snap.data() as BacktestData;
  if (data.userId !== userId) return null;
  return { id: snap.id, ...data };
}

// ---------------------------------------------------------
// LIVE DEPLOYMENTS CRUD (Top-Level Collection)
// ---------------------------------------------------------

export async function createLiveStrategy(userId: string, strategyId: string) {
  const liveRef = collection(db, 'deployments');
  const docRef = await addDoc(liveRef, { userId, strategyId, status: 'Running', startedAt: serverTimestamp() });
  
  // Update strategy status
  const strategyRef = doc(db, 'strategies', strategyId);
  await updateDoc(strategyRef, { status: 'Live', updatedAt: serverTimestamp() });
  
  return docRef.id;
}
