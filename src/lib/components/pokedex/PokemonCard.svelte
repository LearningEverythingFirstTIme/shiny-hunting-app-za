<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import TypeBadge from '../common/TypeBadge.svelte';
  import type { Pokemon } from '$lib/types';
  
  export let pokemon: Pokemon;
  export let showShiny = false;
  export let isHunting = false;
  
  const dispatch = createEventDispatcher();
  
  $: spriteUrl = showShiny ? pokemon.shinySpriteUrl : pokemon.spriteUrl;
  $: displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
</script>

<button 
  class="card bg-base-100 shadow-sm hover:shadow-md transition-all p-2 relative group"
  on:click={() => dispatch('select', pokemon)}
>
  <!-- Shiny indicator -->
  {#if isHunting}
    <div class="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" 
         title="Active hunt"></div>
  {/if}
  
  <!-- Sprite -->
  <figure class="px-2 py-1">
    <img 
      src={spriteUrl} 
      alt={displayName}
      class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
      loading="lazy"
    />
  </figure>
  
  <!-- Info -->
  <div class="card-body p-2 text-center">
    <span class="text-xs text-gray-500">#{String(pokemon.id).padStart(3, '0')}</span>
    <h3 class="text-sm font-semibold truncate">{displayName}</h3>
    <div class="flex justify-center gap-1 mt-1 flex-wrap">
      {#each pokemon.types as type}
        <TypeBadge {type} size="sm" />
      {/each}
    </div>
  </div>
</button>
