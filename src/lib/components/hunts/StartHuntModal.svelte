<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { HUNT_METHODS } from '$lib/utils/formatters';
  import type { Pokemon } from '$lib/types';
  import { X } from 'lucide-svelte';
  
  export let isOpen = false;
  export let pokemon: Pokemon | null = null;
  
  const dispatch = createEventDispatcher();
  
  let selectedMethod = 'respawn';
  let notes = '';
  
  function close() {
    isOpen = false;
    selectedMethod = 'respawn';
    notes = '';
    dispatch('close');
  }
  
  function handleSubmit() {
    if (!pokemon) return;
    
    dispatch('start', {
      pokemonId: pokemon.id,
      pokemonName: pokemon.name,
      spriteUrl: pokemon.spriteUrl,
      shinySpriteUrl: pokemon.shinySpriteUrl,
      method: selectedMethod,
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
      
      <h3 class="font-bold text-lg mb-4">Start New Hunt</h3>
      
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
          
          <p class="text-xs text-gray-500 mt-1">
            {HUNT_METHODS.find(m => m.value === selectedMethod)?.description}
          </p>
        </div>
        
        <div class="form-control mb-6">
          <label class="label" for="notes">
            <span class="label-text">Notes (optional)</span>
          </label>
          
          <textarea 
            id="notes"
            bind:value={notes}
            class="textarea textarea-bordered"
            placeholder="Any notes about this hunt..."
            rows="3"
          ></textarea>
        </div>
        
        <div class="flex gap-2">
          <button type="button" class="btn flex-1" on:click={close}>Cancel</button>
          <button type="submit" class="btn btn-primary flex-1">Start Hunt</button>
        </div>
      </form>
    </div>
    
    <button class="modal-backdrop" on:click={close} aria-label="Close modal"></button>
  </div>
{/if}
