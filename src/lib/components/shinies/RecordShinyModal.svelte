<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { HUNT_METHODS } from '$lib/utils/formatters';
  import type { Pokemon } from '$lib/types';
  import { X } from 'lucide-svelte';
  
  export let isOpen = false;
  export let pokemon: Pokemon | null = null;
  
  const dispatch = createEventDispatcher();
  
  let selectedMethod = 'respawn';
  let encounters = 0;
  let notes = '';
  
  function close() {
    isOpen = false;
    selectedMethod = 'respawn';
    encounters = 0;
    notes = '';
    dispatch('close');
  }
  
  function handleSubmit() {
    if (!pokemon) return;
    
    dispatch('record', {
      pokemonId: pokemon.id,
      pokemonName: pokemon.name,
      shinySpriteUrl: pokemon.shinySpriteUrl,
      method: selectedMethod,
      encounters,
      notes
    });
    
    close();
  }
  
  $: displayName = pokemon ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) : '';
</script>

{#if isOpen && pokemon}
  <div class="modal modal-open">
    <div class="modal-box relative max-w-md">
      <button 
        class="btn btn-sm btn-circle absolute right-2 top-2"
        on:click={close}
      >
        <X class="w-4 h-4" />
      </button>
      
      <h3 class="font-bold text-lg mb-4">Record Shiny</h3>
      
      <div class="flex items-center gap-4 mb-6">
        <img 
          src={pokemon.shinySpriteUrl} 
          alt={pokemon.name}
          class="w-20 h-20 object-contain"
        />
        
        <div>
          <p class="text-sm text-gray-500">#{String(pokemon.id).padStart(3, '0')}</p>
          <h4 class="text-xl font-bold capitalize">{displayName}</h4>
        </div>
      </div>
      
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-control mb-4">
          <label class="label" for="method">
            <span class="label-text">Hunting Method</span>
          </label>
          
          <select 
            id="method"
            bind:value={selectedMethod}
            class="select select-bordered w-full"
          >
            {#each HUNT_METHODS as method}
              <option value={method.value}>{method.label}</option>
            {/each}
          </select>
        </div>
        
        <div class="form-control mb-4">
          <label class="label" for="encounters">
            <span class="label-text">Encounters</span>
          </label>
          
          <input 
            id="encounters"
            type="number"
            bind:value={encounters}
            class="input input-bordered"
            placeholder="Number of encounters"
            min="0"
          />
        </div>
        
        <div class="form-control mb-6">
          <label class="label" for="notes">
            <span class="label-text">Notes (optional)</span>
          </label>
          
          <textarea 
            id="notes"
            bind:value={notes}
            class="textarea textarea-bordered"
            placeholder="Any notes about this shiny..."
            rows="3"
          ></textarea>
        </div>
        
        <div class="flex gap-2">
          <button type="button" class="btn flex-1" on:click={close}>Cancel</button>
          <button type="submit" class="btn btn-success flex-1">Record Shiny</button>
        </div>
      </form>
    </div>
    
    <button class="modal-backdrop" on:click={close} aria-label="Close modal"></button>
  </div>
{/if}
