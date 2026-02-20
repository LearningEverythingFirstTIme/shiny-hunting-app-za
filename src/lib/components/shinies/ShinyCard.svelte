<script lang="ts">
  import { formatTimeAgo } from '$lib/utils/formatters';
  import { deleteShiny } from '$lib/services/shinyService';
  import type { Shiny } from '$lib/types';
  import { Trash2, Sparkles } from 'lucide-svelte';
  
  export let shiny: Shiny;
  
  async function handleDelete() {
    if (confirm(`Delete ${shiny.pokemonName} from your shinies?`)) {
      await deleteShiny(shiny.id);
    }
  }
  
  $: caughtAt = shiny.caughtAt ? formatTimeAgo(shiny.caughtAt) : 'Unknown';
  $: displayName = shiny.pokemonName.charAt(0).toUpperCase() + shiny.pokemonName.slice(1);
</script>

<div class="card bg-base-100 shadow-md overflow-hidden group">
  <div class="relative bg-gradient-to-b from-base-200 to-base-100 p-4">
    <!-- Delete button -->
    <button 
      class="absolute top-2 right-2 btn btn-ghost btn-circle btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
      on:click={handleDelete}
      title="Delete"
    >
      <Trash2 class="w-4 h-4 text-error" />
    </button>
    
    <!-- Shiny indicator -->
    <div class="absolute top-2 left-2">
      <Sparkles class="w-5 h-5 text-yellow-400" />
    </div>
    
    <!-- Sprite -->
    <div class="flex justify-center">
      <img 
        src={shiny.shinySpriteUrl} 
        alt={shiny.pokemonName}
        class="w-24 h-24 object-contain"
      />
    </div>
  </div>
  
  <div class="card-body p-4">
    <h3 class="font-bold text-lg capitalize">{displayName}</h3>
    
    <div class="space-y-1 text-sm">
      <p class="text-gray-500">
        <span class="font-medium">Method:</span> 
        <span class="capitalize">{shiny.method.replace('_', ' ')}</span>
      </p>
      
      <p class="text-gray-500">
        <span class="font-medium">Encounters:</span> 
        {shiny.encounters.toLocaleString()}
      </p>
      
      <p class="text-gray-400 text-xs">Caught {caughtAt}</p>
      
      
      {#if shiny.notes}
        <p class="text-gray-500 text-xs mt-2 italic">"{shiny.notes}"</p>
      {/if}
    </div>
  </div>
</div>
