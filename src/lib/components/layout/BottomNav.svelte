<script lang="ts">
  import { page } from '$app/stores';
  import { BookOpen, Target, Sparkles, Lightbulb, BarChart3, Menu, X } from 'lucide-svelte';
  import { slide } from 'svelte/transition';
  
  const navItems = [
    { href: '/pokedex', label: 'Pokedex', icon: BookOpen, color: 'from-[#FFB7C5] to-[#E89AAA]' },
    { href: '/hunts', label: 'Hunts', icon: Target, color: 'from-[#87CEEB] to-[#5BA8D0]' },
    { href: '/shinies', label: 'Shinies', icon: Sparkles, color: 'from-[#FFD700] to-[#FFA500]' },
    { href: '/tips', label: 'Tips', icon: Lightbulb, color: 'from-[#98FB98] to-[#90EE90]' },
    { href: '/stats', label: 'Stats', icon: BarChart3, color: 'from-[#4A90E2] to-[#2E6BB5]' },
  ];
  
  $: currentPath = $page.url.pathname;
  
  let isMenuOpen = false;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<!-- Mobile Navigation Header -->
<nav class="navbar bg-white/80 backdrop-blur-md border-b border-[#FFB7C5]/30 sticky top-0 z-50 lg:hidden">
  <div class="navbar-start">
    <a href="/" class="btn btn-ghost text-lg font-bold text-[#2D1B2E] hover:bg-[#FFB7C5]/10">
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB7C5] to-[#87CEEB] flex items-center justify-center mr-2">
        <Sparkles class="w-4 h-4 text-white" />
      </div>
      Shiny Hunter
    </a>
  </div>
  
  <div class="navbar-end">
    <button 
      class="btn btn-ghost btn-circle hover:bg-[#FFB7C5]/10"
      on:click={toggleMenu}
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
    >
      {#if isMenuOpen}
        <X class="w-6 h-6 text-[#2D1B2E]" />
      {:else}
        <Menu class="w-6 h-6 text-[#2D1B2E]" />
      {/if}
    </button>
  </div>
</nav>

<!-- Mobile Menu Overlay -->
{#if isMenuOpen}
  <div 
    class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
    on:click={closeMenu}
  ></div>
  
  <div 
    class="fixed top-[64px] left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[#FFB7C5]/30 shadow-xl z-50 lg:hidden"
    transition:slide={{ duration: 200 }}
  >
    <nav class="p-4">
      <ul class="space-y-2">
        {#each navItems as item}
          <li>
            <a 
              href={item.href}
              class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all {currentPath === item.href || currentPath.startsWith(item.href + '/') ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-md' : 'text-[#4A3A4B] hover:bg-[#FFB7C5]/10'}"
              on:click={closeMenu}
            >
              <div class="w-8 h-8 rounded-lg {currentPath === item.href || currentPath.startsWith(item.href + '/') ? 'bg-white/20' : 'bg-[#FFB7C5]/10'} flex items-center justify-center">
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
  </div>
{/if}
