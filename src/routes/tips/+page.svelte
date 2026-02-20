<script lang="ts">
  import AuthGuard from '$lib/components/layout/AuthGuard.svelte';
  import { Lightbulb, Sparkles, RotateCcw, Zap, DoorOpen, Target, TrendingUp, Shield, BookOpen } from 'lucide-svelte';
  
  const huntTips = [
    {
      category: 'odds',
      title: 'Base Shiny Odds',
      content: 'In Pokemon Legends: Z-A, the base shiny odds are 1/4096. These can be improved through various methods like the Shiny Charm, mass outbreaks, and specific hunting techniques.',
      icon: '🎲',
      color: 'from-[#DDA0DD] to-[#DA70D6]'
    },
    {
      category: 'method',
      title: 'Respawn Method',
      content: 'Defeat or catch the target Pokemon, leave the area, and return. The Pokemon will respawn with a new chance to be shiny. This is the most reliable method for most Pokemon.',
      icon: '🔄',
      color: 'from-[#FFB7C5] to-[#E89AAA]'
    },
    {
      category: 'method',
      title: 'Fast Travel Method',
      content: 'Use fast travel points to quickly reset spawns. Best used when the target spawns near a travel point. This is faster than the respawn method for certain locations.',
      icon: '🚀',
      color: 'from-[#87CEEB] to-[#5BA8D0]'
    },
    {
      category: 'method',
      title: 'Door Method',
      content: 'Enter and exit buildings to reset spawns. Useful in urban areas like Lumiose City where buildings are plentiful and fast travel points may be limited.',
      icon: '🚪',
      color: 'from-[#FFD700] to-[#FFA500]'
    },
    {
      category: 'method',
      title: 'Mass Outbreaks',
      content: 'During mass outbreaks, multiple Pokemon of the same species spawn in one area. These often have improved shiny odds and allow you to check many Pokemon quickly.',
      icon: '👥',
      color: 'from-[#98FB98] to-[#90EE90]'
    },
    {
      category: 'efficiency',
      title: 'Shiny Charm',
      content: 'Complete the Pokedex to receive the Shiny Charm, which doubles your shiny odds to 1/2048. This is the single biggest improvement you can make to your odds.',
      icon: '✨',
      color: 'from-[#FFD700] to-[#FFA500]'
    },
    {
      category: 'efficiency',
      title: 'Perfect Dex Entries',
      content: 'Completing research tasks for a Pokemon improves your shiny odds specifically for that species. Get a Pokemon\'s dex entry to Perfect level for the best odds.',
      icon: '📖',
      color: 'from-[#87CEEB] to-[#5BA8D0]'
    },
    {
      category: 'strategy',
      title: 'Check Every Spawn',
      content: 'Always visually check Pokemon even if they don\'t sparkle immediately. Some shinies have subtle differences that are easy to miss at first glance.',
      icon: '👀',
      color: 'from-[#FFB7C5] to-[#E89AAA]'
    },
    {
      category: 'strategy',
      title: 'Use Audio Cues',
      content: 'Turn up your volume! Shiny Pokemon have a distinctive sparkle sound effect when they spawn. This can help you notice shinies even when you\'re not looking directly at them.',
      icon: '🔊',
      color: 'from-[#87CEEB] to-[#5BA8D0]'
    },
    {
      category: 'strategy',
      title: 'Hunt During Night',
      content: 'Some Pokemon only spawn at night, but more importantly, shiny sparkles are often easier to see in darker lighting conditions.',
      icon: '🌙',
      color: 'from-[#4A3A4B] to-[#2D1B2E]'
    },
    {
      category: 'efficiency',
      title: 'Track Your Hunts',
      content: 'Use this app to track your encounters and methods. This helps you stay motivated and identify which methods work best for you.',
      icon: '📊',
      color: 'from-[#4A90E2] to-[#2E6BB5]'
    },
    {
      category: 'efficiency',
      title: 'Take Breaks',
      content: 'Shiny hunting can be mentally draining. Take regular breaks to avoid burnout. The shiny will come when it comes - patience is key!',
      icon: '☕',
      color: 'from-[#D2B48C] to-[#C19A6B]'
    }
  ];
  
  const categories = ['all', 'method', 'efficiency', 'strategy', 'odds'] as const;
  let selectedCategory: typeof categories[number] = 'all';
  
  $: filteredTips = selectedCategory === 'all' 
    ? huntTips 
    : huntTips.filter(tip => tip.category === selectedCategory);
    
  const categoryColors: Record<string, string> = {
    all: 'from-[#FFB7C5] to-[#87CEEB]',
    method: 'from-[#FFB7C5] to-[#E89AAA]',
    efficiency: 'from-[#FFD700] to-[#FFA500]',
    strategy: 'from-[#87CEEB] to-[#5BA8D0]',
    odds: 'from-[#DDA0DD] to-[#DA70D6]'
  };
</script>

<AuthGuard>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#98FB98] to-[#90EE90] flex items-center justify-center shadow-lg">
        <Lightbulb class="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-[#2D1B2E]">Hunt Tips</h1>
        <p class="text-[#4A3A4B]">Learn the best strategies for shiny hunting in Pokemon Legends: Z-A</p>
      </div>
    </div>
    
    <!-- Category Filter -->
    <div class="flex flex-wrap gap-2 mb-6">
      {#each categories as category}
        <button
          class="btn btn-sm rounded-full border-0 transition-all {selectedCategory === category ? 'bg-gradient-to-r ' + categoryColors[category] + ' text-white shadow-md' : 'bg-white/60 text-[#4A3A4B] hover:bg-white'}"
          on:click={() => selectedCategory = category}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      {/each}
    </div>
    
    <!-- Tips Grid -->
    <div class="grid gap-4">
      {#each filteredTips as tip, i}
        <div class="card bg-white/70 backdrop-blur-sm shadow-lg border border-[#FFB7C5]/20 rounded-2xl overflow-hidden card-hover animate-slide-up"
          style="animation-delay: {i * 50}ms"
        >
          <div class="h-1 bg-gradient-to-r {tip.color}"></div>
          
          <div class="card-body">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br {tip.color} flex items-center justify-center flex-shrink-0 shadow-md">
                <span class="text-3xl">{tip.icon}</span>
              </div>
              
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-bold text-[#2D1B2E]">{tip.title}</h3>
                  <span class="badge badge-sm bg-gradient-to-r {tip.color} text-white border-0 capitalize">{tip.category}</span>
                </div>
                
                <p class="text-[#4A3A4B] leading-relaxed">{tip.content}</p>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Quick Reference -->
    <div class="card bg-white/70 backdrop-blur-sm shadow-xl border border-[#FFD700]/30 rounded-2xl overflow-hidden mt-6">
      <div class="h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500]"></div>
      
      <div class="card-body">
        <h3 class="text-lg font-bold mb-4 text-[#2D1B2E] flex items-center gap-2">
          <BookOpen class="w-5 h-5 text-[#FFA500]" />
          Quick Reference
        </h3>
        
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="stat bg-gradient-to-br from-[#FFE4E9]/50 to-[#FFB7C5]/30 rounded-xl border border-[#FFB7C5]/20">
            <div class="stat-title text-[#4A3A4B]">Base Odds</div>
            <div class="stat-value text-2xl text-[#2D1B2E]">1/4096</div>
            <div class="stat-desc text-[#4A3A4B]/70">Without any bonuses</div>
          </div>
          
          <div class="stat bg-gradient-to-br from-[#E0F4FC]/50 to-[#87CEEB]/30 rounded-xl border border-[#87CEEB]/20">
            <div class="stat-title text-[#4A3A4B]">With Shiny Charm</div>
            <div class="stat-value text-2xl text-[#2D1B2E]">1/2048</div>
            <div class="stat-desc text-[#4A3A4B]/70">Complete Pokedex reward</div>
          </div>
          
          <div class="stat bg-gradient-to-br from-[#FFFACD]/50 to-[#FFD700]/30 rounded-xl border border-[#FFD700]/20">
            <div class="stat-title text-[#4A3A4B]">Perfect Dex Entry</div>
            <div class="stat-value text-2xl text-[#2D1B2E]">1/1024</div>
            <div class="stat-desc text-[#4A3A4B]/70">Max research for species</div>
          </div>
          
          <div class="stat bg-gradient-to-br from-[#DDA0DD]/50 to-[#DA70D6]/30 rounded-xl border border-[#DA70D6]/20">
            <div class="stat-title text-[#4A3A4B]">Mass Outbreak</div>
            <div class="stat-value text-2xl text-[#2D1B2E]">~1/158</div>
            <div class="stat-desc text-[#4A3A4B]/70">With Shiny Charm + Perfect</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</AuthGuard>
