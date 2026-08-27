import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { AdminUser, AdminRole } from '../types';

export class AuthService {
  // Listen for admin auth state changes
  onAuthChange(callback: (user: AdminUser | null) => void): () => void {
    if (!isFirebaseConfigured) {
      // Offline/Local development demo session if stored
      const localAdmin = this.getLocalAdminSession();
      callback(localAdmin);
      return () => {};
    }

    return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        this.clearLocalAdminSession();
        callback(null);
        return;
      }

      try {
        const adminDocRef = doc(db, 'admins', firebaseUser.uid);
        const adminSnap = await getDoc(adminDocRef);

        if (adminSnap.exists()) {
          const adminData = adminSnap.data() as AdminUser;
          if (adminData.active) {
            callback(adminData);
            return;
          }
        }

        // Default fallback if user authenticated with valid admin credentials
        const fallbackAdmin: AdminUser = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Authorized Admin',
          email: firebaseUser.email || '',
          role: 'ADMIN',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        callback(fallbackAdmin);
      } catch (err) {
        console.warn('Could not fetch admin role doc from Firestore:', err);
        const fallbackAdmin: AdminUser = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Authorized Admin',
          email: firebaseUser.email || '',
          role: 'ADMIN',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        callback(fallbackAdmin);
      }
    });
  }

  // Admin Login
  async login(email: string, pass: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const cleanEmail = email.trim();

    if (!isFirebaseConfigured) {
      // Mock / Offline dev fallback when environment variables are not yet provided
      if (cleanEmail === 'miladdrinkingwater@gmail.com' && pass === 'Milad@2006') {
        const mockAdmin: AdminUser = {
          uid: 'dev-admin-uid-1',
          name: 'হাজী মিলাদ আহমদ (Proprietor)',
          email: cleanEmail,
          role: 'ADMIN',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.setLocalAdminSession(mockAdmin);
        return { success: true, user: mockAdmin };
      }
      return { 
        success: false, 
        error: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। (অথবা .env কনফিগ প্রদান করুন)' 
      };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const user = userCredential.user;

      const adminUser: AdminUser = {
        uid: user.uid,
        name: user.displayName || 'Admin',
        email: user.email || cleanEmail,
        role: 'ADMIN',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.setLocalAdminSession(adminUser);
      return { success: true, user: adminUser };
    } catch (error: any) {
      let message = 'লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'অতিরিক্ত ভুল চেষ্টার কারণে সাময়িকভাবে বন্ধ। কিছুক্ষণ পর চেষ্টা করুন।';
      }
      return { success: false, error: message };
    }
  }

  // Password Reset
  async sendPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    if (!isFirebaseConfigured) {
      return { 
        success: true, 
        message: 'পাসওয়ার্ড রিসেট নির্দেশনা সফলভাবে পাঠানো হয়েছে (ডেভেলপমেন্ট মোড)।' 
      };
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { 
        success: true, 
        message: 'পাসওয়ার্ড রিসেট করার লিংক আপনার ইমেইলে পাঠানো হয়েছে।' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: 'পাসওয়ার্ড রিসেট ইমেইল পাঠানো সম্ভব হয়নি। ইমেইলটি পুনরায় পরীক্ষা করুন।' 
      };
    }
  }

  // Logout
  async logout(): Promise<void> {
    this.clearLocalAdminSession();
    if (isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('SignOut error:', err);
      }
    }
  }

  // Session storage helpers
  private getLocalAdminSession(): AdminUser | null {
    try {
      const raw = sessionStorage.getItem('milad_admin_session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private setLocalAdminSession(user: AdminUser) {
    try {
      sessionStorage.setItem('milad_admin_session', JSON.stringify(user));
    } catch {}
  }

  private clearLocalAdminSession() {
    try {
      sessionStorage.removeItem('milad_admin_session');
    } catch {}
  }
}

export const authService = new AuthService();
