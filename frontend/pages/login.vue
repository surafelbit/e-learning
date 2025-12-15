<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const isLogin = ref(true) // Start in Login mode
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const infoMsg = ref('') // For email verification messages

const toggleMode = () => {
    isLogin.value = !isLogin.value
    errorMsg.value = ''
    infoMsg.value = ''
}

const handleAuth = async () => {
  loading.value = true
  errorMsg.value = ''
  infoMsg.value = ''

  try {
    if (isLogin.value) {
      // --- LOGIN FLOW ---
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (error) throw error

      router.push('/courses')
    } else {
      // --- SIGN UP FLOW (no email confirmation) ---
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (signUpError) throw signUpError

      // Immediately sign the user in so they can see courses without verifying email
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (signInError) throw signInError

      infoMsg.value = 'Account created and you are now logged in!'
      router.push('/courses')
    }
  } catch (error: any) {
    errorMsg.value = error.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
watchEffect(() => {
  if (user.value) {
    router.push('/courses')
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-3xl font-bold mb-2 text-center text-indigo-600">BrainBite</h1>
      <h2 class="text-xl font-semibold mb-6 text-center text-gray-700">
          {{ isLogin ? 'Welcome Back!' : 'Create an Account' }}
      </h2>

      <form @submit.prevent="handleAuth" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="you@example.com" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="••••••••" />
        </div>
        
        <div v-if="errorMsg" class="p-3 rounded bg-red-50 text-red-600 text-sm border border-red-200">
            {{ errorMsg }}
        </div>
        <div v-if="infoMsg" class="p-3 rounded bg-green-50 text-green-700 text-sm border border-green-200">
            {{ infoMsg }}
        </div>

        <button type="submit" :disabled="loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <span v-if="loading">Processing...</span>
          <span v-else>{{ isLogin ? 'Sign In' : 'Sign Up' }}</span>
        </button>
      </form>

      <div class="mt-6 text-center text-sm">
          <button @click="toggleMode" type="button" class="text-indigo-600 hover:text-indigo-500 font-medium focus:outline-none">
              {{ isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In" }}
          </button>
      </div>
    </div>
  </div>
</template>
