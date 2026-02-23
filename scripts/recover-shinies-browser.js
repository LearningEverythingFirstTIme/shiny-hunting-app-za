// One-time recovery function - run this in the browser console
// Instructions:
// 1. Open the shiny hunting app in a browser
// 2. Make sure Jo is logged in
// 3. Open browser dev tools (F12)
// 4. Go to Console tab
// 5. Paste this entire script and press Enter
// 6. Wait for it to complete

(async function recoverShinies() {
  // Get the current user
  const { getAuth } = await import('firebase/auth');
  const { getFirestore, collection, query, where, getDocs, addDoc, Timestamp } = await import('firebase/firestore');

  const auth = getAuth();
  const db = getFirestore();

  const user = auth.currentUser;
  if (!user) {
    console.error('❌ No user logged in. Please log in first.');
    return;
  }

  const userId = user.uid;
  console.log(`🔍 Starting recovery for user: ${userId}`);
  console.log('⏳ This may take a moment...\n');

  try {
    // Get all completed hunts
    const huntsQuery = query(
      collection(db, 'hunts'),
      where('userId', '==', userId),
      where('status', '==', 'completed')
    );

    const huntsSnapshot = await getDocs(huntsQuery);
    console.log(`📋 Found ${huntsSnapshot.size} completed hunts`);

    // Get all existing shinies
    const shiniesQuery = query(
      collection(db, 'shinies'),
      where('userId', '==', userId)
    );

    const shiniesSnapshot = await getDocs(shiniesQuery);
    console.log(`✨ Found ${shiniesSnapshot.size} existing shinies`);

    // Track which pokemon already have shinies
    const existingShinyIds = new Set();
    shiniesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      existingShinyIds.add(`${data.pokemonId}-${data.caughtAt?.toDate?.()?.toISOString() || 'unknown'}`);
    });

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const huntDoc of huntsSnapshot.docs) {
      const hunt = huntDoc.data();

      // Check if shiny already exists (by pokemonId and completion time)
      const shinyKey = `${hunt.pokemonId}-${hunt.completedAt?.toDate?.()?.toISOString() || 'unknown'}`;

      // Also check by just pokemonId as a fallback
      const hasExistingShiny = shiniesSnapshot.docs.some(doc => {
        const shiny = doc.data();
        return shiny.pokemonId === hunt.pokemonId;
      });

      if (hasExistingShiny) {
        console.log(`⏭️  Skipping ${hunt.pokemonName} - shiny already exists`);
        skipped++;
        continue;
      }

      try {
        await addDoc(collection(db, 'shinies'), {
          userId: hunt.userId,
          pokemonId: hunt.pokemonId,
          pokemonName: hunt.pokemonName,
          shinySpriteUrl: hunt.shinySpriteUrl,
          method: hunt.method,
          encounters: hunt.encounters || 0,
          caughtAt: hunt.completedAt || Timestamp.now(),
          notes: hunt.notes || `Recovered from completed hunt on ${new Date().toLocaleDateString()}`,
          favorite: false,
          tags: [],
          isAlpha: hunt.isAlpha || false
        });

        console.log(`✅ Created shiny record for ${hunt.pokemonName}`);
        created++;
      } catch (error) {
        console.error(`❌ Error creating shiny for ${hunt.pokemonName}:`, error);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(40));
    console.log('🎉 RECOVERY COMPLETE!');
    console.log('='.repeat(40));
    console.log(`✅ Created: ${created} new shiny records`);
    console.log(`⏭️  Skipped: ${skipped} (already existed)`);
    console.log(`❌ Errors: ${errors}`);
    console.log('\n🔄 Refresh the page to see your recovered shinies!');

  } catch (error) {
    console.error('💥 Recovery failed:', error);
  }
})();
