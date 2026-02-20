<script lang="ts">
  import { page } from '$app/stores';
  import { BookOpen, Target, Sparkles, Lightbulb, BarChart3 } from 'lucide-svelte';
  
  const navItems = [
    { href: '/pokedex', label: 'Pokedex', icon: BookOpen },
    { href: '/hunts', label: 'Hunts', icon: Target },
    { href: '/shinies', label: 'Shinies', icon: Sparkles },
    { href: '/tips', label: 'Tips', icon: Lightbulb },
    { href: '/stats', label: 'Stats', icon: BarChart3 },
  ];
  
  $: currentPath = $page.url.pathname;
</script>

<aside class="hidden lg:flex flex-col w-64 bg-base-100 border-r border-base-200 h-screen sticky top-0">
  <div class="p-4">
    <a href="/" class="btn btn-ghost text-xl font-bold w-full justify-start">
      <span class="text-poke-red">✨</span> Shiny Hunter
    </a>
  </div>
  
  <nav class="flex-1 px-4">
    <ul class="menu menu-lg gap-2">
      {#each navItems as item}
        <li>
          <a 
            href={item.href}
            class:active={currentPath === item.href || currentPath.startsWith(item.href + '/')}
          >
            <svelte:component this={item.icon} class="w-5 h-5" />
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</aside>
