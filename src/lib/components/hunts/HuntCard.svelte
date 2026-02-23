<script lang="ts">
  import { formatTimeAgo, formatHuntDuration } from '$lib/utils/formatters';
  import { incrementHunt, decrementHunt, completeHunt, deleteHunt } from '$lib/services/huntService';
  import { celebrateShiny } from '$lib/utils/celebration';
  import type { Hunt } from '$lib/types';
  import { Plus, Minus, Trash2, Check, RotateCcw, Target } from 'lucide-svelte';

  export let hunt: Hunt;

  let updating = false;

  async function handleIncrement() {
    updating = true;
    await incrementHunt(hunt.id, 1);
    updating = false;
  }

  async function handleDecrement() {
    updating = true;
    await decrementHunt(hunt.id, 1);
    updating = false;
  }

  async function handleIncrement10() {
    updating = true;
    await incrementHunt(hunt.id, 10);
    updating = false;
  }

  async function handleComplete() {
    if (confirm(`Mark ${hunt.pokemonName} as caught?`)) {
      const result = await completeHunt(hunt.id, hunt.encounters);
      if (result.success) {
        celebrateShiny(hunt.encounters, hunt.durationMinutes || 0);
      }
    }
  }

  async function handleDelete() {
    if (confirm(`Delete hunt for ${hunt.pokemonName}?`)) {
      await deleteHunt(hunt.id);
    }
  }

  $: timeAgo = hunt.lastUpdated ? formatTimeAgo(hunt.lastUpdated) : 'Unknown';
  $: duration = formatHuntDuration(hunt.durationMinutes || 0);
  $: displayName = hunt.pokemonName.charAt(0).toUpperCase() + hunt.pokemonName.slice(1);
</script>

<div class="card bg-white/80 backdrop-blur-sm shadow-lg border border-[#87CEEB]/30 rounded-xl overflow-hidden card-hover">
  <div class="h-0.5 bg-gradient-to-r from-[#87CEEB] to-[#5BA8D0]"></div>

  <div class="p-3">
    <div class="flex items-center gap-3">
      <!-- Sprite with gradient background -->
      <div class="w-12 h-12 rounded-lg bg-gradient-to-b from-[#E0F4FC] to-[#B0E0F0] flex items-center justify-center flex-shrink-0">
        <img
          src={hunt.shinySpriteUrl}
          alt={hunt.pokemonName}
          class="w-10 h-10 object-contain"
        />
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-[#2D1B2E] text-sm truncate capitalize">{displayName}</h3>

        <div class="flex items-center gap-1 text-xs text-[#4A3A4B]">
          <Target class="w-3 h-3" />
          <span class="capitalize">{hunt.method.replace('_', ' ')}</span>
        </div>

        {#if hunt.durationMinutes > 0}
          <p class="text-xs text-[#4A3A4B]/60">{duration}</p>
        {/if}
      </div>

      <!-- Encounters -->
      <div class="text-center bg-gradient-to-b from-[#FFE4E9]/50 to-[#FFB7C5]/30 rounded-lg px-3 py-1.5">
        <div class="text-xl font-bold text-[#2D1B2E] tabular-nums">{hunt.encounters.toLocaleString()}</div>
        <div class="text-xs text-[#4A3A4B]">enc</div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-1 mt-3">
      <button
        class="btn btn-xs bg-[#F5EDE3] text-[#2D1B2E] border-0 hover:bg-[#E8DFD5] transition-all min-h-8 px-2"
        on:click={handleDecrement}
        disabled={updating || hunt.encounters <= 0}
        title="Undo -1"
      >
        <Minus class="w-3.5 h-3.5" />
      </button>

      <button
        class="btn btn-xs flex-1 bg-gradient-to-r from-[#FFB7C5] to-[#E89AAA] text-white border-0 hover:shadow-md hover:brightness-105 transition-all min-h-8"
        on:click={handleIncrement}
        disabled={updating}
      >
        {#if updating}
          <span class="loading loading-spinner loading-xs"></span>
        {:else}
          <Plus class="w-3.5 h-3.5 mr-0.5" /> +1
        {/if}
      </button>

      <button
        class="btn btn-xs bg-[#F5EDE3] text-[#2D1B2E] border-0 hover:bg-[#E8DFD5] transition-all min-h-8 px-2"
        on:click={handleIncrement10}
        disabled={updating}
      >
        +10
      </button>

      <button
        class="btn btn-xs bg-gradient-to-r from-[#87CEEB] to-[#5BA8D0] text-white border-0 hover:shadow-md hover:brightness-105 transition-all min-h-8 px-2"
        on:click={handleComplete}
        title="Mark as caught"
      >
        <Check class="w-3.5 h-3.5" />
      </button>

      <button
        class="btn btn-xs bg-red-100 text-red-600 border-0 hover:bg-red-200 transition-all min-h-8 px-2"
        on:click={handleDelete}
        title="Delete hunt"
      >
        <Trash2 class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</div>
