
<script setup lang="ts">
const config = useRuntimeConfig()
const user = useSupabaseUser()
const client = useSupabaseClient()
const router = useRouter()

// Only allow access if logged in, otherwise send back to login
const { data: sessionData } = await client.auth.getSession()
const session = sessionData.session

if (!session) {
  router.push('/login')
}

// Use useFetch to call NestJS backend (only when we have a valid session)
const { data: courses, error, refresh } = await useFetch(`${config.public.backendUrl}/courses`, {
  headers: {
    Authorization: `Bearer ${session?.access_token}`,
  },
})

const logout = async () => {
    await client.auth.signOut()
    router.push('/login')
}
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Available Courses</h1>
      <div class="flex gap-4">
        <NuxtLink to="/generate-course" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            + Generate New Course
        </NuxtLink>
        <button @click="logout" class="text-gray-600 hover:text-gray-900">Logout</button>
      </div>
    </div>

    <div v-if="error" class="bg-red-100 p-4 rounded text-red-700 mb-4">
        Error loading courses: {{ error.message }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="course in courses" :key="course.id" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col">
        <h2 class="text-xl font-bold mb-2 text-indigo-900">{{ course.title }}</h2>
        <p class="text-sm text-gray-500 mb-1 font-medium">{{ course.subject }}</p>
        <p class="text-gray-700 mb-4 flex-grow">{{ course.description }}</p>
        <NuxtLink :to="`/courses/${course.id}`" class="text-indigo-600 font-semibold hover:underline mt-auto">
            Start Learning &rarr;
        </NuxtLink>
      </div>
    </div>
    
    <div v-if="courses?.length === 0" class="text-center py-12 text-gray-500">
        No courses found. Why not generate one?
    </div>
  </div>
</template>
