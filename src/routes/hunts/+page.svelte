<script lang="ts">
  import { activeHunts } from '$lib/services/huntService';
  import AuthGuard from '$lib/components/layout/AuthGuard.svelte';
  import HuntCard from '$lib/components/hunts/HuntCard.svelte';
  import { Target } from 'lucide-svelte';
</script>

<AuthGuard>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Active Hunts</h1>
        <p class="text-gray-500">{$activeHunts.length} active hunt{$activeHunts.length !== 1 ? 's' : ''}</p>
      </div>
      
      <a href="/pokedex" class="btn btn-primary btn-sm">
        <Target class="w-4 h-4 mr-1" />
        Start New Hunt
      </a>
    </div>
    
    <!-- Hunts List -->
    {#if $activeHunts.length === 0}
      <div class="card bg-base-100 shadow">
        <div class="card-body items-center text-center py-12">
          <div class="text-6xl mb-4">🎯</div>
          <h2 class="text-xl font-bold mb-2">No Active Hunts</h2>
          <p class="text-gray-500 mb-6">
            Start tracking your shiny hunts by selecting a Pokemon from the Pokedex
          </p>
          <a href="/pokedex" class="btn btn-primary">Browse Pokedex</a>
        </div>
      </div>
    {:else}
      <div class="grid gap-4">
        {#each $activeHunts as hunt (hunt.id)}
          <HuntCard {hunt} />
        {/each}
      </div>
    {/if}
  </div>
</AuthGuard>
