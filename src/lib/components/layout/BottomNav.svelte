<script lang="ts">
  import { page } from '$app/stores';
  import { BookOpen, Target, Sparkles, Lightbulb, BarChart3 } from 'lucide-svelte';
  
  const navItems = [
    { href: '/pokedex', label: 'Pokedex', icon: BookOpen, color: 'from-[#FFB7C5] to-[#E89AAA]' },
    { href: '/hunts', label: 'Hunts', icon: Target, color: 'from-[#87CEEB] to-[#5BA8D0]' },
    { href: '/shinies', label: 'Shinies', icon: Sparkles, color: 'from-[#FFD700] to-[#FFA500]' },
    { href: '/tips', label: 'Tips', icon: Lightbulb, color: 'from-[#98FB98] to-[#90EE90]' },
    { href: '/stats', label: 'Stats', icon: BarChart3, color: 'from-[#4A90E2] to-[#2E6BB5]' },
  ];
  
  $: currentPath = $page.url.pathname;
</script>

<nav class="btm-nav btm-nav-sm bg-white/90 backdrop-blur-md border-t border-[#FFB7C5]/30 lg:hidden h-16">
  {#each navItems as item}
    <a 
      href={item.href}
      class="flex flex-col items-center justify-center py-2 transition-all {currentPath === item.href || currentPath.startsWith(item.href + '/') ? 'text-[#2D1B2E]' : 'text-[#4A3A4B]/60'}"
    >
      <div class="relative">
        <svelte:component 
          this={item.icon} 
          class="w-5 h-5 transition-all {currentPath === item.href || currentPath.startsWith(item.href + '/') ? 'scale-110' : ''}"
          style="color: {currentPath === item.href || currentPath.startsWith(item.href + '/') ? '' : 'inherit'}"
        />
        
        {#if currentPath === item.href || currentPath.startsWith(item.href + '/')}
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r {item.color}"></div>
        {/if}
      </div>
      
      <span class="text-[10px] mt-1 font-medium">{item.label}</span>
    </a>
  {/each}
</nav>
