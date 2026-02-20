<script lang="ts">
  import { formatTimeAgo, formatHuntDuration } from '$lib/utils/formatters';
  import { incrementHunt, completeHunt, deleteHunt } from '$lib/services/huntService';
  import type { Hunt } from '$lib/types';
  import { Plus, Trash2, Check, RotateCcw } from 'lucide-svelte';
  
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

<div class="card bg-base-100 shadow-md p-4">
  <div class="flex items-center gap-4">
    <!-- Sprite -->
    <img 
      src={hunt.shinySpriteUrl} 
      alt={hunt.pokemonName}
      class="w-16 h-16 object-contain"
    />
    
    <!-- Info -->
    <div class="flex-1 min-w-0">
      <h3 class="font-bold truncate capitalize">{displayName}</h3>
      <p class="text-sm text-gray-500 capitalize">{hunt.method.replace('_', ' ')}</p>
      <p class="text-xs text-gray-400">Updated {timeAgo}</p>
      {#if hunt.durationMinutes > 0}
        <p class="text-xs text-gray-400">Duration: {duration}</p>
      {/if}
    </div>
    
    <!-- Encounters -->
    <div class="text-center">
      <div class="text-2xl font-bold tabular-nums">{hunt.encounters.toLocaleString()}</div>
      <div class="text-xs text-gray-500">encounters</div>
    </div>
  </div>
  
  <!-- Actions -->
  <div class="flex gap-2 mt-4">
    <button 
      class="btn btn-primary btn-sm flex-1"
      on:click={handleIncrement}
      disabled={updating}
    >
      {#if updating}
        <span class="loading loading-spinner loading-xs"></span>
      {:else}
        <Plus class="w-4 h-4" /> +1
      {/if}
    </button>
    
    <button 
      class="btn btn-outline btn-sm"
      on:click={handleIncrement10}
      disabled={updating}
    >
      +10
    </button>
    
    <button 
      class="btn btn-success btn-sm"
      on:click={handleComplete}
      title="Mark as caught"
    >
      <Check class="w-4 h-4" />
    </button>
    
    <button 
      class="btn btn-ghost btn-sm text-error"
      on:click={handleDelete}
      title="Delete hunt"
    >
      <Trash2 class="w-4 h-4" />
    </button>
  </div>
</div>
