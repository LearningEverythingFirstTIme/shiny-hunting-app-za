<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md';
  
  $: sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }[size];
  
  $: borderSize = {
    sm: 'border-2',
    md: 'border-3',
    lg: 'border-4'
  }[size];
</script>

<div class="flex justify-center items-center">
  <div class="relative {sizeClass}">
    <div class="absolute inset-0 rounded-full border-t-[#FFB7C5] border-r-[#87CEEB] border-b-[#FFB7C5] border-l-[#87CEEB] {borderSize} animate-spin"></div>
    <div class="absolute inset-2 rounded-full bg-gradient-to-br from-[#FFB7C5]/20 to-[#87CEEB]/20 animate-pulse"></div>
  </div>
</div>
