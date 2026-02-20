<script lang="ts">
  import { activeHunts } from '$lib/services/huntService';
  import AuthGuard from '$lib/components/layout/AuthGuard.svelte';
  import HuntCard from '$lib/components/hunts/HuntCard.svelte';
  import { Target, Plus } from 'lucide-svelte';
</script>

<AuthGuard>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#4A90E2] flex items-center justify-center shadow-lg">
          <Target class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#2D1B2E]">Active Hunts</h1>
          <p class="text-[#4A3A4B]">{$activeHunts.length} active hunt{$activeHunts.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      
      <a href="/pokedex" class="btn bg-gradient-to-r from-[#FFB7C5] to-[#E89AAA] text-white border-0 hover:shadow-lg hover:brightness-105 transition-all btn-sm">
        <Plus class="w-4 h-4 mr-1" />
        Start New Hunt
      </a>
    </div>
    
    <!-- Hunts List -->
    {#if $activeHunts.length === 0}
      <div class="card bg-white/70 backdrop-blur-sm shadow-xl border border-[#87CEEB]/30 rounded-2xl overflow-hidden">
        <div class="h-1 bg-gradient-to-r from-[#87CEEB] to-[#4A90E2]"></div>
        
        <div class="card-body items-center text-center py-12">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-[#E0F4FC] to-[#B0E0F0] flex items-center justify-center mb-6 animate-float">
            <Target class="w-12 h-12 text-[#5BA8D0]" />
          </div>
          
          <h2 class="text-xl font-bold mb-2 text-[#2D1B2E]">No Active Hunts</h2>
          <p class="text-[#4A3A4B] mb-6 max-w-sm">
            Start tracking your shiny hunts by selecting a Pokemon from the Pokedex
          </p>
          
          <a href="/pokedex" class="btn bg-gradient-to-r from-[#FFB7C5] to-[#E89AAA] text-white border-0 hover:shadow-lg hover:brightness-105 transition-all">
            <Target class="w-4 h-4 mr-2" />
            Browse Pokedex
          </a>
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
