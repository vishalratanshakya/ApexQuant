import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  UserCredential,
  User,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Check if Firebase config is still using the default placeholder API key
export const isMock = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
                      process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_api_key_here';

// Helper to get and set mock user from session storage
const getMockUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem('mock_user');
  if (stored) {
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }
  return null;
};

const setMockUser = (user: User | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    sessionStorage.setItem('mock_user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    }));
  } else {
    sessionStorage.removeItem('mock_user');
  }
};

const mockListeners: ((user: User | null) => void)[] = [];

// Unified auth state listener that falls back to mock storage
export function onAuthChanged(callback: (user: User | null) => void) {
  if (isMock) {
    const currentUser = getMockUser();
    callback(currentUser);
    mockListeners.push(callback);
    return () => {
      const idx = mockListeners.indexOf(callback);
      if (idx !== -1) mockListeners.splice(idx, 1);
    };
  } else {
    return auth.onAuthStateChanged(callback);
  }
}

function notifyMockListeners(user: User | null) {
  setMockUser(user);
  mockListeners.forEach(cb => cb(user));
}

// Ensure a user document exists in Firestore
async function ensureUserDocument(user: User) {
  if (!user || isMock) return;
  const userRef = doc(db, 'users', user.uid);
  try {
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        createdAt: serverTimestamp(),
        credits: 1000,
        role: 'user'
      });
    }
  } catch (error) {
    console.error("Error creating user document:", error);
  }
}

export async function signInWithGoogle(): Promise<UserCredential> {
  if (isMock) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockUser = {
      uid: 'google-user-id',
      email: 'google.trader@gmail.com',
      displayName: 'Google Trader',
    } as unknown as User;
    notifyMockListeners(mockUser);
    return { user: mockUser } as UserCredential;
  }
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserDocument(result.user);
  return result;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  if (isMock) {
    await new Promise(resolve => setTimeout(resolve, 850));
    // Accept demo@apexquant.com/password123 or anything else if you want to support easy signup/login
    if (email === 'demo@apexquant.com' && password === 'password123') {
      const mockUser = {
        uid: 'demo-trader-id',
        email: 'demo@apexquant.com',
        displayName: 'Demo Trader',
      } as unknown as User;
      notifyMockListeners(mockUser);
      return { user: mockUser } as UserCredential;
    } else {
      // Check session storage if the user was dynamically signed up
      const stored = sessionStorage.getItem(`mock_signup_${email}`);
      if (stored && stored === password) {
        const mockUser = {
          uid: 'custom-trader-id-' + Math.random().toString(36).substr(2, 9),
          email: email,
          displayName: email.split('@')[0],
        } as unknown as User;
        notifyMockListeners(mockUser);
        return { user: mockUser } as UserCredential;
      }
      throw new Error('Firebase: Error (auth/invalid-credential).');
    }
  }
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name?: string
): Promise<UserCredential> {
  if (isMock) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Store mock user info in session storage so it can be logged in
    sessionStorage.setItem(`mock_signup_${email}`, password);
    const mockUser = {
      uid: 'mock-user-' + Math.random().toString(36).substr(2, 9),
      email: email,
      displayName: name || email.split('@')[0],
    } as unknown as User;
    notifyMockListeners(mockUser);
    return { user: mockUser } as UserCredential;
  }
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    try {
      await updateProfile(result.user, { displayName: name });
      // update the object locally immediately so ensureUserDocument sees it
      result.user = { ...result.user, displayName: name } as User;
    } catch (e) {}
  }
  await ensureUserDocument(result.user);
  return result;
}

export async function sendResetEmail(email: string): Promise<void> {
  if (isMock) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return;
  }
  return sendPasswordResetEmail(auth, email);
}

export async function signOut(): Promise<void> {
  if (isMock) {
    notifyMockListeners(null);
    return;
  }
  return firebaseSignOut(auth);
}

