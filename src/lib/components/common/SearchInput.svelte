<script lang="ts">
  import { Search } from 'lucide-svelte';
  
  export let value = '';
  export let placeholder = 'Search...';
  export let id = 'search';
</script>

<div class="relative">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <Search class="h-5 w-5 text-gray-400" />
  </div>
  <input
    {id}
    type="text"
    {placeholder}
    bind:value
    class="input input-bordered w-full pl-10"
  />
</div>
