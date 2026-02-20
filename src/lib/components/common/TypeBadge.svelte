<script lang="ts">
  import { TYPE_COLORS } from '$lib/utils/formatters';
  
  export let type: string;
  export let size: 'sm' | 'md' = 'md';
  
  $: colorClass = TYPE_COLORS[type] || 'bg-gray-400';
  $: sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';
</script>

<span class="{colorClass} {sizeClass} rounded text-white font-medium capitalize">
  {type}
</span>
