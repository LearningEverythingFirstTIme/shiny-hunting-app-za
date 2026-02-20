<script lang="ts">
  import { shinies } from '$lib/services/shinyService';
  import AuthGuard from '$lib/components/layout/AuthGuard.svelte';
  import ShinyCard from '$lib/components/shinies/ShinyCard.svelte';
  import { Sparkles, Trophy } from 'lucide-svelte';
  
  $: totalShinies = $shinies.length;
  $: totalEncounters = $shinies.reduce((sum, s) => sum + (s.encounters || 0), 0);
</script>

<AuthGuard>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold">My Shinies</h1>
        <p class="text-gray-500">{totalShinies} shiny{totalShinies !== 1 ? 's' : ''} caught</p>
      </div>
      
      <div class="flex items-center gap-4">
        {#if totalShinies > 0}
          <div class="text-right">
            <p class="text-sm text-gray-500">Total Encounters</p>
            <p class="text-xl font-bold">{totalEncounters.toLocaleString()}</p>
          </div>
        {/if}
        
        <a href="/pokedex" class="btn btn-success btn-sm">
          <Sparkles class="w-4 h-4 mr-1" />
          Record Shiny
        </a>
      </div>
    </div>
    
    <!-- Shinies Grid -->
    {#if $shinies.length === 0}
      <div class="card bg-base-100 shadow">
        <div class="card-body items-center text-center py-12">
          <div class="text-6xl mb-4">✨</div>
          <h2 class="text-xl font-bold mb-2">No Shinies Yet</h2>
          <p class="text-gray-500 mb-6">
            Record your first shiny Pokemon when you catch one!
          </p>
          <a href="/pokedex" class="btn btn-success">Record Your First Shiny</a>
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {#each $shinies as shiny (shiny.id)}
          <ShinyCard {shiny} />
        {/each}
      </div>
    {/if}
  </div>
</AuthGuard>
