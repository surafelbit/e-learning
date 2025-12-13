
<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const client = useSupabaseClient()

const courseId = route.params.id as string
const activeTab = ref(0) // 0-3 for pages, 4 for quiz
const answers = ref<Record<string, string>>({})
const score = ref<number | null>(null)
const speaking = ref(false)

const { data: course, error } = await useFetch(`${config.public.backendUrl}/courses/${courseId}`, {
    headers: {
        Authorization: `Bearer ${(await client.auth.getSession()).data.session?.access_token}`
    }
})

// TTS Implementation
const speak = (text: string) => {
    if ('speechSynthesis' in window) {
        if (speaking.value) {
            window.speechSynthesis.cancel()
            speaking.value = false
            return
        }
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.onend = () => { speaking.value = false }
        window.speechSynthesis.speak(utterance)
        speaking.value = true
    } else {
        alert('Text-to-speech not supported in this browser.')
    }
}

const submitQuiz = () => {
    let correctCount = 0
    course.value.questions.forEach((q: any) => {
        const selected = answers.value[q.id]
        const correct = q.question_options.find((o: any) => o.is_correct).id
        if (selected === correct) correctCount++
    })
    score.value = correctCount
}

const nextTab = () => {
    if (activeTab.value < 4) activeTab.value++
}

const resetQuiz = () => {
    score.value = null
    answers.value = {}
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 md:p-12">
    <NuxtLink to="/courses" class="text-gray-500 hover:underline mb-4 inline-block">&larr; Back to Courses</NuxtLink>
    
    <div v-if="error" class="bg-red-100 p-4 rounded text-red-700">
        Error loading course: {{ error.message }}
    </div>

    <div v-if="course" class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-indigo-700 text-white p-8">
            <h1 class="text-3xl font-bold mb-2">{{ course.title }}</h1>
            <p class="opacity-90">{{ course.description }}</p>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex border-b overflow-x-auto">
            <button 
                v-for="(page, index) in course.pages" 
                :key="page.id"
                @click="activeTab = index"
                class="px-6 py-4 font-medium focus:outline-none transition whitespace-nowrap"
                :class="activeTab === index ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'"
            >
                Chapter {{ index + 1 }}
            </button>
            <button 
                @click="activeTab = course.pages.length"
                class="px-6 py-4 font-medium focus:outline-none transition whitespace-nowrap"
                 :class="activeTab === course.pages.length ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'"
            >
                Assessment
            </button>
        </div>

        <!-- Content Area -->
        <div class="p-8 min-h-[400px]">
            <!-- Pages -->
            <div v-if="activeTab < course.pages.length">
                <div class="flex justify-between items-start mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">{{ course.pages[activeTab].title }}</h2>
                     <button @click="speak(course.pages[activeTab].content_md)" class="text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded border border-indigo-200 flex items-center gap-2">
                        <span v-if="speaking">🛑 Stop Listening</span>
                        <span v-else>🔊 Listen</span>
                    </button>
                </div>
                <div class="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {{ course.pages[activeTab].content_md }}
                </div>
                
                <div class="mt-8 flex justify-end">
                    <button @click="nextTab" class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                        Next &rarr;
                    </button>
                </div>
            </div>

            <!-- Quiz -->
            <div v-else>
                <div v-if="score === null">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800">Knowledge Check</h2>
                    <div v-for="(q, idx) in course.questions" :key="q.id" class="mb-8 p-4 border rounded bg-gray-50">
                        <p class="font-semibold text-lg mb-4">{{ idx + 1 }}. {{ q.question_text }}</p>
                        <div class="space-y-2">
                            <div v-for="opt in q.question_options" :key="opt.id" class="flex items-center">
                                <input 
                                    type="radio" 
                                    :name="q.id" 
                                    :id="opt.id" 
                                    :value="opt.id" 
                                    v-model="answers[q.id]"
                                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <label :for="opt.id" class="ml-3 block text-gray-700 cursor-pointer">
                                    {{ opt.option_text }}
                                </label>
                            </div>
                        </div>
                    </div>
                     <button 
                        @click="submitQuiz" 
                        :disabled="Object.keys(answers).length < course.questions.length"
                        class="bg-indigo-600 text-white px-8 py-3 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                    >
                        Submit Answers
                    </button>
                </div>

                <!-- Results -->
                <div v-else class="text-center py-10">
                     <h2 class="text-3xl font-bold mb-4" :class="score === course.questions.length ? 'text-green-600' : 'text-indigo-600'">
                        You scored {{ score }} / {{ course.questions.length }}
                    </h2>
                    <p class="text-gray-600 mb-8 text-lg">
                        {{ score === course.questions.length ? 'Perfect score! master! 🎉' : 'Keep learning and try again! 💪' }}
                    </p>
                    <button @click="resetQuiz" class="text-indigo-600 hover:underline">Retake Quiz</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
