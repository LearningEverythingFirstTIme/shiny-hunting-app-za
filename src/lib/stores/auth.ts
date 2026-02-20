import { writable, derived } from 'svelte/store';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '$lib/firebase/client';

// User auth state
export const user = writable<User | null>(null);
export const isAuthenticated = derived(user, $user => !!$user);
export const isLoading = writable(true);

// Initialize auth listener
if (typeof window !== 'undefined') {
  console.log('Initializing auth listener...');
  
  // Safety timeout - if auth takes too long, stop loading
  const timeout = setTimeout(() => {
    console.log('Auth timeout reached, forcing loading false');
    isLoading.set(false);
  }, 5000);
  
  onAuthStateChanged(auth, (u) => {
    console.log('Auth state changed:', u ? 'logged in' : 'logged out');
    clearTimeout(timeout);
    user.set(u);
    isLoading.set(false);
  });
}
