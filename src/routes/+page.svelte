<script lang="ts">
  import { isAuthenticated, user, isLoading } from '$lib/stores/auth';
  import { signInWithGoogle } from '$lib/firebase/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
  
  let error = '';
  
  onMount(() => {
    const unsub = isAuthenticated.subscribe((auth) => {
      if (auth && !$isLoading) {
        goto('/pokedex');
      }
    });
    
    return unsub;
  });
  
  async function handleSignIn() {
    error = '';
    const { error: signInError } = await signInWithGoogle();
    if (signInError) {
      error = signInError;
    }
  }
</script>

{#if $isLoading}
  <div class="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
{:else if !$isAuthenticated}
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="card bg-base-100 shadow-xl max-w-md w-full">
      <div class="card-body items-center text-center">
        <div class="text-6xl mb-4">✨</div>
        
        <h1 class="text-3xl font-bold mb-2">Shiny Hunter Z-A</h1>
        <p class="text-gray-500 mb-8">
          Track your shiny hunting progress in Pokemon Legends: Z-A
        </p>
        
        <div class="space-y-4 w-full">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span>📖</span> Browse the Pokedex
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span>🎯</span> Track active hunts
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span>✨</span> Record your shinies
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span>💡</span> Get hunting tips
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span>📊</span> View your stats
            </div>
          </div>
          
          <div class="divider"></div>
          
          <button 
            class="btn btn-primary w-full"
            on:click={handleSignIn}
          >
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
          
          {#if error}
            <div class="alert alert-error text-sm">{error}</div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
{/if}
