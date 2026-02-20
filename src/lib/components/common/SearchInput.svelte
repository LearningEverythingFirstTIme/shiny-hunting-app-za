<script lang="ts">
  import { Search } from 'lucide-svelte';
  
  export let value = '';
  export let placeholder = 'Search...';
  export let id = 'search';
</script>

<div class="relative">
  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
    <Search class="h-5 w-5 text-[#FFB7C5]" />
  </div>
  
  <input
    {id}
    type="text"
    {placeholder}
    bind:value
    class="input w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-[#FFB7C5]/30 rounded-xl text-[#2D1B2E] placeholder-[#4A3A4B]/40 focus:border-[#FFB7C5] focus:ring-4 focus:ring-[#FFB7C5]/20 transition-all"
  />
</div>
