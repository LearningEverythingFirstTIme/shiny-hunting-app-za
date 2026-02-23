<script lang="ts">
  import { activeHunts, completedHunts } from '$lib/services/huntService';
  import { shinies } from '$lib/services/shinyService';
  import { auth } from '$lib/firebase/client';
  import { onMount } from 'svelte';
  import AuthGuard from '$lib/components/layout/AuthGuard.svelte';
  import StatCard from '$lib/components/stats/StatCard.svelte';
  import { BarChart3, Sparkles, Target, Clock, TrendingUp, User } from 'lucide-svelte';

  let userId = '';
  let showUserId = false;

  onMount(() => {
    userId = auth.currentUser?.uid || '';
  });
  
  $: totalShinies = $shinies.length;
  $: totalActiveHunts = $activeHunts.length;
  $: totalCompletedHunts = $completedHunts.length;
  $: totalEncounters = [...$activeHunts, ...$completedHunts].reduce((sum, h) => sum + (h.encounters || 0), 0);
  $: totalTimeMinutes = [...$activeHunts, ...$completedHunts].reduce((sum, h) => sum + (h.durationMinutes || 0), 0);
  
  $: totalTimeHours = Math.floor(totalTimeMinutes / 60);
  
  // Calculate by method
  $: byMethod = [...$activeHunts, ...$completedHunts].reduce((acc, hunt) => {
    const method = hunt.method || 'other';
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate average encounters per shiny
  $: avgEncounters = totalShinies > 0 
    ? Math.round($shinies.reduce((sum, s) => sum + (s.encounters || 0), 0) / totalShinies)
    : 0;
  
  const methodLabels: Record<string, string> = {
    respawn: 'Respawn',
    fast_travel: 'Fast Travel',
    door: 'Door Method',
    mass_outbreak: 'Mass Outbreak',
    other: 'Other'
  };
  
  const methodColors: Record<string, string> = {
    respawn: 'from-[#FFB7C5] to-[#E89AAA]',
    fast_travel: 'from-[#87CEEB] to-[#5BA8D0]',
    door: 'from-[#FFD700] to-[#FFA500]',
    mass_outbreak: 'from-[#DDA0DD] to-[#DA70D6]',
    other: 'from-[#C0C0C0] to-[#A0A0A0]'
  };
</script>

<AuthGuard>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A90E2] to-[#2E6BB5] flex items-center justify-center shadow-lg">
        <BarChart3 class="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-[#2D1B2E]">Statistics</h1>
        <p class="text-[#4A3A4B]">Track your shiny hunting progress</p>
      </div>
    </div>
    
    <!-- Main Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Shinies" 
        value={totalShinies} 
        icon={Sparkles}
        color="warning"
      />
      
      <StatCard 
        title="Active Hunts" 
        value={totalActiveHunts} 
        icon={Target}
        color="primary"
      />
      
      <StatCard 
        title="Total Encounters" 
        value={totalEncounters.toLocaleString()} 
        icon={TrendingUp}
        color="info"
      />
      
      <StatCard 
        title="Time Hunting" 
        value={`${totalTimeHours}h`} 
        subtitle={`${totalTimeMinutes % 60}m`}
        icon={Clock}
        color="success"
      />
    </div>
    
    <!-- Additional Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Hunt Methods -->
      <div class="card bg-white/70 backdrop-blur-sm shadow-xl border border-[#FFB7C5]/30 rounded-2xl overflow-hidden">
        <div class="h-1 bg-gradient-to-r from-[#FFB7C5] to-[#87CEEB]"></div>
        
        <div class="card-body">
          <h3 class="text-lg font-bold mb-4 text-[#2D1B2E] flex items-center gap-2">
            <Target class="w-5 h-5 text-[#E89AAA]" />
            Hunts by Method
          </h3>
          
          {#if Object.keys(byMethod).length === 0}
            <p class="text-[#4A3A4B]">No hunts recorded yet</p>
          {:else}
            <div class="space-y-4">
              {#each Object.entries(byMethod).sort((a, b) => b[1] - a[1]) as [method, count]}
                <div class="flex items-center gap-3">
                  <div class="flex-1">
                    <div class="flex justify-between mb-2">
                      <span class="text-sm font-medium text-[#2D1B2E] capitalize">{methodLabels[method] || method}</span>
                      <span class="text-sm font-bold text-[#4A3A4B]">{count}</span>
                    </div>
                    <div class="w-full bg-[#F5EDE3] rounded-full h-3 overflow-hidden">
                      <div 
                        class="h-full rounded-full bg-gradient-to-r {methodColors[method] || 'from-gray-400 to-gray-500'} transition-all duration-500"
                        style="width: {(count / Math.max(...Object.values(byMethod))) * 100}%"
                      ></div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Shiny Stats -->
      <div class="card bg-white/70 backdrop-blur-sm shadow-xl border border-[#FFD700]/30 rounded-2xl overflow-hidden">
        <div class="h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500]"></div>
        
        <div class="card-body">
          <h3 class="text-lg font-bold mb-4 text-[#2D1B2E] flex items-center gap-2">
            <Sparkles class="w-5 h-5 text-[#FFA500]" />
            Shiny Statistics
          </h3>
          
          {#if totalShinies === 0}
            <p class="text-[#4A3A4B]">No shinies recorded yet</p>
          {:else}
            <div class="space-y-4">
              <div class="stat bg-gradient-to-br from-[#FFFACD]/50 to-[#FFE4B5]/50 rounded-xl border border-[#FFD700]/20">
                <div class="stat-title text-[#4A3A4B]">Average Encounters</div>
                <div class="stat-value text-2xl text-[#2D1B2E]">{avgEncounters.toLocaleString()}</div>
                <div class="stat-desc text-[#4A3A4B]/70">Per shiny caught</div>
              </div>
              
              <div class="stat bg-gradient-to-br from-[#E0F4FC]/50 to-[#B0E0F0]/50 rounded-xl border border-[#87CEEB]/20">
                <div class="stat-title text-[#4A3A4B]">Luckiest Hunt</div>
                <div class="stat-value text-2xl text-[#2D1B2E]">
                  {Math.min(...$shinies.map(s => s.encounters || 0)).toLocaleString()}
                </div>
                <div class="stat-desc text-[#4A3A4B]/70">Fewest encounters</div>
              </div>
              
              <div class="stat bg-gradient-to-br from-[#FFE4E9]/50 to-[#FFB7C5]/50 rounded-xl border border-[#FFB7C5]/20">
                <div class="stat-title text-[#4A3A4B]">Longest Hunt</div>
                <div class="stat-value text-2xl text-[#2D1B2E]">
                  {Math.max(...$shinies.map(s => s.encounters || 0)).toLocaleString()}
                </div>
                <div class="stat-desc text-[#4A3A4B]/70">Most encounters</div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    {#if $shinies.length > 0}
      <div class="card bg-white/70 backdrop-blur-sm shadow-xl border border-[#4A90E2]/30 rounded-2xl overflow-hidden mt-6">
        <div class="h-1 bg-gradient-to-r from-[#4A90E2] to-[#87CEEB]"></div>
        
        <div class="card-body">
          <h3 class="text-lg font-bold mb-4 text-[#2D1B2E] flex items-center gap-2">
            <Sparkles class="w-5 h-5 text-[#FFD700]" />
            Recent Shinies
          </h3>
          
          <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {#each $shinies.slice(0, 10) as shiny}
              <div class="flex-shrink-0 text-center p-3 bg-gradient-to-b from-[#FFFACD]/30 to-transparent rounded-xl">
                <img 
                  src={shiny.shinySpriteUrl} 
                  alt={shiny.pokemonName}
                  class="w-16 h-16 object-contain mx-auto animate-float"
                />
                <p class="text-xs font-semibold capitalize mt-1 text-[#2D1B2E]">{shiny.pokemonName}</p>
                <p class="text-xs text-[#4A3A4B]">{shiny.encounters.toLocaleString()} encounters</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}

    <!-- User ID (for recovery script) -->
    <div class="mt-6 text-center">
      <button
        class="text-xs text-[#4A3A4B]/50 hover:text-[#4A3A4B] transition-colors flex items-center gap-1 mx-auto"
        on:click={() => showUserId = !showUserId}
      >
        <User class="w-3 h-3" />
        {showUserId ? 'Hide User ID' : 'Show User ID (for recovery)'}
      </button>

      {#if showUserId}
        <div class="mt-2 p-3 bg-[#F5EDE3] rounded-lg inline-block">
          <code class="text-xs text-[#2D1B2E] break-all">{userId}</code>
          <button
            class="block mt-1 text-xs text-[#87CEEB] hover:text-[#5BA8D0]"
            on:click={() => navigator.clipboard.writeText(userId)}
          >
            Copy to clipboard
          </button>
        </div>
      {/if}
    </div>
  </div>
</AuthGuard>
