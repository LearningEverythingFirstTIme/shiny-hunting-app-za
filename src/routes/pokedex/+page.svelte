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
  import { celebrateShiny } from '$lib/utils/celebration';
  import { user } from '$lib/stores/auth';
  import { Sparkles, BookOpen, Target } from 'lucide-svelte';
  
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
    console.log('Pokedex onMount');
    
    try {
      console.log('Loading Z-A Pokemon...');
      pokemon = await getZAPokemon();
      console.log('Loaded', pokemon.length, 'Pokemon');
    } catch (error) {
      console.error('Failed to load Pokemon:', error);
    } finally {
      loading = false;
      console.log('Loading complete');
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
    console.log('handleRecordShiny called with:', event.detail);
    if (!$user) {
      console.error('No user logged in');
      return;
    }
    
    const { error } = await recordShiny(
      $user.uid,
      event.detail.pokemonId,
      event.detail.pokemonName,
      event.detail.shinySpriteUrl,
      event.detail.method,
      event.detail.encounters,
      event.detail.notes,
      event.detail.isAlpha
    );
    
    if (error) {
      console.error('Failed to record shiny:', error);
      alert('Failed to record shiny: ' + error);
    } else {
      console.log('Shiny recorded successfully');
      celebrateShiny(event.detail.encounters, 0);
      selectedPokemon = null;
    }
  }
</script>

<AuthGuard>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB7C5] to-[#87CEEB] flex items-center justify-center shadow-lg">
          <BookOpen class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#2D1B2E]">Pokedex</h1>
          <p class="text-[#4A3A4B]">{filteredPokemon.length} Pokemon in Z-A</p>
        </div>
      </div>
      
      <div class="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
        <span class="text-sm text-[#4A3A4B]">Show Shiny</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            class="sr-only peer"
            bind:checked={showShiny}
          />
          <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#FFB7C5] peer-checked:to-[#87CEEB]"></div>
        </label>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm mb-6">
      <div class="space-y-4">
        <SearchInput 
          bind:value={searchQuery}
          placeholder="Search by name or number..."
        />
        
        <TypeFilter bind:selectedTypes />
      </div>
    </div>
    
    <!-- Pokemon Grid -->
    {#if loading}
      <div class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
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
          <div class="text-6xl mb-4">🔍</div>
          <p class="text-[#4A3A4B] text-lg">No Pokemon found matching your search</p>
          <p class="text-[#4A3A4B]/60 text-sm mt-2">Try adjusting your filters</p>
        </div>
      {/if}
    {/if}
  </div>
  
  <!-- Action buttons for selected Pokemon -->
  {#if selectedPokemon}
    <div class="fixed bottom-24 left-4 right-4 lg:bottom-8 lg:left-80 lg:right-8 z-40 animate-slide-up">
      <div class="card bg-white/90 backdrop-blur-md shadow-2xl border border-[#FFB7C5]/30 rounded-2xl overflow-hidden">
        <div class="h-1 bg-gradient-to-r from-[#FFB7C5] via-[#87CEEB] to-[#FFB7C5]"></div>
        
        <div class="card-body p-4">
          <div class="flex items-center gap-4">
            <div class="relative">
              <img 
                src={selectedPokemon.shinySpriteUrl} 
                alt={selectedPokemon.name}
                class="w-16 h-16 object-contain animate-float"
              />
              <div class="absolute -top-1 -right-1">
                <Sparkles class="w-5 h-5 text-[#FFD700] animate-sparkle" />
              </div>
            </div>
            
            <div class="flex-1">
              <h3 class="font-bold text-lg capitalize text-[#2D1B2E]">{selectedPokemon.name}</h3>
              <p class="text-sm text-[#4A3A4B]">What would you like to do?</p>
            </div>
            
            <button 
              class="btn btn-ghost btn-circle btn-sm hover:bg-[#FFB7C5]/20"
              on:click={() => selectedPokemon = null}
            >
              ✕
            </button>
          </div>
          
          <div class="flex gap-2 mt-4">
            <button 
              class="btn flex-1 bg-gradient-to-r from-[#FFB7C5] to-[#E89AAA] text-white border-0 hover:shadow-lg hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              on:click={() => {
                showStartHuntModal = true;
              }}
              disabled={huntingPokemonIds.includes(selectedPokemon.id)}
            >
              <Target class="w-4 h-4 mr-1" />
              {huntingPokemonIds.includes(selectedPokemon.id) ? 'Already Hunting' : 'Start Hunt'}
            </button>
            
            <button 
              class="btn flex-1 bg-gradient-to-r from-[#87CEEB] to-[#5BA8D0] text-white border-0 hover:shadow-lg hover:brightness-105 transition-all"
              on:click={() => {
                showRecordShinyModal = true;
              }}
            >
              <Sparkles class="w-4 h-4 mr-1" />
              Record Shiny
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
