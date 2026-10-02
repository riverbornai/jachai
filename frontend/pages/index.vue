<template>
  <div class="gap-10 w-[100%] sm:w-[100%]">
    <div class="shadow bg-white sm:p-8 p-4 rounded-md gap-8 flex flex-col sm:flex-row items-center">
      <div class="w-[100%] flex flex-col justify-center">
        <h2 class="text-[#0D2B22] text-[20px] font-semibold">
          Welcome,
        </h2>
        <p class="my-4 text-[#676767] font-normal">
          Start creating quizzes in just one tap!
        </p>
        <NuxtLink to="/quiz/create" class="block text-center mt-4 bg-[#0D2B22] w-[100%] py-2 rounded-md text-[#fff]">
          Create Quiz
        </NuxtLink>
      </div>
      <div class="w-[100%] hidden sm:flex justify-center items-center mt-4 sm:mt-0">
        <img class="object-cover" src="../static/quiz-welcome-graphic.png" alt="quiz-welcome-graphic" />
      </div>
    </div>
    <div class="shadow mt-10 bg-white p-4 sm:p-8 rounded-md">
      <h3 class="text-[#0D2B22] text-lg font-medium text-ellipsis">Recent Quizzes</h3>
      <div v-if="isLoadingData" class="h-[100%] flex flex-row items-center  justify-center  mt-4">
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
      <div v-else-if="latestQuizzes.length === 0">
        <p class="h-[100%] flex flex-row items-center text-gray-600 justify-center  mt-4">
          No quizzes have been generated yet.</p>
      </div>
      <div v-else class="flex sm:items-center items-start flex-col sm:grid grid-cols-3 gap-4  shadow-1 px-4 py-4 mt-4"
        v-for="quize in quizzes" :key="quize.uid">
        <h3 class="text-[#484848] text-md font-medium">{{ quize.title }}</h3>

        <div class="flex items-center gap-4">
          <p class="rounded-md py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm justify-center items-center"
            :class="quize.isPublic ? 'bg-purple-600' : 'bg-amber-600'">
            <span v-if="quize.isPublic">Public</span>
            <span v-else>Private</span>
          </p>
          <p class="rounded-md capitalize py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm"
            :class="quize.type === 'multiple' ? 'bg-teal-600' : 'bg-blue-600'">
            {{ quize.type }} </p>
          <p
            class="text-sm rounded-md py-0.5 whitespace-nowrap	 px-2.5 border border-transparent text-[#000] transition-all shadow-sm justify-center items-center">
            📅 {{ prettyDate(quize.createdAt) }}
          </p>
        </div>
        <div class="flex flex-row justify-end items-center gap-2">
          <NuxtLink :to="`/quiz/${quize.uid}`"
            class="flex items-center text-sm shadow-1 bg-[#FFFFFF] px-2 py-1 rounded">
            <svg height="16" width="16" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 4.30011C9.33695 4.30011 8.70107 4.5635 8.23223 5.03234C7.76339 5.50118 7.5 6.13707 7.5 6.80011C7.5 7.46315 7.76339 8.09904 8.23223 8.56788C8.70107 9.03672 9.33695 9.30011 10 9.30011C10.663 9.30011 11.2989 9.03672 11.7678 8.56788C12.2366 8.09904 12.5 7.46315 12.5 6.80011C12.5 6.13707 12.2366 5.50118 11.7678 5.03234C11.2989 4.5635 10.663 4.30011 10 4.30011ZM10 10.9668C8.89493 10.9668 7.83512 10.5278 7.05372 9.74639C6.27232 8.96499 5.83333 7.90518 5.83333 6.80011C5.83333 5.69504 6.27232 4.63523 7.05372 3.85383C7.83512 3.07243 8.89493 2.63344 10 2.63344C11.1051 2.63344 12.1649 3.07243 12.9463 3.85383C13.7277 4.63523 14.1667 5.69504 14.1667 6.80011C14.1667 7.90518 13.7277 8.96499 12.9463 9.74639C12.1649 10.5278 11.1051 10.9668 10 10.9668ZM10 0.55011C5.83333 0.55011 2.27499 3.14178 0.833328 6.80011C2.27499 10.4584 5.83333 13.0501 10 13.0501C14.1667 13.0501 17.725 10.4584 19.1667 6.80011C17.725 3.14178 14.1667 0.55011 10 0.55011Z"
                fill="#0D2B22" />
            </svg>

          </NuxtLink>
          <button v-if="quize.isPublic" @click="copyQuizLink(quize.uid)"
            class="flex items-center text-sm shadow-1 bg-[#FFFFFF] px-2 py-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" width="16px" height="16px" viewBox="-1 0 26 26"
              version="1.1">

              <title>share</title>
              <desc>Created with Sketch Beta.</desc>
              <defs>

              </defs>
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-312.000000, -726.000000)"
                  fill="#000000">
                  <path
                    d="M331,750 C329.343,750 328,748.657 328,747 C328,745.343 329.343,744 331,744 C332.657,744 334,745.343 334,747 C334,748.657 332.657,750 331,750 L331,750 Z M317,742 C315.343,742 314,740.657 314,739 C314,737.344 315.343,736 317,736 C318.657,736 320,737.344 320,739 C320,740.657 318.657,742 317,742 L317,742 Z M331,728 C332.657,728 334,729.343 334,731 C334,732.657 332.657,734 331,734 C329.343,734 328,732.657 328,731 C328,729.343 329.343,728 331,728 L331,728 Z M331,742 C329.23,742 327.685,742.925 326.796,744.312 L321.441,741.252 C321.787,740.572 322,739.814 322,739 C322,738.497 321.903,738.021 321.765,737.563 L327.336,734.38 C328.249,735.37 329.547,736 331,736 C333.762,736 336,733.762 336,731 C336,728.238 333.762,726 331,726 C328.238,726 326,728.238 326,731 C326,731.503 326.097,731.979 326.235,732.438 L320.664,735.62 C319.751,734.631 318.453,734 317,734 C314.238,734 312,736.238 312,739 C312,741.762 314.238,744 317,744 C318.14,744 319.179,743.604 320.02,742.962 L320,743 L326.055,746.46 C326.035,746.64 326,746.814 326,747 C326,749.762 328.238,752 331,752 C333.762,752 336,749.762 336,747 C336,744.238 333.762,742 331,742 L331,742 Z"
                    id="share" sketch:type="MSShapeGroup">

                  </path>
                </g>
              </g>
            </svg>
          </button>
          <NuxtLink v-else :to="`/test/${quize.uid}`" class="flex items-center text-[12px] shadow-1 px-2 py-1 rounded">
            🔗
          </NuxtLink>
          <NuxtLink :to="`/quiz/${quize.uid}/edit`"
            class="flex items-center bg-[#0D2B22] px-2 py-1 text-[#fff] rounded text-sm shadow-1">
            <svg width="16" height="16" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.8333 3.30011C11.0457 3.30035 11.25 3.38168 11.4045 3.52748C11.5589 3.67329 11.6519 3.87257 11.6643 4.08461C11.6768 4.29664 11.6078 4.50543 11.4714 4.6683C11.3351 4.83118 11.1417 4.93586 10.9308 4.96094L10.8333 4.96678H4.16667V16.6334H15.8333V9.96678C15.8336 9.75438 15.9149 9.55008 16.0607 9.39564C16.2065 9.24119 16.4058 9.14825 16.6178 9.1358C16.8299 9.12335 17.0386 9.19234 17.2015 9.32866C17.3644 9.46499 17.4691 9.65836 17.4942 9.86928L17.5 9.96678V16.6334C17.5001 17.0539 17.3413 17.4589 17.0554 17.7672C16.7695 18.0756 16.3776 18.2644 15.9583 18.2959L15.8333 18.3001H4.16667C3.74619 18.3002 3.34119 18.1414 3.03288 17.8555C2.72456 17.5696 2.5357 17.1777 2.50417 16.7584L2.5 16.6334V4.96678C2.49987 4.5463 2.65867 4.1413 2.94458 3.83299C3.23049 3.52467 3.62237 3.33581 4.04167 3.30428L4.16667 3.30011H10.8333ZM16.0358 3.58594C16.1858 3.43649 16.387 3.34972 16.5987 3.34325C16.8103 3.33679 17.0164 3.41112 17.1752 3.55115C17.334 3.69118 17.4336 3.8864 17.4537 4.09717C17.4737 4.30794 17.4128 4.51845 17.2833 4.68594L17.2142 4.76511L8.96417 13.0143C8.8142 13.1637 8.61297 13.2505 8.40135 13.257C8.18972 13.2634 7.98357 13.1891 7.82477 13.0491C7.66596 12.909 7.56641 12.7138 7.54633 12.503C7.52626 12.2923 7.58716 12.0818 7.71667 11.9143L7.78583 11.8359L16.0358 3.58594Z"
                fill="white" />
            </svg>

          </NuxtLink>
          <button @click="showDeleteConfirmation(quize.uid, quize)"
            class="flex items-center bg-[#FF5656] px-2 py-1 text-[#fff] rounded text-sm shadow-1">
            <svg width="16" height="16" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.6668 2.96674C14.8878 2.96674 15.0997 3.05453 15.256 3.21081C15.4123 3.36709 15.5001 3.57906 15.5001 3.80007C15.5001 4.02108 15.4123 4.23304 15.256 4.38932C15.0997 4.5456 14.8878 4.6334 14.6668 4.6334H13.8334L13.8309 4.69257L13.0534 15.5851C13.0235 16.0056 12.8353 16.3991 12.5269 16.6864C12.2184 16.9737 11.8125 17.1334 11.3909 17.1334H4.60842C4.18687 17.1334 3.78098 16.9737 3.4725 16.6864C3.16401 16.3991 2.97585 16.0056 2.94592 15.5851L2.16842 4.6934L2.16676 4.6334H1.33342C1.11241 4.6334 0.900449 4.5456 0.744169 4.38932C0.587889 4.23304 0.500092 4.02108 0.500092 3.80007C0.500092 3.57906 0.587889 3.36709 0.744169 3.21081C0.900449 3.05453 1.11241 2.96674 1.33342 2.96674H14.6668ZM9.66676 0.466736C9.88777 0.466736 10.0997 0.554533 10.256 0.710813C10.4123 0.867094 10.5001 1.07906 10.5001 1.30007C10.5001 1.52108 10.4123 1.73304 10.256 1.88932C10.0997 2.04561 9.88777 2.1334 9.66676 2.1334H6.33342C6.11241 2.1334 5.90045 2.04561 5.74417 1.88932C5.58789 1.73304 5.50009 1.52108 5.50009 1.30007C5.50009 1.07906 5.58789 0.867094 5.74417 0.710813C5.90045 0.554533 6.11241 0.466736 6.33342 0.466736H9.66676Z"
                fill="white" />
            </svg>
          </button>
        </div>

      </div>
    </div>
    <div v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:px-0 px-4">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold mb-4 text-center">Confirm Deletion</h3>
        <p class="mb-4">Are you sure you want to delete this quiz?</p>
        <div class="flex justify-end space-x-2">
          <button @click="cancelDelete" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button @click="deleteQuiz(selectedQuizId, quizToDelete)" class="px-4 py-2 bg-red-500 text-white rounded">{{
            quizToDelete.isDeleting ? 'Deleting..' : 'Delete' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "app",
});

import { onMounted } from "vue";
import { useMainStore } from "~/stores/index.js";

const { $axios, $toast } = useNuxtApp();
const store = useMainStore();
const isLoadingData = ref(true);
const quizzes = ref([]);
const showDeleteModal = ref(false);
const quizToDelete = ref({});
const selectedQuizId = ref(null)

onMounted(async () => {
  getQuizes()
});

function showDeleteConfirmation(quizId, quiz) {
  selectedQuizId.value = quizId;
  quizToDelete.value = quiz
  showDeleteModal.value = true;
}

function cancelDelete() {
  showDeleteModal.value = false;
  quizToDelete.value = null;
  selectedQuizId.value = null
}
async function getQuizes() {
  isLoadingData.value = true
  try {
    const res = await $axios.get(`/quiz?userId=${store.creatorId}&limit=10&sorting=newest&pageNumber=1`)
    quizzes.value = res.data.response.map(quiz => ({
      ...quiz,
      isDeleting: false
    }));
  } catch (error) {
    $toast(`${error}`)
  }

  isLoadingData.value = false
}
async function deleteQuiz(quizId, selectedQuiz) {

  selectedQuiz.isDeleting = true

  try {
    const index = quizzes.value.findIndex(quiz => quiz.uid === quizId)
    if (index !== -1) {
      quizzes.value.splice(index, 1)
    }
    const res = await $axios.delete(`/quiz/${quizId}`)
    if (res) {
      showDeleteModal.value = false;
      $toast('Your selected quiz has been deleted successfully')

    }
  } catch (error) {
    $toast(`${error}`)
  }
  selectedQuiz.isDeleting = false

}

const latestQuizzes = computed(() => quizzes.value.slice(-5));

function copyQuizLink(quizId) {

  navigator.clipboard.writeText(`${window.location.origin}/test/${quizId}`)
    .then(() => {
      $toast('Link copied to clipboard')

    })
    .catch((err) => {
      $toast(`'Failed to copy the link: ', ${err}`);
    });
}
</script>

<style scoped>
.shadow {
  box-shadow: 0px 3px 15px 0px #97badb40;
}

.shadow-1 {
  box-shadow: 0px 2px 10px 0px #6c6c6c40;
}
</style>
