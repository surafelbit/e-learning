<script setup lang="ts">
// No middleware redirect anymore
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
    <!-- Navigation -->
    <nav class="container mx-auto px-6 py-6 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <span class="font-bold text-xl">B</span>
        </div>
        <span class="text-xl font-bold tracking-tight">Brain Bite</span>
      </div>
      <div>
        <NuxtLink to="/login" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-all rounded-full font-medium text-sm shadow-lg shadow-indigo-500/30">
          Sign In
        </NuxtLink>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="container mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
      <div class="max-w-3xl space-y-8">
        <div class="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
          <span class="text-indigo-400 text-sm font-medium">✨ The Future of E-Learning</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
          Master New Skills <br>
          <span class="text-indigo-500">Bite by Bite</span>
        </h1>
        
        <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Unlock your potential with AI-driven courses tailored just for you. 
          Learn faster, retain more, and achieve your goals with Brain Bite.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <NuxtLink to="/login" class="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
            Get Started Now
          </NuxtLink>
          <button class="w-full sm:w-auto px-8 py-4 bg-gray-800 text-white border border-gray-700 rounded-full font-bold text-lg hover:bg-gray-750 transition-all">
            Learn More
          </button>
        </div>
      </div>

      <!-- decorative elements -->
      <div class="mt-20 relative w-full max-w-5xl">
        <div class="absolute -top-10 -left-10 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div class="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>
        
        <div class="relative bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 backdrop-blur-xl shadow-2xl">
           <div class="aspect-video rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center border border-gray-700">
              <p class="text-gray-500 font-medium">[ App Dashboard Prevention Preview ]</p>
           </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* clean, modern scrollbar if needed */
</style>
