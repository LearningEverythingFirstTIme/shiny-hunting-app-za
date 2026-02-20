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
  <span class="text-sm font-medium">Filter by type:</span>
  
  {#each POKEMON_TYPES as type}
    <button
      class="px-2 py-1 rounded text-xs font-medium capitalize transition-all {selectedTypes.includes(type) ? TYPE_COLORS[type] + ' text-white' : 'bg-base-200 text-base-content hover:bg-base-300'}"
      on:click={() => toggleType(type)}
    >
      {type}
    </button>
  {/each}
  
  {#if selectedTypes.length > 0}
    <button
      class="btn btn-ghost btn-xs"
      on:click={clearTypes}
    >
      Clear
    </button>
  {/if}
</div>
