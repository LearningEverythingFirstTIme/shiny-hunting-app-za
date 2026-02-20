<script lang="ts">
  import { shinies } from '$lib/services/shinyService';
  import AuthGuard from '$lib/components/layout/AuthGuard.svelte';
  import ShinyCard from '$lib/components/shinies/ShinyCard.svelte';
  import { Sparkles, Plus, Trophy } from 'lucide-svelte';
  
  $: totalShinies = $shinies.length;
  $: totalEncounters = $shinies.reduce((sum, s) => sum + (s.encounters || 0), 0);
</script>

<AuthGuard>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-lg animate-pulse-soft">
          <Sparkles class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#2D1B2E]">My Shinies</h1>
          <p class="text-[#4A3A4B]">{totalShinies} shiny{totalShinies !== 1 ? 's' : ''} caught</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        {#if totalShinies > 0}
          <div class="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-[#FFD700]/30">
            <p class="text-xs text-[#4A3A4B] uppercase tracking-wide">Total Encounters</p>
            <p class="text-xl font-bold text-[#2D1B2E]">{totalEncounters.toLocaleString()}</p>
          </div>
        {/if}
        
        <a href="/pokedex" class="btn bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white border-0 hover:shadow-lg hover:brightness-105 transition-all btn-sm">
          <Plus class="w-4 h-4 mr-1" />
          Record Shiny
        </a>
      </div>
    </div>
    
    <!-- Shinies Grid -->
    {#if $shinies.length === 0}
      <div class="card bg-white/70 backdrop-blur-sm shadow-xl border border-[#FFD700]/30 rounded-2xl overflow-hidden">
        <div class="h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500]"></div>
        
        <div class="card-body items-center text-center py-12">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFFACD] to-[#FFE4B5] flex items-center justify-center mb-6 animate-float">
            <Trophy class="w-12 h-12 text-[#FFA500]" />
          </div>
          
          <h2 class="text-xl font-bold mb-2 text-[#2D1B2E]">No Shinies Yet</h2>
          <p class="text-[#4A3A4B] mb-6 max-w-sm">
            Record your first shiny Pokemon when you catch one!
          </p>
          
          <a href="/pokedex" class="btn bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white border-0 hover:shadow-lg hover:brightness-105 transition-all">
            <Sparkles class="w-4 h-4 mr-2" />
            Record Your First Shiny
          </a>
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
