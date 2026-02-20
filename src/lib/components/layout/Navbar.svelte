<script lang="ts">
  import { page } from '$app/stores';
  import { isAuthenticated, user } from '$lib/stores/auth';
  import { logout } from '$lib/firebase/auth';
  import { goto } from '$app/navigation';
  import { LogOut, User } from 'lucide-svelte';
  
  async function handleLogout() {
    await logout();
    goto('/');
  }
</script>

<nav class="navbar bg-base-100 border-b border-base-200 sticky top-0 z-50">
  <div class="navbar-start">
    <a href="/" class="btn btn-ghost text-xl font-bold">
      <span class="text-poke-red">✨</span> Shiny Hunter Z-A
    </a>
  </div>
  
  <div class="navbar-end gap-2">
    {#if $isAuthenticated}
      <div class="dropdown dropdown-end">
        <button tabindex="0" class="btn btn-ghost btn-circle avatar">
          {#if $user?.photoURL}
            <div class="w-10 rounded-full">
              <img src={$user.photoURL} alt={$user.displayName || 'User'} />
            </div>
          {:else}
            <div class="w-10 rounded-full bg-primary flex items-center justify-center">
              <User class="w-6 h-6" />
            </div>
          {/if}
        </button>
        <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <span class="font-semibold">{$user?.displayName || 'User'}</span>
          </li>
          <div class="divider my-1"></div>
          <li>
            <button on:click={handleLogout} class="text-error">
              <LogOut class="w-4 h-4" /> Logout
            </button>
          </li>
        </ul>
      </div>
    {:else}
      <a href="/" class="btn btn-primary btn-sm">Sign In</a>
    {/if}
  </div>
</nav>
