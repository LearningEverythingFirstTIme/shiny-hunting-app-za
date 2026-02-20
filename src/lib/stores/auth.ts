import { writable, derived } from 'svelte/store';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '$lib/firebase/client';

// User auth state
export const user = writable<User | null>(null);
export const isAuthenticated = derived(user, $user => !!$user);
export const isLoading = writable(true);

// Initialize auth listener
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, (u) => {
    user.set(u);
    isLoading.set(false);
  });
}
