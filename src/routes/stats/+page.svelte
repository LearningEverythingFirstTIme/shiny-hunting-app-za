<script lang="ts">
  import { activeHunts, completedHunts } from '$lib/services/huntService';
  import { shinies } from '$lib/services/shinyService';
  import AuthGuard from '$lib/components/layout/AuthGuard.svelte';
  import StatCard from '$lib/components/stats/StatCard.svelte';
  import { Trophy, Target, Clock, Activity, BarChart3 } from 'lucide-svelte';
  
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
</script>

<AuthGuard>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-2">Statistics</h1>
      <p class="text-gray-500">Track your shiny hunting progress</p>
    </div>
    
    <!-- Main Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Shinies" 
        value={totalShinies} 
        icon="✨" 
        color="warning"
      />
      
      <StatCard 
        title="Active Hunts" 
        value={totalActiveHunts} 
        icon="🎯" 
        color="primary"
      />
      
      <StatCard 
        title="Total Encounters" 
        value={totalEncounters.toLocaleString()} 
        icon="👀" 
        color="info"
      />
      
      <StatCard 
        title="Time Hunting" 
        value={`${totalTimeHours}h`} 
        subtitle={`${totalTimeMinutes % 60}m`}
        icon="⏱️" 
        color="success"
      />
    </div>
    
    <!-- Additional Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Hunt Methods -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h3 class="text-lg font-bold mb-4">Hunts by Method</h3>
          
          {#if Object.keys(byMethod).length === 0}
            <p class="text-gray-500">No hunts recorded yet</p>
          {:else}
            <div class="space-y-3">
              {#each Object.entries(byMethod).sort((a, b) => b[1] - a[1]) as [method, count]}
                <div class="flex items-center gap-3">
                  <div class="flex-1">
                    <div class="flex justify-between mb-1">
                      <span class="text-sm font-medium capitalize">{methodLabels[method] || method}</span>
                      <span class="text-sm text-gray-500">{count}</span>
                    </div>
                    <div class="w-full bg-base-200 rounded-full h-2">
                      <div 
                        class="bg-primary h-2 rounded-full transition-all"
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
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h3 class="text-lg font-bold mb-4">Shiny Statistics</h3>
          
          {#if totalShinies === 0}
            <p class="text-gray-500">No shinies recorded yet</p>
          {:else}
            <div class="space-y-4">
              <div class="stat bg-base-200 rounded-box">
                <div class="stat-title">Average Encounters</div>
                <div class="stat-value text-2xl">{avgEncounters.toLocaleString()}</div>
                <div class="stat-desc">Per shiny caught</div>
              </div>
              
              <div class="stat bg-base-200 rounded-box">
                <div class="stat-title">Luckiest Hunt</div>
                <div class="stat-value text-2xl">
                  {Math.min(...$shinies.map(s => s.encounters || 0)).toLocaleString()}
                </div>
                <div class="stat-desc">Fewest encounters</div>
              </div>
              
              <div class="stat bg-base-200 rounded-box">
                <div class="stat-title">Longest Hunt</div>
                <div class="stat-value text-2xl">
                  {Math.max(...$shinies.map(s => s.encounters || 0)).toLocaleString()}
                </div>
                <div class="stat-desc">Most encounters</div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    {#if $shinies.length > 0}
      <div class="card bg-base-100 shadow mt-6">
        <div class="card-body">
          <h3 class="text-lg font-bold mb-4">Recent Shinies</h3>
          
          <div class="flex gap-4 overflow-x-auto pb-2">
            {#each $shinies.slice(0, 10) as shiny}
              <div class="flex-shrink-0 text-center">
                <img 
                  src={shiny.shinySpriteUrl} 
                  alt={shiny.pokemonName}
                  class="w-16 h-16 object-contain mx-auto"
                />
                <p class="text-xs font-medium capitalize mt-1">{shiny.pokemonName}</p>
                <p class="text-xs text-gray-500">{shiny.encounters.toLocaleString()} encounters</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
</AuthGuard>
