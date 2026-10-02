<template>
  <div class="pb-8">
    <div class="sm:max-w-[1200px] mx-auto w-[95%] sm:w-[100%]">
      <div class="sm:px-[25px] w-[100%]sm:py-[40px] px-[20px] py-[15px] rounded-md flex items-center justify-center"
        v-if="isLoading" style="height:calc(100vh - 14rem)">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" viewBox="0 0 200 200">
          <circle fill="#1A4435" stroke="#1A4435" stroke-width="6" r="15" cx="40" cy="100">
            <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite" begin="-.4"></animate>
          </circle>
          <circle fill="#1A4435" stroke="#1A4435" stroke-width="6" r="15" cx="100" cy="100">
            <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite" begin="-.2"></animate>
          </circle>
          <circle fill="#1A4435" stroke="#1A4435" stroke-width="6" r="15" cx="160" cy="100">
            <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite" begin="0"></animate>
          </circle>
        </svg>
      </div>
      <template v-else>
        <breadcrumb></breadcrumb>

        <div class="inline-block  sm:grid grid-cols justify-center sm:w-[100%] sm:gap-10 pt-2">

          <div class="box-size bg-white sm:px-[25px] w-[100%]sm:py-[40px] px-[20px] py-[15px] rounded-md">
            <h1 class="py-2 text-xl font-bold text-[#454545]">
              {{ topic }}
            </h1>
            <div v-for="(question, index) in questions" :key="index" class="flex flex-col sm:gap-2 gap-2">
              <div class="py-2">
                <h4 class="text-[#5E5E5E] font-medium"><span class="font-bold">{{ index + 1 }}.</span> {{
                  question.question }}</h4>
                <div class="grid sm:grid-cols-2 sm:gap-3 mt-2 sm:mb-3 mb-1">
                  <div v-for="option in question.options" :key="option"
                    class="m-1 flex items-center gap-3 border-2 text-[16px] sm:mb-1 mb-2 border-[#D0D0D0] rounded-md sm:p-2 p-2">
                    <p>
                      {{ option }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="sm:mt-0 mt-8 ">
            <div class="flex flex-col sm:gap-10 sm:sticky">
              <!-- First Box -->
              <div class="bg-white box-size sm:max-w-[100%] w-full px-8 py-4 rounded-md sm:mb-0 mb-6">
                <p class="py-2 text-[18px] font-medium text-[#454545]">
                  Quiz Details
                </p>
                <div class="mb-4">
                  <table class="min-w-full bg-white rounded-lg overflow-hidden">
                    <tbody class="text-gray-600 border">
                      <tr class="border-b border-gray-200 hover:bg-gray-100">
                        <td class="py-3 px-4">Type</td>
                        <td class="py-3 px-4">{{ isPublic ? "Public" : "Private" }}</td>
                      </tr>
                      <tr class="border-b border-gray-200 hover:bg-gray-100">
                        <td class="py-3 px-4">Show Result</td>
                        <td class="py-3 px-4">{{ resultType == 'immediately' ? "Immediately" : "Don't Show" }}</td>
                      </tr>
                      <tr class="border-b hover:bg-gray-100">
                        <td class="py-3 px-4">Difficulty Level</td>
                        <td class="py-3 px-4">{{ difficulty }}</td>
                      </tr>
                      <tr class="border-b hover:bg-gray-100">
                        <td class="py-3 px-4">Created At</td>
                        <td class="py-3 px-4">{{ prettyDate(createdAt) }}</td>
                      </tr>
                      <tr class="border-b hover:bg-gray-100">
                        <td class="py-3 px-4">Updated At</td>
                        <td class="py-3 px-4">{{ prettyDate(updatedAt) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <!-- Second box -->
              <div v-if="isPublic" class="bg-white box-size sm:max-w-[100%] w-full px-8 py-4 rounded-md">
                <p class="py-2 text-[18px] font-medium text-[#454545]">
                  Submissions
                </p>
                <p class="text-[#454545] text-[16px] font-normal mb-4">
                  {{ totalAnswerSubmitted }} answers submitted!
                </p>
                <NuxtLink :to="`/quiz/${quizId}/submissions`"
                  class="block items-center text-center w-full shadow-sm px-4 py-3 bg-[#0D2B22] rounded-md text-[#fff] mb-4">
                  <span>View All Submissions</span>
                </NuxtLink>
              </div>
              <div v-else-if="totalAnswerSubmitted"
                class="bg-white box-size sm:max-w-[100%] w-full px-8 py-4 rounded-md">
                <p class="py-2 text-[18px] font-medium text-[#454545]">
                  Submissions
                </p>
                <p class="text-[#454545] text-[16px] font-normal mb-4">
                  You have taken this quiz!
                </p>
                <NuxtLink :to="`/quiz/${quizId}/submissions/${firstSubmissionId}`"
                  class="block items-center text-center w-full shadow-sm px-4 py-3 bg-[#0D2B22] rounded-md text-[#fff] mb-4">
                  <span>View Your Result</span>
                </NuxtLink>
              </div>
              <div v-else class="bg-white box-size sm:max-w-[100%] w-full px-8 py-4 rounded-md">
                <p class="py-2 text-[18px] font-medium text-[#454545]">
                  Submissions
                </p>
                <p class="text-[#454545] text-[16px] font-normal mb-4">
                  You didn't take this quiz yet!
                </p>
                <NuxtLink :to="`/test/${quizId}`"
                  class="block items-center text-center w-full shadow-sm px-4 py-3 bg-[#0D2B22] rounded-md text-[#fff] mb-4">
                  <span>Take This Quiz</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: "app",
  });

  import { onMounted } from "vue";
  import { useMainStore } from "~/stores/index.js";
  const store = useMainStore();
  const route = useRoute();
  const { $axios, $toast } = useNuxtApp();
  const quizId = route.params.quiz_id
  const topic = ref('')
  const resultType = ref('');
  const createdAt = ref('');
  const updatedAt = ref('');
  const totalTime = ref('');
  const type = ref('');
  const difficulty = ref('');
  const isPublic = ref('');
  const questions = ref([]);
  const totalAnswerSubmitted = ref(0);
  const firstSubmissionId = ref('')
  const isLoading = ref(false)

  onMounted(async () => {
    isLoading.value = true
    await Promise.all([getQuiz(), getResults()])
    isLoading.value = false
  });

  async function getQuiz() {
    try {
      const { data: { response } } = await $axios.get(`/quiz/${quizId}`)
      topic.value = response.title
      questions.value = response.questions
      resultType.value = response.resultType
      createdAt.value = response.createdAt
      updatedAt.value = response.updatedAt
      totalTime.value = response.time
      type.value = response.type
      difficulty.value = response.difficulty
      isPublic.value = response.isPublic
    } catch (error) {
      $toast(`${error}`)
    }
  }

  async function getResults() {
    try {
      const res = await $axios.get(`/results/quiz/${store.creatorId}/${quizId}`)
      totalAnswerSubmitted.value = res.data.response.total
      if (totalAnswerSubmitted.value) {
        firstSubmissionId.value = res.data.response.response[0].uid
      }
    } catch (error) {
      $toast(`${error}`)
    }
  }
</script>

<style scoped>
  @media (min-width: 640px) {
    .grid-cols {
      grid-template-columns: 2fr 1fr;
    }
  }

  .box-size {
    box-sizing: border-box;
    box-shadow: 0px 3px 15px 2px #97badb40;
  }

  .shadow-sm {
    box-shadow: 0px 2px 9px 0px #6b6b6b40;
  }
</style>
