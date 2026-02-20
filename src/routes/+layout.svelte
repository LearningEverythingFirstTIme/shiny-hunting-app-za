<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/auth';
  import { subscribeToHunts } from '$lib/services/huntService';
  import { subscribeToShinies } from '$lib/services/shinyService';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import BottomNav from '$lib/components/layout/BottomNav.svelte';
  
  let unsubscribeHunts: (() => void) | null = null;
  let unsubscribeShinies: (() => void) | null = null;
  
  onMount(() => {
    const unsub = user.subscribe(($user) => {
      if ($user) {
        unsubscribeHunts = subscribeToHunts($user.uid);
        unsubscribeShinies = subscribeToShinies($user.uid);
      } else {
        if (unsubscribeHunts) {
          unsubscribeHunts();
          unsubscribeHunts = null;
        }
        if (unsubscribeShinies) {
          unsubscribeShinies();
          unsubscribeShinies = null;
        }
      }
    });
    
    return () => {
      unsub();
      if (unsubscribeHunts) unsubscribeHunts();
      if (unsubscribeShinies) unsubscribeShinies();
    };
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFE4E9] to-[#E0F4FC]">
  <div class="flex">
    <!-- Sidebar - hidden on mobile -->
    <Sidebar />
    
    <!-- Main content area -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Mobile hamburger nav at TOP -->
      <div class="lg:hidden">
        <BottomNav />
      </div>
      
      <!-- Page content -->
      <main class="flex-1 p-4 page-transition">
        <slot />
      </main>
    </div>
  </div>
</div>
