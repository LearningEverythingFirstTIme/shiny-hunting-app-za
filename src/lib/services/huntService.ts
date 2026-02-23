import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '$lib/firebase/client';
import { writable } from 'svelte/store';
import type { Hunt, HuntMethod } from '$lib/types';
import { recordShiny } from './shinyService';

export const activeHunts = writable<Hunt[]>([]);
export const completedHunts = writable<Hunt[]>([]);

export function subscribeToHunts(userId: string) {
  // Subscribe to active hunts
  const activeQuery = query(
    collection(db, 'hunts'),
    where('userId', '==', userId),
    where('status', '==', 'active')
  );

  const activeUnsub = onSnapshot(activeQuery, (snapshot) => {
    const hunts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startedAt: doc.data().startedAt?.toDate(),
      lastUpdated: doc.data().lastUpdated?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
    })) as Hunt[];
    // Sort by most recently initiated (startedAt desc)
    hunts.sort((a, b) => (b.startedAt?.getTime() || 0) - (a.startedAt?.getTime() || 0));
    activeHunts.set(hunts);
  });

  // Subscribe to completed hunts
  const completedQuery = query(
    collection(db, 'hunts'),
    where('userId', '==', userId),
    where('status', '==', 'completed')
  );

  const completedUnsub = onSnapshot(completedQuery, (snapshot) => {
    const hunts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startedAt: doc.data().startedAt?.toDate(),
      lastUpdated: doc.data().lastUpdated?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
    })) as Hunt[];
    completedHunts.set(hunts);
  });

  return () => {
    activeUnsub();
    completedUnsub();
  };
}

export async function startHunt(
  userId: string,
  pokemonId: number,
  pokemonName: string,
  spriteUrl: string,
  shinySpriteUrl: string,
  method: HuntMethod,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await addDoc(collection(db, 'hunts'), {
      userId,
      pokemonId,
      pokemonName,
      spriteUrl,
      shinySpriteUrl,
      method,
      status: 'active',
      encounters: 0,
      startedAt: Timestamp.now(),
      lastUpdated: Timestamp.now(),
      durationMinutes: 0,
      notes: notes || '',
      caught: false
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function incrementHunt(huntId: string, amount: number = 1): Promise<{ success: boolean; error?: string }> {
  try {
    const huntRef = doc(db, 'hunts', huntId);
    const huntDoc = await getDocs(query(collection(db, 'hunts'), where('__name__', '==', huntId)));
    const huntData = huntDoc.docs[0]?.data();

    if (!huntData) throw new Error('Hunt not found');

    const currentEncounters = huntData.encounters || 0;
    const startedAt = huntData.startedAt?.toDate();
    const now = new Date();
    const durationMinutes = startedAt
      ? Math.floor((now.getTime() - startedAt.getTime()) / 60000)
      : 0;

    await updateDoc(huntRef, {
      encounters: currentEncounters + amount,
      lastUpdated: Timestamp.now(),
      durationMinutes
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function decrementHunt(huntId: string, amount: number = 1): Promise<{ success: boolean; error?: string }> {
  try {
    const huntRef = doc(db, 'hunts', huntId);
    const huntDoc = await getDocs(query(collection(db, 'hunts'), where('__name__', '==', huntId)));
    const huntData = huntDoc.docs[0]?.data();

    if (!huntData) throw new Error('Hunt not found');

    const currentEncounters = huntData.encounters || 0;
    // Don't go below 0
    const newEncounters = Math.max(0, currentEncounters - amount);

    await updateDoc(huntRef, {
      encounters: newEncounters,
      lastUpdated: Timestamp.now()
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateHuntEncounters(huntId: string, encounters: number): Promise<{ success: boolean; error?: string }> {
  try {
    const huntRef = doc(db, 'hunts', huntId);
    await updateDoc(huntRef, {
      encounters,
      lastUpdated: Timestamp.now()
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function completeHunt(huntId: string, finalEncounters: number): Promise<{ success: boolean; error?: string }> {
  try {
    const huntRef = doc(db, 'hunts', huntId);
    const huntDoc = await getDocs(query(collection(db, 'hunts'), where('__name__', '==', huntId)));
    const huntData = huntDoc.docs[0]?.data();

    if (!huntData) throw new Error('Hunt not found');

    const startedAt = huntData.startedAt?.toDate();
    const now = new Date();
    const durationMinutes = startedAt
      ? Math.floor((now.getTime() - startedAt.getTime()) / 60000)
      : 0;

    // First, record the shiny
    const shinyResult = await recordShiny(
      huntData.userId,
      huntData.pokemonId,
      huntData.pokemonName,
      huntData.shinySpriteUrl,
      huntData.method,
      finalEncounters,
      huntData.notes || '',
      huntData.isAlpha || false
    );

    if (!shinyResult.success) {
      throw new Error(`Failed to record shiny: ${shinyResult.error}`);
    }

    // Then, mark the hunt as completed
    await updateDoc(huntRef, {
      status: 'completed',
      encounters: finalEncounters,
      completedAt: Timestamp.now(),
      lastUpdated: Timestamp.now(),
      durationMinutes,
      caught: true
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function resetHunt(huntId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const huntRef = doc(db, 'hunts', huntId);
    await updateDoc(huntRef, {
      encounters: 0,
      status: 'active',
      startedAt: Timestamp.now(),
      lastUpdated: Timestamp.now(),
      durationMinutes: 0,
      completedAt: null,
      caught: false
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteHunt(huntId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, 'hunts', huntId));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
