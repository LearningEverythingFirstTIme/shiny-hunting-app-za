<script lang="ts">
  import { isAuthenticated, isLoading } from '$lib/stores/auth';
  
  export let requireAuth = true;
</script>

{#if $isLoading}
  <div class="flex items-center justify-center min-h-screen">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
{:else if requireAuth && !$isAuthenticated}
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="text-6xl mb-4">🔒</div>
    <h1 class="text-2xl font-bold mb-2">Sign In Required</h1>
    <p class="text-gray-500 mb-6 text-center">Please sign in to access this page</p>
    <a href="/" class="btn btn-primary">Go to Sign In</a>
  </div>
{:else}
  <slot />
{/if}
