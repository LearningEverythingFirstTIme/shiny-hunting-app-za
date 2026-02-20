import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '$lib/firebase/client';
import { writable } from 'svelte/store';
import type { Shiny, HuntMethod } from '$lib/types';

export const shinies = writable<Shiny[]>([]);

export function subscribeToShinies(userId: string) {
  const q = query(
    collection(db, 'shinies'),
    where('userId', '==', userId),
    orderBy('caughtAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const shinyList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      caughtAt: doc.data().caughtAt?.toDate(),
    })) as Shiny[];
    shinies.set(shinyList);
  });
}

export async function recordShiny(
  userId: string,
  pokemonId: number,
  pokemonName: string,
  shinySpriteUrl: string,
  method: HuntMethod,
  encounters: number,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await addDoc(collection(db, 'shinies'), {
      userId,
      pokemonId,
      pokemonName,
      shinySpriteUrl,
      method,
      encounters,
      caughtAt: Timestamp.now(),
      notes: notes || '',
      favorite: false,
      tags: []
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteShiny(shinyId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, 'shinies', shinyId));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
