<script lang="ts">
  import { formatTimeAgo } from '$lib/utils/formatters';
  import { deleteShiny } from '$lib/services/shinyService';
  import type { Shiny } from '$lib/types';
  import { Trash2, Sparkles, Trophy } from 'lucide-svelte';
  
  export let shiny: Shiny;
  
  async function handleDelete() {
    if (confirm(`Delete ${shiny.pokemonName} from your shinies?`)) {
      await deleteShiny(shiny.id);
    }
  }
  
  $: caughtAt = shiny.caughtAt ? formatTimeAgo(shiny.caughtAt) : 'Unknown';
  $: displayName = shiny.pokemonName.charAt(0).toUpperCase() + shiny.pokemonName.slice(1);
</script>

<div class="card bg-white/80 backdrop-blur-sm shadow-lg border border-[#FFD700]/30 rounded-2xl overflow-hidden group card-hover">
  <div class="h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500]"></div>
  
  <div class="relative bg-gradient-to-b from-[#FFFACD]/60 to-[#FFE4B5]/30 p-4">
    <!-- Delete button - always visible on mobile, hover on desktop -->
    <button 
      class="absolute top-3 right-3 btn btn-ghost btn-circle btn-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:bg-red-100"
      on:click={handleDelete}
      title="Delete"
    >
      <Trash2 class="w-4 h-4 text-red-500" />
    </button>
    
    <!-- Shiny indicator -->
    <div class="absolute top-3 left-3">
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-md">
        <Sparkles class="w-4 h-4 text-white" />
      </div>
    </div>
    
    <!-- Alpha indicator -->
    {#if shiny.isAlpha}
      <div class="absolute top-3 left-14">
        <div class="px-2 py-1 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF4500] flex items-center justify-center shadow-md">
          <span class="text-white text-xs font-bold">α ALPHA</span>
        </div>
      </div>
    {/if}
    
    <!-- Sprite -->
    <div class="flex justify-center pt-4">
      <img 
        src={shiny.shinySpriteUrl} 
        alt={shiny.pokemonName}
        class="w-24 h-24 object-contain animate-float"
      />
    </div>
  </div>
  
  <div class="card-body p-4">
    <h3 class="font-bold text-lg capitalize text-[#2D1B2E]">{displayName}</h3>
    
    <div class="space-y-2 text-sm">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-[#87CEEB]/20 flex items-center justify-center">
          <Trophy class="w-3 h-3 text-[#5BA8D0]" />
        </div>
        <span class="text-[#4A3A4B]">
          <span class="font-medium">Method:</span> 
          <span class="capitalize">{shiny.method.replace('_', ' ')}</span>
        </span>
      </div>
      
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-[#FFB7C5]/20 flex items-center justify-center">
          <span class="text-xs">👀</span>
        </div>
        <span class="text-[#4A3A4B]">
          <span class="font-medium">Encounters:</span> 
          {shiny.encounters.toLocaleString()}
        </span>
      </div>
      
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-[#98FB98]/20 flex items-center justify-center">
          <span class="text-xs">📅</span>
        </div>
        <span class="text-[#4A3A4B]/70 text-xs">Caught {caughtAt}</span>
      </div>
      
      
      {#if shiny.notes}
        <div class="mt-3 p-2 bg-[#FFF8F0] rounded-lg">
          <p class="text-[#4A3A4B] text-xs italic">"{shiny.notes}"</p>
        </div>
      {/if}
    </div>
  </div>
</div>
