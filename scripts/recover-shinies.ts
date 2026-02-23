// Recovery script to retroactively create shiny records from completed hunts
// This is a one-time script to fix hunts that were completed before the bug fix

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp
} from 'firebase/firestore';

// Firebase config - same as the app
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function recoverShiniesFromCompletedHunts(userId: string) {
  console.log(`Starting recovery for user: ${userId}`);

  try {
    // Get all completed hunts for this user
    const huntsQuery = query(
      collection(db, 'hunts'),
      where('userId', '==', userId),
      where('status', '==', 'completed')
    );

    const huntsSnapshot = await getDocs(huntsQuery);
    console.log(`Found ${huntsSnapshot.size} completed hunts`);

    // Get all existing shinies for this user
    const shiniesQuery = query(
      collection(db, 'shinies'),
      where('userId', '==', userId)
    );

    const shiniesSnapshot = await getDocs(shiniesQuery);
    console.log(`Found ${shiniesSnapshot.size} existing shinies`);

    // Create a set of pokemonIds that already have shiny records
    const existingShinyPokemonIds = new Set(
      shiniesSnapshot.docs.map(doc => doc.data().pokemonId)
    );

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const huntDoc of huntsSnapshot.docs) {
      const hunt = huntDoc.data();

      // Check if a shiny already exists for this pokemon
      if (existingShinyPokemonIds.has(hunt.pokemonId)) {
        console.log(`Skipping ${hunt.pokemonName} - shiny already exists`);
        skipped++;
        continue;
      }

      try {
        // Create shiny record from hunt data
        await addDoc(collection(db, 'shinies'), {
          userId: hunt.userId,
          pokemonId: hunt.pokemonId,
          pokemonName: hunt.pokemonName,
          shinySpriteUrl: hunt.shinySpriteUrl,
          method: hunt.method,
          encounters: hunt.encounters || 0,
          caughtAt: hunt.completedAt || Timestamp.now(),
          notes: hunt.notes || '',
          favorite: false,
          tags: [],
          isAlpha: hunt.isAlpha || false
        });

        console.log(`Created shiny record for ${hunt.pokemonName}`);
        created++;
      } catch (error) {
        console.error(`Error creating shiny for ${hunt.pokemonName}:`, error);
        errors++;
      }
    }

    console.log('\n=== Recovery Complete ===');
    console.log(`Created: ${created}`);
    console.log(`Skipped (already exist): ${skipped}`);
    console.log(`Errors: ${errors}`);

  } catch (error) {
    console.error('Recovery failed:', error);
  }
}

// Run the recovery
// Replace with Jo's actual user ID from Firebase Auth
const JO_USER_ID = process.argv[2];

if (!JO_USER_ID) {
  console.error('Usage: npx tsx scripts/recover-shinies.ts <user-id>');
  console.error('Please provide Jo\'s Firebase user ID as an argument');
  process.exit(1);
}

recoverShiniesFromCompletedHunts(JO_USER_ID);
