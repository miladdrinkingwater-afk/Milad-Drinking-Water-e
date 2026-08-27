import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Safe environment variable retrieval with type check
const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

// Initialize Firebase safely
const app = getApps().length === 0 
  ? initializeApp(
      isFirebaseConfigured 
        ? firebaseConfig 
        : {
            apiKey: 'mock-key-for-offline-preview',
            authDomain: 'milad-drinking-water.firebaseapp.com',
            projectId: 'milad-drinking-water',
            storageBucket: 'milad-drinking-water.appspot.com',
            messagingSenderId: '123456789',
            appId: '1:123456789:web:mockappid'
          }
    )
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Gracefully attempt offline caching where browser supports it
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore offline persistence failed-precondition (multiple tabs).');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore offline persistence unimplemented on this browser.');
    }
  });
}

export default app;
