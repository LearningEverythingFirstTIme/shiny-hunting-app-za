<script lang="ts">
  import { formatTimeAgo, formatHuntDuration } from '$lib/utils/formatters';
  import { incrementHunt, completeHunt, deleteHunt } from '$lib/services/huntService';
  import type { Hunt } from '$lib/types';
  import { Plus, Trash2, Check, RotateCcw, Target } from 'lucide-svelte';
  
  export let hunt: Hunt;
  
  let updating = false;
  
  async function handleIncrement() {
    updating = true;
    await incrementHunt(hunt.id, 1);
    updating = false;
  }
  
  async function handleIncrement10() {
    updating = true;
    await incrementHunt(hunt.id, 10);
    updating = false;
  }
  
  async function handleComplete() {
    if (confirm(`Mark ${hunt.pokemonName} as caught?`)) {
      await completeHunt(hunt.id, hunt.encounters);
    }
  }
  
  async function handleDelete() {
    if (confirm(`Delete hunt for ${hunt.pokemonName}?`)) {
      await deleteHunt(hunt.id);
    }
  }
  
  $: timeAgo = hunt.lastUpdated ? formatTimeAgo(hunt.lastUpdated) : 'Unknown';
  $: duration = formatHuntDuration(hunt.durationMinutes || 0);
  $: displayName = hunt.pokemonName.charAt(0).toUpperCase() + hunt.pokemonName.slice(1);
</script>

<div class="card bg-white/80 backdrop-blur-sm shadow-lg border border-[#87CEEB]/30 rounded-2xl overflow-hidden card-hover">
  <div class="h-1 bg-gradient-to-r from-[#87CEEB] to-[#5BA8D0]"></div>
  
  <div class="p-4">
    <div class="flex items-center gap-4">
      <!-- Sprite with gradient background -->
      <div class="w-16 h-16 rounded-xl bg-gradient-to-b from-[#E0F4FC] to-[#B0E0F0] flex items-center justify-center flex-shrink-0">
        <img 
          src={hunt.shinySpriteUrl} 
          alt={hunt.pokemonName}
          class="w-14 h-14 object-contain"
        />
      </div>
      
      <!-- Info -->
      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-[#2D1B2E] truncate capitalize">{displayName}</h3>
        
        <div class="flex items-center gap-1 text-sm text-[#4A3A4B]">
          <Target class="w-3 h-3" />
          <span class="capitalize">{hunt.method.replace('_', ' ')}</span>
        </div>
        
        <p class="text-xs text-[#4A3A4B]/60">Updated {timeAgo}</p>
        
        {#if hunt.durationMinutes > 0}
          <p class="text-xs text-[#4A3A4B]/60">Duration: {duration}</p>
        {/if}
      </div>
      
      <!-- Encounters -->
      <div class="text-center bg-gradient-to-b from-[#FFE4E9]/50 to-[#FFB7C5]/30 rounded-xl px-4 py-2">
        <div class="text-2xl font-bold text-[#2D1B2E] tabular-nums">{hunt.encounters.toLocaleString()}</div>
        <div class="text-xs text-[#4A3A4B]">encounters</div>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="flex gap-2 mt-4">
      <button 
        class="btn btn-sm flex-1 bg-gradient-to-r from-[#FFB7C5] to-[#E89AAA] text-white border-0 hover:shadow-md hover:brightness-105 transition-all"
        on:click={handleIncrement}
        disabled={updating}
      >
        {#if updating}
          <span class="loading loading-spinner loading-xs"></span>
        {:else}
          <Plus class="w-4 h-4 mr-1" /> +1
        {/if}
      </button>
      
      <button 
        class="btn btn-sm bg-[#F5EDE3] text-[#2D1B2E] border-0 hover:bg-[#E8DFD5] transition-all"
        on:click={handleIncrement10}
        disabled={updating}
      >
        +10
      </button>
      
      <button 
        class="btn btn-sm bg-gradient-to-r from-[#87CEEB] to-[#5BA8D0] text-white border-0 hover:shadow-md hover:brightness-105 transition-all"
        on:click={handleComplete}
        title="Mark as caught"
      >
        <Check class="w-4 h-4" />
      </button>
      
      <button 
        class="btn btn-sm bg-red-100 text-red-600 border-0 hover:bg-red-200 transition-all"
        on:click={handleDelete}
        title="Delete hunt"
      >
        <Trash2 class="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
