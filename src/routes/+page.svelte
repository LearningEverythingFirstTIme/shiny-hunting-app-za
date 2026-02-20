<script lang="ts">
  import { isAuthenticated, user, isLoading } from '$lib/stores/auth';
  import { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } from '$lib/firebase/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
  import { Sparkles, BookOpen, Target, Lightbulb, BarChart3 } from 'lucide-svelte';
  
  let error = '';
  let email = '';
  let password = '';
  let isSignUp = false;
  let isResettingPassword = false;
  let successMessage = '';
  
  onMount(() => {
    const unsub = isAuthenticated.subscribe((auth) => {
      if (auth && !$isLoading) {
        goto('/pokedex');
      }
    });
    
    return unsub;
  });
  
  async function handleGoogleSignIn() {
    error = '';
    successMessage = '';
    const { error: signInError } = await signInWithGoogle();
    if (signInError) {
      error = signInError;
    }
  }
  
  async function handleEmailSubmit() {
    error = '';
    successMessage = '';
    
    if (!email || !password) {
      error = 'Please enter both email and password';
      return;
    }
    
    if (password.length < 6) {
      error = 'Password must be at least 6 characters';
      return;
    }
    
    if (isSignUp) {
      const { error: signUpError } = await signUpWithEmail(email, password);
      if (signUpError) {
        error = signUpError;
      }
    } else {
      const { error: signInError } = await signInWithEmail(email, password);
      if (signInError) {
        error = signInError;
      }
    }
  }
  
  async function handleResetPassword() {
    error = '';
    successMessage = '';
    
    if (!email) {
      error = 'Please enter your email address';
      return;
    }
    
    const { error: resetError } = await resetPassword(email);
    if (resetError) {
      error = resetError;
    } else {
      successMessage = 'Password reset email sent! Check your inbox.';
      isResettingPassword = false;
    }
  }
  
  function toggleMode() {
    isSignUp = !isSignUp;
    error = '';
    successMessage = '';
  }
  
  function showResetForm() {
    isResettingPassword = true;
    error = '';
    successMessage = '';
  }
  
  function showSignInForm() {
    isResettingPassword = false;
    error = '';
    successMessage = '';
  }
</script>

{#if $isLoading}
  <div class="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
{:else if !$isAuthenticated}
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="card bg-white/80 backdrop-blur-sm shadow-2xl max-w-md w-full border border-[#FFB7C5]/30 animate-slide-up">
      <!-- Decorative ribbon -->
      <div class="h-2 bg-gradient-to-r from-[#FFB7C5] via-[#87CEEB] to-[#FFB7C5]"></div>
      
      <div class="card-body items-center text-center p-8">
        <!-- Sylveon-inspired logo -->
        <div class="relative mb-6">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFB7C5] to-[#87CEEB] flex items-center justify-center shadow-lg animate-float">
            <Sparkles class="w-10 h-10 text-white" />
          </div>
          <div class="absolute -top-1 -right-1 text-2xl animate-sparkle">✨</div>
        </div>
        
        <h1 class="text-3xl font-bold mb-2 text-[#2D1B2E]">Shiny Hunter Z-A</h1>
        <p class="text-[#4A3A4B] mb-8">
          Track your shiny hunting progress in Pokemon Legends: Z-A
        </p>
        
        <!-- Feature highlights -->
        <div class="grid grid-cols-2 gap-3 w-full mb-6">
          <div class="flex items-center gap-2 p-3 bg-[#FFE4E9]/50 rounded-xl">
            <BookOpen class="w-5 h-5 text-[#E89AAA]" />
            <span class="text-sm text-[#2D1B2E]">Pokedex</span>
          </div>
          <div class="flex items-center gap-2 p-3 bg-[#E0F4FC]/50 rounded-xl">
            <Target class="w-5 h-5 text-[#5BA8D0]" />
            <span class="text-sm text-[#2D1B2E]">Track Hunts</span>
          </div>
          <div class="flex items-center gap-2 p-3 bg-[#E0F4FC]/50 rounded-xl">
            <Sparkles class="w-5 h-5 text-[#FFD700]" />
            <span class="text-sm text-[#2D1B2E]">Record Shinies</span>
          </div>
          <div class="flex items-center gap-2 p-3 bg-[#FFE4E9]/50 rounded-xl">
            <Lightbulb class="w-5 h-5 text-[#E89AAA]" />
            <span class="text-sm text-[#2D1B2E]">Hunt Tips</span>
          </div>
        </div>
        
        <div class="divider before:bg-[#FFB7C5]/30 after:bg-[#87CEEB]/30"></div>
        
        {#if isResettingPassword}
          <!-- Password Reset Form -->
          <div class="space-y-4 w-full">
            <h2 class="text-xl font-semibold text-[#2D1B2E]">Reset Password</h2>
            
            <div class="form-control w-full">
              <label class="label" for="reset-email">
                <span class="label-text text-[#4A3A4B]">Email</span>
              </label>
              <input 
                type="email" 
                id="reset-email"
                placeholder="your@email.com" 
                class="input input-bordered w-full bg-white/50 border-[#FFB7C5]/50 focus:border-[#FFB7C5] focus:ring-2 focus:ring-[#FFB7C5]/30"
                bind:value={email}
              />
            </div>
            
            <button 
              class="btn w-full bg-gradient-to-r from-[#FFB7C5] to-[#E89AAA] text-white border-0 hover:shadow-lg hover:brightness-105 transition-all"
              on:click={handleResetPassword}
            >
              Send Reset Email
            </button>
            
            <button 
              class="btn btn-ghost btn-sm w-full text-[#4A90E2]"
              on:click={showSignInForm}
            >
              Back to Sign In
            </button>
          </div>
        {:else}
          <!-- Email/Password Form -->
          <div class="space-y-4 w-full">
            <h2 class="text-xl font-semibold text-[#2D1B2E]">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            
            <div class="form-control w-full">
              <label class="label" for="email">
                <span class="label-text text-[#4A3A4B]">Email</span>
              </label>
              <input 
                type="email" 
                id="email"
                placeholder="your@email.com" 
                class="input input-bordered w-full bg-white/50 border-[#FFB7C5]/50 focus:border-[#FFB7C5] focus:ring-2 focus:ring-[#FFB7C5]/30"
                bind:value={email}
              />
            </div>
            
            <div class="form-control w-full">
              <label class="label" for="password">
                <span class="label-text text-[#4A3A4B]">Password</span>
              </label>
              <input 
                type="password" 
                id="password"
                placeholder="••••••••" 
                class="input input-bordered w-full bg-white/50 border-[#FFB7C5]/50 focus:border-[#FFB7C5] focus:ring-2 focus:ring-[#FFB7C5]/30"
                bind:value={password}
              />
              {#if !isSignUp}
                <label class="label">
                  <button 
                    class="label-text-alt link text-[#4A90E2] hover:text-[#2E6BB5]"
                    on:click={showResetForm}
                  >
                    Forgot password?
                  </button>
                </label>
              {/if}
            </div>
            
            <button 
              class="btn w-full bg-gradient-to-r from-[#FFB7C5] to-[#E89AAA] text-white border-0 hover:shadow-lg hover:brightness-105 transition-all"
              on:click={handleEmailSubmit}
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
            
            <div class="text-sm text-[#4A3A4B]">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button 
                class="link text-[#4A90E2] hover:text-[#2E6BB5] ml-1 font-medium"
                on:click={toggleMode}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </div>
          
          <div class="divider before:bg-[#FFB7C5]/30 after:bg-[#87CEEB]/30">or</div>
          
          <!-- Google Sign In -->
          <button 
            class="btn w-full bg-white border-2 border-[#87CEEB]/50 hover:border-[#87CEEB] hover:bg-[#E0F4FC]/30 text-[#2D1B2E] transition-all"
            on:click={handleGoogleSignIn}
          >
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        {/if}
        
        {#if error}
          <div class="alert alert-error text-sm bg-red-100 text-red-800 border-red-200">{error}</div>
        {/if}
        
        {#if successMessage}
          <div class="alert alert-success text-sm bg-green-100 text-green-800 border-green-200">{successMessage}</div>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div class="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
{/if}
