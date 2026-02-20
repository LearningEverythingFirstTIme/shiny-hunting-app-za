<script lang="ts">
  import { POKEMON_TYPES, TYPE_COLORS } from '$lib/utils/formatters';
  
  export let selectedTypes: string[] = [];
  
  function toggleType(type: string) {
    if (selectedTypes.includes(type)) {
      selectedTypes = selectedTypes.filter(t => t !== type);
    } else {
      selectedTypes = [...selectedTypes, type];
    }
  }
  
  function clearTypes() {
    selectedTypes = [];
  }
</script>

<div class="flex flex-wrap gap-2 items-center">
  <span class="text-sm font-medium text-[#4A3A4B]">Filter by type:</span>
  
  {#each POKEMON_TYPES as type}
    <button
      class="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all transform hover:scale-105 {selectedTypes.includes(type) ? TYPE_COLORS[type] + ' text-white shadow-md' : 'bg-[#F5EDE3] text-[#4A3A4B] hover:bg-[#E8DFD5]'}"
      on:click={() => toggleType(type)}
    >
      {type}
    </button>
  {/each}
  
  {#if selectedTypes.length > 0}
    <button
      class="btn btn-ghost btn-xs text-[#E89AAA] hover:text-[#FFB7C5] hover:bg-[#FFB7C5]/10"
      on:click={clearTypes}
    >
      Clear
    </button>
  {/if}
</div>
