
<script setup lang="ts">
const config = useRuntimeConfig()
const client = useSupabaseClient()
const router = useRouter()

const subject = ref('')
const loading = ref(false)

const generateCourse = async () => {
    if (!subject.value) return
    loading.value = true

    try {
        const session = (await client.auth.getSession()).data.session
        const token = session?.access_token

        const { data, error } = await useFetch(`${config.public.backendUrl}/courses/generate`, {
            method: 'POST',
            body: { subject: subject.value },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (error.value) {
            alert('Failed to generate course: ' + error.value.message)
        } else if (data.value) {
            router.push(`/courses/${data.value.id}`)
        }
    } catch (e) {
        alert('An unexpected error occurred')
        console.error(e)
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-8 mt-10">
    <NuxtLink to="/courses" class="text-gray-500 hover:text-gray-900 mb-4 inline-block">&larr; Back to Courses</NuxtLink>
    <div class="bg-white rounded-lg shadow-xl p-8">
        <h1 class="text-3xl font-bold mb-6 text-indigo-800">Generate AI Course</h1>
        <p class="text-gray-600 mb-8">Enter a subject, and our AI will create a complete mini-course with chapters and a quiz for you instantly.</p>

        <form @submit.prevent="generateCourse">
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">What do you want to learn about?</label>
                <input 
                    v-model="subject" 
                    type="text" 
                    placeholder="e.g., Quantum Computing, History of Rome, Javascript Basics" 
                    class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    required
                />
            </div>
            
            <button 
                type="submit" 
                :disabled="loading" 
                class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span v-if="loading" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Magic...
                </span>
                <span v-else>Generate Course</span>
            </button>
        </form>
    </div>
  </div>
</template>
