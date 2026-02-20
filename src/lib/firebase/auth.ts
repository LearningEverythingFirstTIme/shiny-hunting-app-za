import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut
} from 'firebase/auth';
import { auth } from './client';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const logout = () => signOut(auth);
