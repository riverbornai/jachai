<template>
  <div v-if="isLoadingQuiz" class="max-w-screen min-h-[calc(100vh-14rem)]
 flex justify-center items-center transition-all duration-150 ease-in">
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
  <div v-else class="w-[100%] m-auto">
    <div class="w-[100%] sm:w-[768px] m-auto">
      <breadcrumb></breadcrumb>
    </div>
    <div class="bg-[#ffffff] w-[100%] sm:w-[768px] m-auto p-4 rounded-lg shadow">
      <div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button @click="showTimeEdit"
            class="flex justify-center items-center shadow-base px-3 py-2 rounded bg-white text-gray-800 hover:bg-gray-100 transition">
            <svg width="16" height="16" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.75 21C17.7206 21 21.75 16.9706 21.75 12C21.75 7.02944 17.7206 3 12.75 3C7.77944 3 3.75 7.02944 3.75 12C3.75 16.9706 7.77944 21 12.75 21Z"
                stroke="#0D2B22" stroke-width="2" />
              <path
                d="M17.25 12H13C12.9337 12 12.8701 11.9737 12.8232 11.9268C12.7763 11.8799 12.75 11.8163 12.75 11.75V8.5"
                stroke="#0D2B22" stroke-width="2" stroke-linecap="round" />
            </svg>
            <span class="ml-2 text-sm sm:text-base">Change Quiz Time</span>
          </button>
          <button @click="updateQuiz()"
            class="flex justify-center items-center text-white bg-[#0D2B22] px-3 py-2 rounded hover:bg-[#4325c1] transition">
            <span class="text-sm sm:text-base">
              {{ isUpdatingQuiz ? 'Saving....' : 'Save Changes' }}
            </span>
          </button>
        </div>

      </div>
      <div class="mt-4">
        <h2 v-if="!showTitle" @click="showTitleInput" class="py-2 text-[18px] font-bold text-[#454545]">
          Topic: {{ topic }}
        </h2>
        <input v-else v-model="topic" @blur="hideTitleInput" @keypress.enter="hideTitleInput"
          class="border-[#D0D0D0] border-solid border px-3 py-2 rounded-sm w-[100%]" type="text">

        <mcq-edit :questions="questions" :showAnswer="showAnswer"></mcq-edit>
      </div>
    </div>
    <div v-if="showTimeModal"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div class="sm:max-w-[480px] w-[95%] bg-white shadow-modal rounded-lg">
        <div class="p-6">
          <div class="flex justify-between">
            <div></div>
            <button @click="hideTimeEdit">❌</button>
          </div>
          <div>
            <h3 class="text-center text-[#0D2B22] text-[18px] font-medium">
              Set Custom Time
            </h3>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <input v-model="time" class="shadow px-2 py-2 font-light text-sm" type="number"
              placeholder="set your desired time " />
            <select class="shadow px-2 py-2" name="" id="">
              <option value="minutes">Minutes</option>
            </select>
          </div>

          <button @click="updateCustomTime" class="bg-[#0D2B22] mt-6 px-6 py-2 w-[100%] rounded text-[#fff]">
            {{ isUpdatingTime ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="showSuccessMessage"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div class="sm:max-w-[480px] w-[95%] bg-white shadow-modal rounded-lg">
        <div class="p-6">
          <div class="flex justify-between">
            <div></div>
            <button @click="hideSuccess">❌</button>
          </div>
          <div>
            <h3 class="text-center text-[#0D2B22] text-[18px] font-medium">
              Your Question has been successfully updated
            </h3>
          </div>
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
const store = useMainStore();
const { $axios, $toast } = useNuxtApp();
const route = useRoute();

const quizId = route.params.quiz_id;
const time = ref(0)
const showTimeModal = ref(false);
const showAnswer = ref(true);
const showTitle = ref(false);
const topic = ref('')
const questions = ref([]);
const isLoadingQuiz = ref(false)
const isUpdatingQuiz = ref(false)
const isUpdatingTime = ref(false)
const showSuccessMessage = ref(false)

onMounted(async () => {
  getQuiz()
});

function showTimeEdit() {
  showTimeModal.value = true
}
function hideTimeEdit() {
  showTimeModal.value = false;
}
function showTitleInput() {
  showTitle.value = true
}
function hideTitleInput() {
  showTitle.value = false
}
function hideSuccess() {
  showSuccessMessage.value = false
}
async function getQuiz() {
  try {
    isLoadingQuiz.value = true
    const res = await $axios.get(`/quiz/${quizId}`)
    topic.value = res.data.response.title
    questions.value = res.data.response.questions
    time.value = res.data.response.time
  } catch (error) {
    $toast(`${error}`)
  } finally {
    isLoadingQuiz.value = false
  }
}
async function updateQuiz() {
  try {
    isUpdatingQuiz.value = true
    const data = {
      time: time.value,
      questions: questions.value,
      title: topic.value
    }
    const res = await $axios.put(`/quiz/${quizId}`, { ...data })
    if (res.data.success) {
      $toast('Your quiz has been updated successfully')
    }
  } catch (error) {
    $toast(`${error}`)
  } finally {
    isUpdatingQuiz.value = false
  }
}

// Set custom time
async function updateCustomTime() {
  try {
    isUpdatingTime.value = true
    const data = {
      time: time.value,
      title: topic.value
    }
    const res = await $axios.put(`/quiz/${quizId}`, { ...data })
    if (res.data.success) {
      showTimeModal.value = false
      $toast('Your time has been updated successfully')
    }
  } catch (error) {
    $toast(`${error}`)
  } finally {
    isUpdatingTime.value = false
  }
}


</script>
<style scoped>
@media (min-width: 640px) {
  .col {
    grid-template-columns: 1fr 1.5fr;
  }
}

.shadow {
  box-shadow: 0px 3px 15px 2px #97badb40;
}

.shadow-select {
  box-shadow: 0px 2px 9px 0px #6b6b6b40;
  appearance: none;
  background-color: #fff;
}

.shadow-base {
  box-shadow: 0px 2px 10px 0px #6c6c6c40;
}

.position {
  bottom: calc(50vh - 170px);
  left: calc(50vw - 240px);
}
</style>
