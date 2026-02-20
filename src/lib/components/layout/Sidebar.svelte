<script lang="ts">
  import { page } from '$app/stores';
  import { BookOpen, Target, Sparkles, Lightbulb, BarChart3 } from 'lucide-svelte';
  
  const navItems = [
    { href: '/pokedex', label: 'Pokedex', icon: BookOpen, color: '#FFB7C5', bgColor: 'bg-[#FFB7C5]/10', activeBg: 'bg-gradient-to-r from-[#FFB7C5] to-[#E89AAA]' },
    { href: '/hunts', label: 'Hunts', icon: Target, color: '#87CEEB', bgColor: 'bg-[#87CEEB]/10', activeBg: 'bg-gradient-to-r from-[#87CEEB] to-[#5BA8D0]' },
    { href: '/shinies', label: 'Shinies', icon: Sparkles, color: '#FFD700', bgColor: 'bg-[#FFD700]/10', activeBg: 'bg-gradient-to-r from-[#FFD700] to-[#FFA500]' },
    { href: '/tips', label: 'Tips', icon: Lightbulb, color: '#98FB98', bgColor: 'bg-[#98FB98]/10', activeBg: 'bg-gradient-to-r from-[#98FB98] to-[#90EE90]' },
    { href: '/stats', label: 'Stats', icon: BarChart3, color: '#4A90E2', bgColor: 'bg-[#4A90E2]/10', activeBg: 'bg-gradient-to-r from-[#4A90E2] to-[#2E6BB5]' },
  ];
  
  $: currentPath = $page.url.pathname;
</script>

<aside class="hidden lg:flex flex-col w-72 bg-white/80 backdrop-blur-md border-r border-[#FFB7C5]/30 h-screen sticky top-0">
  <div class="p-6">
    <a href="/" class="flex items-center gap-3 text-[#2D1B2E] hover:opacity-80 transition-opacity">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFB7C5] to-[#87CEEB] flex items-center justify-center shadow-md">
        <Sparkles class="w-5 h-5 text-white" />
      </div>
      <span class="text-xl font-bold">Shiny Hunter</span>
    </a>
  </div>
  
  <nav class="flex-1 px-4">
    <ul class="space-y-2">
      {#each navItems as item}
        <li>
          <a 
            href={item.href}
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all {currentPath === item.href || currentPath.startsWith(item.href + '/') ? item.activeBg + ' text-white shadow-md' : 'text-[#4A3A4B] hover:' + item.bgColor}"
          >
            <div class="w-8 h-8 rounded-lg {currentPath === item.href || currentPath.startsWith(item.href + '/') ? 'bg-white/20' : item.bgColor} flex items-center justify-center"
            style={currentPath !== item.href && !currentPath.startsWith(item.href + '/') ? `color: ${item.color}` : ''}
            >
              <svelte:component this={item.icon} class="w-4 h-4" />
            </div>
            <span class="font-semibold">{item.label}</span>
            
            {#if currentPath === item.href || currentPath.startsWith(item.href + '/')}
              <div class="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
            {/if}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
  
  <!-- Decorative footer -->
  <div class="p-6">
    <div class="bg-gradient-to-br from-[#FFE4E9] to-[#E0F4FC] rounded-2xl p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">✨</span>
        <span class="text-sm font-bold text-[#2D1B2E]">Happy Hunting!</span>
      </div>
      <p class="text-xs text-[#4A3A4B]">May your hunts be blessed with sparkles!</p>
    </div>
  </div>
</aside>
