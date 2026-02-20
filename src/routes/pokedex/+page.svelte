<script lang="ts">
  import { onMount } from 'svelte';
  import { getZAPokemon, searchPokemon, filterByType } from '$lib/services/pokemonService';
  import { activeHunts } from '$lib/services/huntService';
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import type { Pokemon } from '$lib/types';
  
  import AuthGuard from '$lib/components/layout/AuthGuard.svelte';
  import PokemonCard from '$lib/components/pokedex/PokemonCard.svelte';
  import TypeFilter from '$lib/components/pokedex/TypeFilter.svelte';
  import SearchInput from '$lib/components/common/SearchInput.svelte';
  import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
  import StartHuntModal from '$lib/components/hunts/StartHuntModal.svelte';
  import RecordShinyModal from '$lib/components/shinies/RecordShinyModal.svelte';
  import { startHunt } from '$lib/services/huntService';
  import { recordShiny } from '$lib/services/shinyService';
  import { user } from '$lib/stores/auth';
  
  let pokemon: Pokemon[] = [];
  let loading = true;
  let searchQuery = '';
  let selectedTypes: string[] = [];
  let showShiny = false;
  let selectedPokemon: Pokemon | null = null;
  let showStartHuntModal = false;
  let showRecordShinyModal = false;
  
  $: filteredPokemon = filterByType(
    searchPokemon(pokemon, searchQuery),
    selectedTypes
  );
  
  $: huntingPokemonIds = $activeHunts.map(h => h.pokemonId);
  
  onMount(async () => {
    if (!$isAuthenticated) return;
    
    try {
      pokemon = await getZAPokemon();
    } catch (error) {
      console.error('Failed to load Pokemon:', error);
    } finally {
      loading = false;
    }
  });
  
  function handlePokemonSelect(event: CustomEvent<Pokemon>) {
    selectedPokemon = event.detail;
  }
  
  async function handleStartHunt(event: CustomEvent) {
    if (!$user) return;
    
    const { error } = await startHunt(
      $user.uid,
      event.detail.pokemonId,
      event.detail.pokemonName,
      event.detail.spriteUrl,
      event.detail.shinySpriteUrl,
      event.detail.method,
      event.detail.notes
    );
    
    if (error) {
      alert('Failed to start hunt: ' + error);
    }
  }
  
  async function handleRecordShiny(event: CustomEvent) {
    if (!$user) return;
    
    const { error } = await recordShiny(
      $user.uid,
      event.detail.pokemonId,
      event.detail.pokemonName,
      event.detail.shinySpriteUrl,
      event.detail.method,
      event.detail.encounters,
      event.detail.notes
    );
    
    if (error) {
      alert('Failed to record shiny: ' + error);
    }
  }
</script>

<AuthGuard>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold">Pokedex</h1>
        <p class="text-gray-500">{filteredPokemon.length} Pokemon in Z-A</p>
      </div>
      
      <div class="flex items-center gap-2">
        <label class="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            class="toggle toggle-primary" 
            bind:checked={showShiny}
          />
          <span class="text-sm">Show Shiny</span>
        </label>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="space-y-4 mb-6">
      <SearchInput 
        bind:value={searchQuery}
        placeholder="Search by name or number..."
      />
      
      <TypeFilter bind:selectedTypes />
    </div>
    
    <!-- Pokemon Grid -->
    {#if loading}
      <div class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
        {#each filteredPokemon as p}
          <PokemonCard 
            pokemon={p} 
            {showShiny}
            isHunting={huntingPokemonIds.includes(p.id)}
            on:select={handlePokemonSelect}
          />
        {/each}
      </div>
      
      
      {#if filteredPokemon.length === 0}
        <div class="text-center py-12">
          <p class="text-gray-500">No Pokemon found matching your search</p>
        </div>
      {/if}
    {/if}
  </div>
  
  <!-- Action buttons for selected Pokemon -->
  {#if selectedPokemon}
    <div class="fixed bottom-24 left-4 right-4 lg:bottom-8 lg:left-80 lg:right-8 z-40">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <div class="flex items-center gap-4">
            <img 
              src={selectedPokemon.shinySpriteUrl} 
              alt={selectedPokemon.name}
              class="w-16 h-16 object-contain"
            />
            
            <div class="flex-1">
              <h3 class="font-bold capitalize">{selectedPokemon.name}</h3>
              <p class="text-sm text-gray-500">What would you like to do?</p>
            </div>
            
            <button 
              class="btn btn-ghost btn-sm"
              on:click={() => selectedPokemon = null}
            >
              ✕
            </button>
          </div>
          
          <div class="flex gap-2 mt-4">
            <button 
              class="btn btn-primary flex-1"
              on:click={() => {
                showStartHuntModal = true;
              }}
              disabled={huntingPokemonIds.includes(selectedPokemon.id)}
            >
              {huntingPokemonIds.includes(selectedPokemon.id) ? 'Already Hunting' : '🎯 Start Hunt'}
            </button>
            
            <button 
              class="btn btn-success flex-1"
              on:click={() => {
                showRecordShinyModal = true;
              }}
            >
              ✨ Record Shiny
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Modals -->
  <StartHuntModal
    bind:isOpen={showStartHuntModal}
    pokemon={selectedPokemon}
    on:close={() => showStartHuntModal = false}
    on:start={handleStartHunt}
  />
  
  <RecordShinyModal
    bind:isOpen={showRecordShinyModal}
    pokemon={selectedPokemon}
    on:close={() => showRecordShinyModal = false}
    on:record={handleRecordShiny}
  />
</AuthGuard>
