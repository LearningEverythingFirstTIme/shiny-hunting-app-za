<script lang="ts">
  import { page } from '$app/stores';
  
  const navItems = [
    { href: '/pokedex', label: 'Pokedex', icon: '📖' },
    { href: '/hunts', label: 'Hunts', icon: '🎯' },
    { href: '/shinies', label: 'Shinies', icon: '✨' },
    { href: '/tips', label: 'Tips', icon: '💡' },
    { href: '/stats', label: 'Stats', icon: '📊' },
  ];
  
  $: currentPath = $page.url.pathname;
</script>

<nav class="btm-nav btm-nav-sm bg-base-100 border-t lg:hidden">
  {#each navItems as item}
    <a 
      href={item.href}
      class:active={currentPath === item.href || currentPath.startsWith(item.href + '/')}
      class="text-xs"
    >
      <span class="text-xl">{item.icon}</span>
      <span class="btm-nav-label">{item.label}</span>
    </a>
  {/each}
</nav>
