
<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  
  // Try sign up first (easier for demo), then sign in if exists
  // For production, separate flows. For MVP, we'll just do Sign In.
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
        // Attempt sign up if login fails (A bit hacky but smooth for MVP testing)
        const { error: signUpError } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
        })
        if (signUpError) {
             errorMsg.value = signUpError.message
        } else {
             // Success signup, usually auto sign in
             router.push('/courses')
        }
    } else {
        errorMsg.value = error.message
    }
  } else {
    router.push('/courses')
  }
  loading.value = false
}

// Redirect if already logged in
watchEffect(() => {
  if (user.value) {
    router.push('/courses')
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-indigo-600">BrainBite Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
        </div>
        <div v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</div>
        <button type="submit" :disabled="loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50">
          {{ loading ? 'Processing...' : 'Sign In / Sign Up' }}
        </button>
      </form>
    </div>
  </div>
</template>
