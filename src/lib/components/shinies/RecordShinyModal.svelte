<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { HUNT_METHODS } from '$lib/utils/formatters';
  import type { Pokemon } from '$lib/types';
  import { X, Sparkles } from 'lucide-svelte';
  
  export let isOpen = false;
  export let pokemon: Pokemon | null = null;
  
  const dispatch = createEventDispatcher();
  
  let selectedMethod = 'respawn';
  let encounters = 0;
  let notes = '';
  let isAlpha = false;
  
  function close() {
    isOpen = false;
    selectedMethod = 'respawn';
    encounters = 0;
    notes = '';
    isAlpha = false;
    dispatch('close');
  }
  
  function handleSubmit() {
    console.log('handleSubmit called, pokemon:', pokemon);
    if (!pokemon) {
      console.error('No pokemon selected');
      return;
    }
    
    const eventData = {
      pokemonId: pokemon.id,
      pokemonName: pokemon.name,
      shinySpriteUrl: pokemon.shinySpriteUrl,
      method: selectedMethod,
      encounters,
      notes,
      isAlpha
    };
    console.log('Dispatching record event:', eventData);
    
    dispatch('record', eventData);
    close();
  }
  
  $: displayName = pokemon ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) : '';
</script>

{#if isOpen && pokemon}
  <div class="modal modal-open">
    <div class="modal-box relative max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#FFD700]/30">
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-t-2xl"></div>
      
      <button 
        class="btn btn-sm btn-circle absolute right-3 top-3 bg-[#FFFACD] hover:bg-[#FFE4B5] border-0"
        on:click={close}
      >
        <X class="w-4 h-4 text-[#4A3A4B]" />
      </button>
      
      <h3 class="font-bold text-xl mb-4 text-[#2D1B2E] flex items-center gap-2">
        <Sparkles class="w-6 h-6 text-[#FFA500]" />
        Record Shiny
      </h3>
      
      <div class="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-[#FFFACD]/50 to-[#FFE4B5]/50 rounded-xl">
        <div class="w-20 h-20 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
          <img 
            src={pokemon.shinySpriteUrl} 
            alt={pokemon.name}
            class="w-16 h-16 object-contain animate-float"
          />
        </div>
        
        <div>
          <p class="text-sm text-[#4A3A4B]">#{String(pokemon.id).padStart(3, '0')}</p>
          <h4 class="text-xl font-bold capitalize text-[#2D1B2E]">{displayName}</h4>
        </div>
      </div>
      
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-control mb-4">
          <label class="label" for="method">
            <span class="label-text text-[#2D1B2E] font-medium">Hunting Method</span>
          </label>
          
          <select 
            id="method"
            bind:value={selectedMethod}
            class="select select-bordered w-full bg-white/70 border-[#FFD700]/30 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30 rounded-xl"
          >
            {#each HUNT_METHODS as method}
              <option value={method.value}>{method.label}</option>
            {/each}
          </select>
        </div>
        
        <div class="form-control mb-4">
          <label class="label" for="encounters">
            <span class="label-text text-[#2D1B2E] font-medium">Encounters</span>
          </label>
          
          <input 
            id="encounters"
            type="number"
            bind:value={encounters}
            class="input input-bordered bg-white/70 border-[#FFD700]/30 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30 rounded-xl"
            placeholder="Number of encounters"
            min="0"
          />
        </div>
        
        <div class="form-control mb-4">
          <label class="label cursor-pointer justify-start gap-3" for="isAlpha">
            <input 
              id="isAlpha"
              type="checkbox"
              bind:checked={isAlpha}
              class="checkbox checkbox-warning border-[#FFD700]/50 checked:border-[#FF6B35] checked:bg-[#FF6B35]"
            />
            <span class="label-text text-[#2D1B2E] font-medium flex items-center gap-2">
              <span class="px-2 py-0.5 bg-gradient-to-r from-[#FF6B35] to-[#FF4500] text-white text-xs font-bold rounded">α</span>
              Alpha Pokemon
            </span>
          </label>
          <p class="text-xs text-[#4A3A4B]/60 ml-8">Stronger variant from Pokemon Legends Z-A</p>
        </div>
        
        <div class="form-control mb-6">
          <label class="label" for="notes">
            <span class="label-text text-[#2D1B2E] font-medium">Notes (optional)</span>
          </label>
          
          <textarea 
            id="notes"
            bind:value={notes}
            class="textarea textarea-bordered bg-white/70 border-[#FFD700]/30 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30 rounded-xl"
            placeholder="Any notes about this shiny..."
            rows="3"
          ></textarea>
        </div>
        
        <div class="flex gap-3">
          <button type="button" class="btn flex-1 bg-[#F5EDE3] text-[#4A3A4B] border-0 hover:bg-[#E8DFD5] rounded-xl" on:click={close}>Cancel</button>
          
          <button type="submit" class="btn flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white border-0 hover:shadow-lg hover:brightness-105 transition-all rounded-xl">
            <Sparkles class="w-4 h-4 mr-2" />
            Record Shiny
          </button>
        </div>
      </form>
    </div>
    
    <button class="modal-backdrop bg-[#2D1B2E]/30" on:click={close} aria-label="Close modal"></button>
  </div>
{/if}
