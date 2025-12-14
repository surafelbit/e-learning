<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo('/login')
    }
  ]
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <p>Redirecting to login...</p>
  </div>
</template>
