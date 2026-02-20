import { Timestamp } from 'firebase/firestore';
import type { Hunt, Shiny, UserProfile } from '$lib/types';

export const huntConverter = {
  toFirestore(hunt: Partial<Hunt>) {
    return {
      ...hunt,
      startedAt: hunt.startedAt ? Timestamp.fromDate(hunt.startedAt) : null,
      lastUpdated: Timestamp.now(),
      completedAt: hunt.completedAt ? Timestamp.fromDate(hunt.completedAt) : null,
    };
  },
  fromFirestore(snapshot: any): Hunt {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      startedAt: data.startedAt?.toDate(),
      lastUpdated: data.lastUpdated?.toDate(),
      completedAt: data.completedAt?.toDate(),
    } as Hunt;
  }
};

export const shinyConverter = {
  toFirestore(shiny: Partial<Shiny>) {
    return {
      ...shiny,
      caughtAt: shiny.caughtAt ? Timestamp.fromDate(shiny.caughtAt) : Timestamp.now(),
    };
  },
  fromFirestore(snapshot: any): Shiny {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      caughtAt: data.caughtAt?.toDate(),
    } as Shiny;
  }
};
