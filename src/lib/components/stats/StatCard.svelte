<script lang="ts">
  export let title: string;
  export let value: string | number;
  export let subtitle = '';
  export let icon: any = null;
  export let color = 'primary';
  
  const colorSchemes: Record<string, { bg: string; text: string; iconBg: string }> = {
    primary: { 
      bg: 'from-[#FFB7C5]/20 to-[#E89AAA]/10', 
      text: 'text-[#2D1B2E]',
      iconBg: 'bg-gradient-to-br from-[#FFB7C5] to-[#E89AAA]'
    },
    secondary: { 
      bg: 'from-[#87CEEB]/20 to-[#5BA8D0]/10', 
      text: 'text-[#2D1B2E]',
      iconBg: 'bg-gradient-to-br from-[#87CEEB] to-[#5BA8D0]'
    },
    info: { 
      bg: 'from-[#4A90E2]/20 to-[#2E6BB5]/10', 
      text: 'text-[#2D1B2E]',
      iconBg: 'bg-gradient-to-br from-[#4A90E2] to-[#2E6BB5]'
    },
    success: { 
      bg: 'from-[#98FB98]/20 to-[#90EE90]/10', 
      text: 'text-[#2D1B2E]',
      iconBg: 'bg-gradient-to-br from-[#98FB98] to-[#90EE90]'
    },
    warning: { 
      bg: 'from-[#FFD700]/20 to-[#FFA500]/10', 
      text: 'text-[#2D1B2E]',
      iconBg: 'bg-gradient-to-br from-[#FFD700] to-[#FFA500]'
    },
  };
  
  $: scheme = colorSchemes[color] || colorSchemes.primary;
</script>

<div class="stat bg-gradient-to-br {scheme.bg} rounded-2xl border border-[#FFB7C5]/20 shadow-sm p-4">
  <div class="flex items-start justify-between">
    <div>
      <div class="stat-title text-[#4A3A4B] text-sm font-medium mb-1">{title}</div>
      <div class="stat-value text-2xl font-bold {scheme.text}">{value}</div>
      
      {#if subtitle}
        <div class="stat-desc text-[#4A3A4B]/70 text-xs mt-1">{subtitle}</div>
      {/if}
    </div>
    
    {#if icon}
      <div class="w-10 h-10 rounded-xl {scheme.iconBg} flex items-center justify-center shadow-md"
      >
        <svelte:component this={icon} class="w-5 h-5 text-white" />
      </div>
    {/if}
  </div>
</div>
