<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import TypeBadge from '../common/TypeBadge.svelte';
  import type { Pokemon } from '$lib/types';
  import { Target } from 'lucide-svelte';
  
  export let pokemon: Pokemon;
  export let showShiny = false;
  export let isHunting = false;
  
  const dispatch = createEventDispatcher();
  
  $: spriteUrl = showShiny ? pokemon.shinySpriteUrl : pokemon.spriteUrl;
  $: displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
</script>

<button 
  class="card bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl border border-[#FFB7C5]/20 p-2 relative group card-hover rounded-2xl overflow-hidden"
  on:click={() => dispatch('select', pokemon)}
�>
  <!-- Active hunt indicator -->
  {#if isHunting}
    <div class="absolute top-2 right-2 z-10">
      <div class="w-3 h-3 bg-gradient-to-r from-[#FFB7C5] to-[#E89AAA] rounded-full animate-pulse-soft"></div>
    </div>
  {/if}
  
  <!-- Shiny indicator -->
  {#if showShiny}
    <div class="absolute top-2 left-2 z-10">
      <div class="text-xs">✨</div>
    </div>
  {/if}
  
  <!-- Sprite container with gradient background -->
  <div class="relative bg-gradient-to-b from-[#FFE4E9]/50 to-[#E0F4FC]/50 rounded-xl p-2 mb-2">
    <img 
      src={spriteUrl} 
      alt={displayName}
      class="w-20 h-20 object-contain mx-auto group-hover:scale-110 transition-transform duration-300"
      loading="lazy"
    />
  </div>
  
  <!-- Info -->
  <div class="card-body p-2 text-center">
    <span class="text-xs text-[#4A3A4B]/60 font-medium">#{String(pokemon.id).padStart(3, '0')}</span>
    
    <h3 class="text-sm font-bold text-[#2D1B2E] truncate">{displayName}</h3>
    
    <div class="flex justify-center gap-1 mt-1 flex-wrap">
      {#each pokemon.types as type}
        <TypeBadge {type} size="sm" />
      {/each}
    </div>
  </div>
</button>
