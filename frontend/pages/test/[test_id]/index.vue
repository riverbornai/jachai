<template>
  <div class="w-full h-full flex items-center justify-center sm:mt-0 pt-6 ">
    <template v-if="isFetchingQuiz">
      <div class="h-[70vh] rounded-lg flex flex-col justify-center items-center">
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
    </template>
    <template v-else>
      <template v-if="quizExists">
        <template v-if="quizeObject">
          <div class="flex items-center justify-center height">
            <div v-if="showStudentData && !isTimeUp" class="sm:w-[480px] w-[95%]  bg-white shadow rounded-lg">
              <div class="p-6">
                <h3 class="text-center text-[#0D2B22] font-semibold">
                  {{ quizeObject?.title }}
                </h3>
                <p class="text-center font-ligh mt-2">Time: {{ questionTime }} Minutes</p>
                <template>
                  <div v-for="(requirement, index) in requirements" :key="index">
                    <div v-if="requirement === 'email'" class="flex flex-col mt-3">
                      <label class="text-[#0D2B22]" for="roll">Email</label>
                      <input v-model="email" class="mt-1 border-[#0D2B22] border-solid border px-4 py-2 rounded"
                        type="email" @input="validateEmail" placeholder=" Input your Email.." />
                      <p class="text-[10px] text-gray-600 italic mt-2" v-if="message">{{ message }}</p>
                    </div>
                    <div v-if="requirement === 'phone'" class="flex flex-col mt-3">
                      <label class="text-[#0D2B22]" for="phone">Phone</label>
                      <input v-model="phoneNumber" class="mt-1 border-[#0D2B22] border-solid border px-4 py-2 rounded"
                        type="tel" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        placeholder="+8801500-000111" required />
                    </div>
                    <template v-if="isExamineNew">
                      <div v-if="requirement === 'name'" class="flex flex-col mt-3">
                        <label class="text-[#0D2B22]" for="name">Name</label>
                        <input v-model="name" class="mt-1 border-[#0D2B22] border-solid border px-4 py-2 rounded"
                          type="text" placeholder="Input your name.." />
                      </div>
                      <div v-if="requirement === 'roll'" class="flex flex-col mt-3">
                        <label class="text-[#0D2B22]" for="roll">Roll</label>
                        <input v-model="roll" class="mt-1 border-[#0D2B22] border-solid border px-4 py-2 rounded"
                          type="number" placeholder="Input your Roll.." />
                      </div>
                      <div v-if="requirement === 'session'" class="flex flex-col mt-3">
                        <label class="text-[#0D2B22]" for="roll">Session</label>
                        <input v-model="session" class="mt-1 border-[#0D2B22] border-solid border px-4 py-2 rounded"
                          placeholder="Input your session.." />
                      </div>
                      <div v-if="requirement === 'department'" class="flex flex-col mt-3">
                        <label class="text-[#0D2B22]" for="group">Department/Group</label>
                        <input v-model="department" class="mt-1 border-[#0D2B22] border-solid border px-4 py-2 rounded"
                          type="text" placeholder="Input your Department/Group.." />
                      </div>
                      <div v-if="requirement === 'address'" class="flex flex-col mt-3">
                        <label class="text-[#0D2B22]" for="group">Address</label>
                        <input v-model="address" class="mt-1 border-[#0D2B22] border-solid border px-4 py-2 rounded"
                          type="text" placeholder="Input your Adress.." />
                      </div>
                    </template>
                  </div>
                </template>

                <button @click="startQuiz()" class="bg-[#0D2B22]  mt-6 px-6 py-2 w-[100%] rounded text-[#fff]">
                  {{ isLoading ? 'Loading.....' : 'Start quiz' }}
                </button>
                <NuxtLink to="/" class="shadow-btn block text-center mt-4 px-6 py-2 w-[100%] rounded text-[ #0D2B22]">
                  Leave Quiz
                </NuxtLink>
              </div>
            </div>
            <div v-if="showQuizContent && !isTimeUp && !warningPopup"
              class="w-full min-h-screen flex items-center justify-center">
              <div class="bg-white w-full sm:w-[768px]  m-auto rounded-lg shadow flex flex-col h-[85vh] max-h-[800px]">
                <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 class="text-[18px] font-bold text-[#454545]">
                    Topic: {{ topic }}
                  </h2>
                  <div class="flex items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M15 1H9V3H15V1ZM11 14H13V8H11V14ZM19.03 7.39L20.45 5.97C20.02 5.46 19.55 4.98 19.04 4.56L17.62 5.98C16.0274 4.69818 14.0444 3.99953 12 4C7.03 4 3 8.03 3 13C3 17.97 7.02 22 12 22C13.6943 22.0009 15.3544 21.5232 16.7891 20.622C18.2238 19.7207 19.3748 18.4325 20.1094 16.9057C20.8441 15.379 21.1325 13.6758 20.9415 11.9923C20.7506 10.3087 20.088 8.71341 19.03 7.39ZM12 20C8.13 20 5 16.87 5 13C5 9.13 8.13 6 12 6C15.87 6 19 9.13 19 13C19 16.87 15.87 20 12 20Z"
                        fill="#0D2B22" />
                    </svg>
                    &nbsp;{{ formatTime(timeLeft) }}
                  </div>
                </div>

                <!-- Scrollable MCQ Content -->
                <div class="flex-grow overflow-y-auto">
                  <div class="p-4">
                    <mcq-sheet :questions="questions" :answers="answers" @updateAnswers="handleUpdateAnswers"
                      :questionType="questionType"></mcq-sheet>
                  </div>
                </div>

                <!-- Fixed Footer -->
                <div class="p-4 border-t border-gray-200">
                  <button @click="submitQuiz" class="bg-[#0D2B22] px-6 py-2 w-full rounded text-white">
                    {{ isSubmitting ? 'Submitting...' : 'Submit' }}
                  </button>
                </div>
              </div>
            </div>
            <div v-if="showTimeModal" class="height flex m-auto">
              <div class="sm:max-w-[480px] w-[95%] bg-white shadow rounded-lg m-auto mt-auto">
                <div class="p-6">
                  <div class="flex justify-between">
                    <p class="text-[#0D2B22]">Completing Time</p>
                    <p class="text-[#0D2B22]">{{ formatTime(time - timeLeft) }}</p>
                  </div>
                  <div class="px-8 py-8 mt-4">
                    <p v-if="quizeObject.resultType === 'notShow'" class="text-center text-[#454545] text-[18px]">
                      You have successfully submitted the answers on time. Your teacher/admin will present the result to
                      you later.
                      Thank you for participating.
                    </p>
                    <p v-else class="text-center text-[#454545] text-[18px]">
                      You have successfully submitted the answers on time. See your result now.
                    </p>
                  </div>

                  <a v-if="quizeObject.resultType === 'notShow'" :href="config.public.websiteUrl"
                    class="bg-[#0D2B22] flex justify-center mt-6 px-6 py-2 w-[100%] rounded text-[#fff]">
                    Go to Home
                  </a>
                  <NuxtLink v-else :to="`/test/${quizId}/${resultId}`"
                    class="flex justify-center bg-[#0D2B22] mt-6 px-6 py-2 w-[100%] rounded text-[#fff]">
                    View Result
                  </NuxtLink>
                </div>
              </div>
            </div>
            <div v-if="isTimeUp" class="sm:max-w-[480px] w-[95%] bg-white shadow rounded-lg m-auto mt-auto">
              <div class="p-6">
                <div class="flex justify-between">
                  <p class="text-[#0D2B22]">Time left</p>
                  <p class="text-[#0D2B22]">00:00</p>
                </div>
                <div class="px-8 py-8 mt-4">
                  <p v-if="quizeObject.resultType === 'notShow'" class="text-center text-[#454545] text-[18px]">
                    Your test time is up. Your teacher/admin will present the result to you later. Thank you for
                    participating.
                  </p>
                  <p v-else class="text-center text-[#454545] text-[18px]">
                    Your test time is up. See your result now.
                  </p>
                </div>
                <a v-if="quizeObject.resultType === 'notShow'" :href="config.public.websiteUrl"
                  class="bg-[#0D2B22] flex justify-center mt-6 px-6 py-2 w-[100%] rounded text-[#fff]">
                  Go to Home
                </a>
                <NuxtLink v-else :to="`/test/${quizId}/${resultId}`"
                  class="flex justify-center bg-[#0D2B22] mt-6 px-6 py-2 w-[100%] rounded text-[#fff]">
                  View Result
                </NuxtLink>
              </div>
            </div>
            <div v-if="warningPopup" class="height flex m-auto">
              <div class="sm:max-w-[480px] w-[95%] bg-white shadow rounded-lg m-auto mt-auto overflow-hidden">
                <div class="p-6">
                  <div class="px-8 py-8 mt-4">
                    <p class="text-center text-[#454545] text-[18px]">
                      You have already participated in this quiz. You can't participate again.
                    </p>
                  </div>
                  <a :href="config.public.websiteUrl"
                    class="bg-[#0D2B22] flex justify-center mt-6 px-6 py-2 w-[100%] rounded text-[#fff]">
                    Go to Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <div class="flex justify-center items-center h-[70vh]">
          <div class="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold boujee-text mb-4">Quiz Not Available</h2>
            <p class="text-gray-600">This quiz doesn't exist or you don't have permission to view it.</p>
            <NuxtLink to="/" class="mt-6 inline-block bg-[#0D2B22] px-6 py-2 rounded text-white hover:bg-[#355573]">
              Go to Home
            </NuxtLink>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "test",
});

import { onMounted } from "vue";
import { useMainStore } from "~/stores/index.js";
const config = useRuntimeConfig();
const store = useMainStore();
const { $axios, $toast } = useNuxtApp();
const route = useRoute();

const time = ref(0);
const timeLeft = ref(null);
const showTimeModal = ref(false);
const interval = ref(null);
const isTimeUp = ref(false);
const showStudentData = ref(true);
const showQuizContent = ref(false);
const topic = ref('');
const questions = ref([]);
const requirements = ref([]);
const name = ref('');
const roll = ref(0);
const phoneNumber = ref('')
const email = ref('')
const session = ref('');
const department = ref('');
const resultId = ref('');
const quizId = route.params.test_id
const quizeObject = ref({});
const student = ref({});
const answers = ref([]);
const isSubmitting = ref(false);
const questionTime = ref(0)
const completingTime = ref(0);
const questionType = ref('');
const address = ref('');
const isLoading = ref(false)
const isFetchingQuiz = ref(false)
const participantId = ref('')
const submission_id = ref('');
const warningPopup = ref(false);
const message = ref('')
const quizExists = ref(true);
const isExamineNew = ref(false);

// Falls back to a persisted per-browser id when a quiz doesn't collect
// phone/email at all, so submissions never hit the API with an empty
// identifier (identifier is required to be non-empty/unique).
const identifier = computed(() => {
  return extractLast11Digits(phoneNumber.value) || email.value || store.creatorId;
});


onMounted(async () => {
  console.log(route.params)
  getQuiz()
});

async function startQuiz() {
  isLoading.value = true
  try {
    const ready = await handlePublicQuiz();
    if (ready) {
      showStudentData.value = false;
      showQuizContent.value = true;
      startTimer();
    }
    // if not ready, isExamineNew is now true and the info form has been
    // revealed below — no error, the user just needs to fill it in and
    // click "Start quiz" again.
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

// Returns true once the participant is confirmed and the quiz can start.
// Returns false on a brand-new participant's first click, after silently
// revealing the name/roll/etc. form (isExamineNew) — this is not an error.
async function handlePublicQuiz() {
  if (isExamineNew.value) {
    await createNewParticipant();
    await submitQuizResult();
    return true;
  }

  const { data: studentData } = await $axios.get(`/participants/${quizId}/${identifier.value}`);
  if (studentData.participant) {
    participantId.value = studentData.participant.uid;
    await submitQuizResult();
    return true;
  }

  if (studentData.error === 'Participant not found') {
    isExamineNew.value = true;
    return false;
  }

  showStudentData.value = false;
  warningPopup.value = true;
  throw new Error('You have already participated in this quiz. You can\'t participate again.');
}

async function createNewParticipant() {
  student.value = {
    name: name.value,
    identifier: identifier.value,
    session: session.value,
    department: department.value,
    address: address.value
  };
  const responseParticipant = await $axios.post(`/participants`, student.value);
  participantId.value = responseParticipant.data.participant.uid;
}

async function submitQuizResult() {
  console.log('submitQuizResult function ', participantId.value)
  const data = {
    quizId: quizId,
    participantId: participantId.value,
  };
  console.log(data, 'response')
  const res = await $axios.post(`/submit-result`, data);
  console.log(res.data, 'final')
  if (res.data.error) {
    throw new Error(res.data.error);
  }
  resultId.value = res.data.response.uid;
  isLoading.value = false;

}

function handleError(error) {
  console.error('Error in startQuiz:', error);
  $toast(error.message || 'An error occurred');
}

async function getQuiz() {
  isFetchingQuiz.value = true;
  try {
    const res = await $axios.get(`/test/${quizId}`);
    if (res.data.response) {
      topic.value = res.data.response.title;
      questions.value = res.data.response.questions;
      requirements.value = res.data.response.requirements;
      quizeObject.value = res.data.response;
      time.value = res.data.response.time * 60;
      questionTime.value = res.data.response.time;
      questionType.value = res.data.response.type;
    } else {
      quizExists.value = false;
    }
  } catch (error) {
    console.error('Error fetching quiz:', error);
    $toast(`Error: ${error.message || 'Failed to fetch quiz'}`);
    quizExists.value = false;
  }
  isFetchingQuiz.value = false;
}

function startTimer() {
  if (interval.value) {
    clearInterval(interval.value); // Clear any existing interval first
  }
  timeLeft.value = time.value;
  interval.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(interval.value);
      isTimeUp.value = true;
    }
  }, 1000);
}
function formatTime(seconds) {
  if (seconds === null) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes < 10 ? '0' + minutes : minutes}:${secs < 10 ? '0' + secs : secs}`;
}
function handleUpdateAnswers(newAnswer) {
  console.log(newAnswer, 'new answer')
  const existingAnswerIndex = answers.value.findIndex(ans => ans.id === newAnswer.id);

  if (questionType.value === 'multiple') {
    if (existingAnswerIndex === -1) {

      answers.value.push(newAnswer);
    } else {

      answers.value[existingAnswerIndex] = newAnswer;
    }
  } else {
    if (existingAnswerIndex === -1) {
      answers.value.push(newAnswer);
    } else {
      answers.value[existingAnswerIndex] = newAnswer;
    }

  }
}


async function submitQuiz() {
  isSubmitting.value = true
  try {
    clearInterval(interval.value);
    completingTime.value = time.value - timeLeft.value


    questions.value.forEach(question => {
      const result = answers.value.find(result => result.id === question.id);
      if (result) {
        question.answers = result.answers;
        question.selectedOptions = result.selectedOptions;

      } else {
        question.selectedOptions = [];
      }
    });

    const data = {
      questions: toRaw(questions.value),
      timeTaken: Number(completingTime.value)
    }
    console.log(resultId.value, 'result')
    const res = await $axios.put(`/results/${resultId.value}`, data)
    if (res?.data?.response?.uid) {
      submission_id.value = res?.data.response.uid
      $toast('Your quiz test has been submitted successfully')
    } else {
      $toast('Your quiz test has been submitted successfully')
    }

  } catch (error) {
    console.log(error, 'error')
    $toast(`${error}`)

  }
  isSubmitting.value = false
  showQuizContent.value = false
  showTimeModal.value = true


}

function extractLast11Digits(str) {
  const digitsOnly = str.replace(/\D/g, '');
  return digitsOnly.slice(-11);
}
const validateEmail = () => {
  const pattern = /^[\w.-]+@[\w.-]+\.\w+$/
  if (!pattern.test(email.value)) {
    message.value = `${email.value} is not a valid email address.`
  } else {
    message.value = ''
  }
}
function closeWarning() {
  warningPopup.value = false
  navigateTo('/')
}


watch(email, validateEmail)


</script>

<style scoped>
.shadow {
  box-shadow: 0px 3px 15px 2px #97badb40;
}

.shadow-btn {
  box-shadow: 0px 2px 10px 0px #6c6c6c40;
}

.height {
  height: calc(100vh - 176px);
}

.min-h-screen {
  height: calc(100vh - 176px);
}
</style>