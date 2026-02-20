<script lang="ts">
  import { page } from '$app/stores';
  import { isAuthenticated, user } from '$lib/stores/auth';
  import { logout } from '$lib/firebase/auth';
  import { goto } from '$app/navigation';
  import { LogOut, User, Sparkles } from 'lucide-svelte';
  
  async function handleLogout() {
    await logout();
    goto('/');
  }
</script>

<nav class="navbar bg-white/80 backdrop-blur-md border-b border-[#FFB7C5]/30 sticky top-0 z-50">
  <div class="navbar-start">
    <a href="/" class="btn btn-ghost text-xl font-bold text-[#2D1B2E] hover:bg-[#FFB7C5]/10">
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB7C5] to-[#87CEEB] flex items-center justify-center mr-2">
        <Sparkles class="w-4 h-4 text-white" />
      </div>
      Shiny Hunter Z-A
    </a>
  </div>
  
  <div class="navbar-end gap-2">
    {#if $isAuthenticated}
      <div class="dropdown dropdown-end">
        <button tabindex="0" class="btn btn-ghost btn-circle avatar hover:bg-[#FFB7C5]/10">
          {#if $user?.photoURL}
            <div class="w-10 rounded-full ring-2 ring-[#FFB7C5]/50">
              <img src={$user.photoURL} alt={$user.displayName || 'User'} />
            </div>
          {:else}
            <div class="w-10 rounded-full bg-gradient-to-br from-[#FFB7C5] to-[#87CEEB] flex items-center justify-center">
              <User class="w-6 h-6 text-white" />
            </div>
          {/if}
        </button>
        
        <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-white/95 backdrop-blur-md rounded-xl w-52 border border-[#FFB7C5]/20">
          <li>
            <span class="font-semibold text-[#2D1B2E]">{$user?.displayName || 'User'}</span>
          </li>
          <div class="divider my-1 before:bg-[#FFB7C5]/30 after:bg-[#87CEEB]/30"></div>
          <li>
            <button on:click={handleLogout} class="text-red-500 hover:bg-red-50 rounded-lg">
              <LogOut class="w-4 h-4" /> Logout
            </button>
          </li>
        </ul>
      </div>
    {:else}
      <a href="/" class="btn bg-gradient-to-r from-[#FFB7C5] to-[#E89AAA] text-white border-0 hover:shadow-lg hover:brightness-105 transition-all btn-sm">
        Sign In
      </a>
    {/if}
  </div>
</nav>
