<template>
  <div class="w-[100%] my-auto">
    <div v-if="isLoadingAnswer"
      class="w-[100%] lg:w-[768px] m-auto p-4 rounded-lg min-h-[600px] flex flex-col justify-center items-center">
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
      <div class="w-[100%] lg:w-[768px] m-auto">
        <breadcrumb></breadcrumb>
      </div>

      <div v-if="answer" class="bg-[#ffffff] w-[100%] lg:w-[768px] m-auto p-4 rounded-lg shadow">
        <div class="my-4 text-center">
          <h2 class="text-[#0D2B22] text-2xl font-medium">
            {{ answer?.title }}
          </h2>
        </div>
        <div class="mt-3">
          <table class="min-w-full bg-white rounded-lg overflow-hidden">
            <tbody class="text-gray-600 border">
              <tr v-for="(value, key) in answer.participant" :key="key"
                class="border-b border-gray-200 hover:bg-gray-100">
                <template v-if="key !== 'id' && key !== 'uid' && value !== '' && value !== null">
                  <th class="py-2 sm:px-4 px-0 text-left capitalize">{{ key }}:</th>
                  <td class="py-2 sm:px-4 px-0">{{ value }}</td>
                </template>

              </tr>
            </tbody>
          </table>

          <div class="flex justify-between items-center mt-4">

            <p> Subtotal Score: <span class="font-semibold">{{ answer.subScore }}</span></p>
            <p> Total Negative score: <span class="font-semibold">{{ answer.negativeScore }}</span></p>
            <p v-if="answer">
              Total Score:
              <span class="font-semibold">{{ answer.finalScore
                }}/{{ answer.totalMarks }}</span>
            </p>

          </div>
          <div class="flex justify-between items-center mt-4">
            <p>Time Taken: <span class="font-semibold">{{ secondsToMinutes(timeTaken) }}</span> Minutes</p>
            <button @click="showDownloadPopup"
              class="bg-[#0D2B22] flex justify-center items-center px-2 py-[4px] text-sm rounded text-[#f4f4f4]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9H15V3H9V9H5L12 17L19 9ZM4 19H20V21H4V19Z" fill="#fff" />
              </svg>
              &nbsp; <span>Download</span>
            </button>
          </div>
          <answer-sheet v-if="answer.questions" :questions="answer.questions"></answer-sheet>
        </div>
        <div v-if="showDownloadModal"
          class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div class="sm:max-w-[480px] w-[95%] bg-white shadow-modal rounded-lg">
            <div class="p-6">
              <div class="flex justify-between">
                <div></div>
                <button @click="hideDownloadPopup">❌</button>
              </div>
              <div class="flex justify-center">
                <button class="border-none outline-none">
                  <svg width="45" height="51" viewBox="0 0 65 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M32.5 0.0839844C31.5607 0.0839844 30.6599 0.457123 29.9957 1.12131C29.3315 1.78551 28.9583 2.68634 28.9583 3.62565V10.709H7.70833C5.82972 10.709 4.02804 11.4553 2.69966 12.7836C1.37128 14.112 0.625 15.9137 0.625 17.7923V63.834C0.625 65.7126 1.37128 67.5143 2.69966 68.8427C4.02804 70.171 5.82972 70.9173 7.70833 70.9173H57.2917C59.1703 70.9173 60.972 70.171 62.3003 68.8427C63.6287 67.5143 64.375 65.7126 64.375 63.834V17.7923C64.375 15.9137 63.6287 14.112 62.3003 12.7836C60.972 11.4553 59.1703 10.709 57.2917 10.709H36.0417V3.62565C36.0417 2.68634 35.6685 1.78551 35.0043 1.12131C34.3401 0.457123 33.4393 0.0839844 32.5 0.0839844ZM36.0417 10.709V41.9748L42.5158 35.5007C43.1799 34.8361 44.0808 34.4626 45.0203 34.4622C45.9598 34.4619 46.861 34.8348 47.5255 35.4989C48.1901 36.163 48.5636 37.0639 48.5639 38.0034C48.5643 38.9429 48.1914 39.844 47.5273 40.5086L35.6273 52.405C34.7972 53.2344 33.6717 53.7003 32.4982 53.7003C31.3248 53.7003 30.1993 53.2344 29.3692 52.405L17.4727 40.5086C17.1439 40.1795 16.8831 39.7889 16.7052 39.3591C16.5274 38.9292 16.4359 38.4685 16.4361 38.0034C16.4362 37.5382 16.528 37.0776 16.7062 36.6478C16.8844 36.2181 17.1454 35.8277 17.4745 35.4989C17.8035 35.1701 18.1941 34.9093 18.624 34.7314C19.0538 34.5535 19.5145 34.4621 19.9797 34.4622C20.4449 34.4624 20.9055 34.5542 21.3352 34.7324C21.7649 34.9105 22.1553 35.1716 22.4842 35.5007L28.9583 41.9748V10.709H36.0417Z"
                      fill="#40648E" />
                  </svg>
                </button>
              </div>
              <h2 class="mt-4 text-center font-semibold text-2xl text-[#0D2B22]">Download PDF</h2>

              <p class="mt-2 text-center text-[#7E7E7E] text-base font-light">Download the submissions in PDF format.
              </p>

              <button @click="downloadFile()"
                class="bg-[#0D2B22] mt-6 px-6 py-2 w-[100%] rounded text-[#fff] flex justify-center items-center"
                :disabled="isDownloading">


                {{ isDownloading ? 'Downloading...' : 'Download' }}

              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
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


const resultId = route.params.submission_id;
const showDownloadModal = ref(false);
const title = ref('');
const questions = ref([]);
const requirements = ref([]);
const answer = ref({});
const quizType = ref('');
const timeTaken = ref(0)
const isLoadingAnswer = ref(false)
const isDownloading = ref(false)

onMounted(async () => {
  getQuiz()
});


function showDownloadPopup() {
  showDownloadModal.value = true
}
function hideDownloadPopup() {
  showDownloadModal.value = false
}

async function getQuiz() {
  isLoadingAnswer.value = true
  try {
    const res = await $axios.get(`/results/${resultId}`)
    console.log(res.data.response)
    title.value = res.data.response.title
    questions.value = res.data.response.questions
    requirements.value = res.data.response.
      participant
    timeTaken.value = res.data.response.timeTaken
    answer.value = res.data.response
    quizType.value = res.data.response.type
  } catch (error) {
    $toast(`${error}`)

  }
  isLoadingAnswer.value = false

}
async function downloadFile() {
  isDownloading.value = true;
  try {
    const response = await $axios.get(`download/result/${resultId}`, {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response?.data]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file.pdf');
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  } catch (error) {
    $toast(`${error}`);
  } finally {
    isDownloading.value = false;
  }
}
</script>


<style scoped>
.shadow {
  box-shadow: 0px 2px 10px 0px #6c6c6c40;
}
</style>
