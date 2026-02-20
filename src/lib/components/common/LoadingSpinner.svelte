<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md';
  
  $: sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }[size];
</script>

<div class="flex justify-center items-center">
  <span class="loading loading-spinner {sizeClass}"></span>
</div>
