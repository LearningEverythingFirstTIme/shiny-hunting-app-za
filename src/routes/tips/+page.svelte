<script lang="ts">
  import AuthGuard from '$lib/components/layout/AuthGuard.svelte';
  import { Lightbulb, Sparkles, RotateCcw, Zap, DoorOpen, Target, TrendingUp, Shield } from 'lucide-svelte';
  
  const huntTips = [
    {
      category: 'odds',
      title: 'Base Shiny Odds',
      content: 'In Pokemon Legends: Z-A, the base shiny odds are 1/4096. These can be improved through various methods like the Shiny Charm, mass outbreaks, and specific hunting techniques.',
      icon: '🎲'
    },
    {
      category: 'method',
      title: 'Respawn Method',
      content: 'Defeat or catch the target Pokemon, leave the area, and return. The Pokemon will respawn with a new chance to be shiny. This is the most reliable method for most Pokemon.',
      icon: '🔄'
    },
    {
      category: 'method',
      title: 'Fast Travel Method',
      content: 'Use fast travel points to quickly reset spawns. Best used when the target spawns near a travel point. This is faster than the respawn method for certain locations.',
      icon: '🚀'
    },
    {
      category: 'method',
      title: 'Door Method',
      content: 'Enter and exit buildings to reset spawns. Useful in urban areas like Lumiose City where buildings are plentiful and fast travel points may be limited.',
      icon: '🚪'
    },
    {
      category: 'method',
      title: 'Mass Outbreaks',
      content: 'During mass outbreaks, multiple Pokemon of the same species spawn in one area. These often have improved shiny odds and allow you to check many Pokemon quickly.',
      icon: '👥'
    },
    {
      category: 'efficiency',
      title: 'Shiny Charm',
      content: 'Complete the Pokedex to receive the Shiny Charm, which doubles your shiny odds to 1/2048. This is the single biggest improvement you can make to your odds.',
      icon: '✨'
    },
    {
      category: 'efficiency',
      title: 'Perfect Dex Entries',
      content: 'Completing research tasks for a Pokemon improves your shiny odds specifically for that species. Get a Pokemon\'s dex entry to Perfect level for the best odds.',
      icon: '📖'
    },
    {
      category: 'strategy',
      title: 'Check Every Spawn',
      content: 'Always visually check Pokemon even if they don\'t sparkle immediately. Some shinies have subtle differences that are easy to miss at first glance.',
      icon: '👀'
    },
    {
      category: 'strategy',
      title: 'Use Audio Cues',
      content: 'Turn up your volume! Shiny Pokemon have a distinctive sparkle sound effect when they spawn. This can help you notice shinies even when you\'re not looking directly at them.',
      icon: '🔊'
    },
    {
      category: 'strategy',
      title: 'Hunt During Night',
      content: 'Some Pokemon only spawn at night, but more importantly, shiny sparkles are often easier to see in darker lighting conditions.',
      icon: '🌙'
    },
    {
      category: 'efficiency',
      title: 'Track Your Hunts',
      content: 'Use this app to track your encounters and methods. This helps you stay motivated and identify which methods work best for you.',
      icon: '📊'
    },
    {
      category: 'efficiency',
      title: 'Take Breaks',
      content: 'Shiny hunting can be mentally draining. Take regular breaks to avoid burnout. The shiny will come when it comes - patience is key!',
      icon: '☕'
    }
  ];
  
  const categories = ['all', 'method', 'efficiency', 'strategy', 'odds'] as const;
  let selectedCategory: typeof categories[number] = 'all';
  
  $: filteredTips = selectedCategory === 'all' 
    ? huntTips 
    : huntTips.filter(tip => tip.category === selectedCategory);
</script>

<AuthGuard>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-2">Hunt Tips</h1>
      <p class="text-gray-500">Learn the best strategies for shiny hunting in Pokemon Legends: Z-A</p>
    </div>
    
    <!-- Category Filter -->
    <div class="flex flex-wrap gap-2 mb-6">
      {#each categories as category}
        <button
          class="btn btn-sm {selectedCategory === category ? 'btn-primary' : 'btn-outline'}"
          on:click={() => selectedCategory = category}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      {/each}
    </div>
    
    <!-- Tips Grid -->
    <div class="grid gap-4">
      {#each filteredTips as tip}
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <div class="flex items-start gap-4">
              <div class="text-4xl">{tip.icon}</div>
              
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-lg font-bold">{tip.title}</h3>
                  <span class="badge badge-sm badge-ghost capitalize">{tip.category}</span>
                </div>
                
                <p class="text-gray-600">{tip.content}</p>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Additional Resources -->
    <div class="card bg-base-100 shadow mt-6">
      <div class="card-body">
        <h3 class="text-lg font-bold mb-4">Quick Reference</h3>
        
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="stat bg-base-200 rounded-box">
            <div class="stat-title">Base Odds</div>
            <div class="stat-value text-2xl">1/4096</div>
            <div class="stat-desc">Without any bonuses</div>
          </div>
          
          <div class="stat bg-base-200 rounded-box">
            <div class="stat-title">With Shiny Charm</div>
            <div class="stat-value text-2xl">1/2048</div>
            <div class="stat-desc">Complete Pokedex reward</div>
          </div>
          
          <div class="stat bg-base-200 rounded-box">
            <div class="stat-title">Perfect Dex Entry</div>
            <div class="stat-value text-2xl">1/1024</div>
            <div class="stat-desc">Max research for species</div>
          </div>
          
          <div class="stat bg-base-200 rounded-box">
            <div class="stat-title">Mass Outbreak</div>
            <div class="stat-value text-2xl">~1/158</div>
            <div class="stat-desc">With Shiny Charm + Perfect</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</AuthGuard>
