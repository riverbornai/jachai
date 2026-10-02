<template>
  <div class="w-[100%] my-auto">
    <div class="sm:w-[100%] w-[100%]">
      <breadcrumb></breadcrumb>
      <div class="box-size bg-white sm:px-[30px] sm:py-[40px] px-[7px] py-[15px] rounded-md">
        <div class="mb-2 sm:p-0 px-4 flex sm:flex-row flex-col justify-between items-center">
          <h2 class="text-[#454545] text-2xl font-bold sm:max-w-[500px] max-w-[300px] truncate mb-2">
            {{ testSubmissions[0]?.title }}
          </h2>
          <div class="flex sm:flex-row flex-col gap-4">
            <div class="flex flex-row items-center gap-2">
              <label class="text-[#0D2B22] items-center">Result Per Page</label>
              <select v-model="limitPer" class="border-[1px] border-[#0D2B22] px-2 py-[2px] rounded"
                @change="getResults">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div class="flex flex-row items-center gap-2">
              <label class="text-[#0D2B22] items-center p-0 m-0">Sort By</label>
              <select v-model="sortBy" class="border-[1px] border-[#0D2B22] px-2 py-[2px] rounded" @change="getResults">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
            <button
              class="inline-flex justify-center ml-[auto] sm:gap-2 gap-1 items-center bg-[#FD2D7B] text-white px-2 py-1 sm:rounded-md rounded-sm shadow"
              @click="downloadAllResults()">
              <p v-if="isDownloading" class="sm:text-right flex items-center gap-2 px-2">Downloading...</p>
              <p v-else class="sm:text-right flex items-center gap-2 px-2">
                <svg width="13" height="15" viewBox="0 0 65 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M32.5 0.0839844C31.5607 0.0839844 30.6599 0.457123 29.9957 1.12131C29.3315 1.78551 28.9583 2.68634 28.9583 3.62565V10.709H7.70833C5.82972 10.709 4.02804 11.4553 2.69966 12.7836C1.37128 14.112 0.625 15.9137 0.625 17.7923V63.834C0.625 65.7126 1.37128 67.5143 2.69966 68.8427C4.02804 70.171 5.82972 70.9173 7.70833 70.9173H57.2917C59.1703 70.9173 60.972 70.171 62.3003 68.8427C63.6287 67.5143 64.375 65.7126 64.375 63.834V17.7923C64.375 15.9137 63.6287 14.112 62.3003 12.7836C60.972 11.4553 59.1703 10.709 57.2917 10.709H36.0417V3.62565C36.0417 2.68634 35.6685 1.78551 35.0043 1.12131C34.3401 0.457123 33.4393 0.0839844 32.5 0.0839844ZM36.0417 10.709V41.9748L42.5158 35.5007C43.1799 34.8361 44.0808 34.4626 45.0203 34.4622C45.9598 34.4619 46.861 34.8348 47.5255 35.4989C48.1901 36.163 48.5636 37.0639 48.5639 38.0034C48.5643 38.9429 48.1914 39.844 47.5273 40.5086L35.6273 52.405C34.7972 53.2344 33.6717 53.7003 32.4982 53.7003C31.3248 53.7003 30.1993 53.2344 29.3692 52.405L17.4727 40.5086C17.1439 40.1795 16.8831 39.7889 16.7052 39.3591C16.5274 38.9292 16.4359 38.4685 16.4361 38.0034C16.4362 37.5382 16.528 37.0776 16.7062 36.6478C16.8844 36.2181 17.1454 35.8277 17.4745 35.4989C17.8035 35.1701 18.1941 34.9093 18.624 34.7314C19.0538 34.5535 19.5145 34.4621 19.9797 34.4622C20.4449 34.4624 20.9055 34.5542 21.3352 34.7324C21.7649 34.9105 22.1553 35.1716 22.4842 35.5007L28.9583 41.9748V10.709H36.0417Z"
                    fill="white" />
                </svg>
                Download Results
              </p>
            </button>
          </div>
        </div>
        <template v-if="isLoading">
          <div class="min-h-[25vh] flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" viewBox="0 0 200 200">
              <circle fill="#1A4435" stroke="#1A4435" stroke-width="6" r="15" cx="40" cy="100">
                <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;"
                  keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
              </circle>
              <circle fill="#1A4435" stroke="#1A4435" stroke-width="6" r="15" cx="100" cy="100">
                <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;"
                  keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
              </circle>
              <circle fill="#1A4435" stroke="#1A4435" stroke-width="6" r="15" cx="160" cy="100">
                <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;"
                  keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
              </circle>
            </svg>
          </div>
        </template>
        <template v-else>
          <div class="mt-1">
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border">
                <thead class="border text-left">
                  <tr>
                    <th class="py-2 px-4 font-[500] text-[#0D2B22]">
                      Name
                    </th>
                    <th class="py-2 px-4 font-[500] text-[#0D2B22]">
                      Roll
                    </th>
                    <th class="py-2 px-4 font-[500] text-[#0D2B22]">
                      Department
                    </th>
                    <th class="py-2 px-4 font-[500] text-[#0D2B22]">
                      Session
                    </th>
                    <th class="py-2 px-4 font-[500] text-[#0D2B22]">
                      Score
                    </th>
                    <th class="py-2 px-4 text-right font-[500] text-[#0D2B22]">
                      Answer
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="submittedTest in testSubmissions" :key="submittedTest.uid" class="border">
                    <td v-if="submittedTest.participant"
                      class="py-2 px-4 text-left sm:text-[16px] text-[15px] font-[400] text-[#454545]">
                      {{ submittedTest.participant.name }}
                    </td>
                    <td v-if="submittedTest.participant"
                      class="py-2 px-4 sm:text-[16px] text-[14px] font-[400] text-[#454545]">
                      <span v-if="submittedTest.participant.roll"> {{ submittedTest.participant.roll }}</span>
                      <span v-else>--</span>
                    </td>
                    <td v-if="submittedTest.participant"
                      class="py-2 px-4 sm:text-[16px] text-[14px] font-[400] text-[#454545]">
                      <span v-if="submittedTest.participant.department"> {{ submittedTest.participant.department
                        }}</span>
                      <span v-else>--</span>
                    </td>
                    <td v-if="submittedTest.participant"
                      class="py-2 px-4 sm:text-[16px] text-[14px] font-[400] text-[#454545]">
                      <span v-if="submittedTest.participant.session"> {{ submittedTest.participant.session
                        }}</span>
                      <span v-else>--</span>
                    </td>
                    <td class="py-2 px-4 sm:text-[16px] text-[14px] font-[400] text-[#454545]">
                      {{ submittedTest.finalScore }} / {{ submittedTest.totalMarks }}
                    </td>
                    <td class="px-4 py-2 text-right font-[400] text-[#454545]">
                      <NuxtLink :to="`/quiz/${submittedTest.quizId}/submissions/${submittedTest.uid}`"
                        class="inline-flex justify-center ml-[auto] sm:gap-2 gap-1 items-center bg-[#0D2B22] text-white px-2 py-1 sm:rounded-md rounded-sm shadow">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9ZM12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z"
                            fill="white" />
                        </svg>
                        <p class="sm:text-right flex gap-2 sm:text-[15px] text-[12px]">
                          <span class="sm:block hidden"> See</span> Details
                        </p>
                      </NuxtLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="flex justify-center items-center mt-6">
            <button @click="prevPage" :disabled="pageNumber === 1"
              class="px-4 py-[4px] mr-2 bg-[#0D2B22] text-white rounded disabled:opacity-70 disabled:cursor-not-allowed">Previous</button>

            <span>Page {{ pageNumber }} of {{ totalPages }}</span>

            <button @click="nextPage" :disabled="pageNumber === totalPages"
              class="px-4 py-[4px] ml-2 bg-[#0D2B22] text-white rounded disabled:opacity-70 disabled:cursor-not-allowed">Next</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: "app",
  });
  const router = useRouter();
  const route = useRoute();

  import { onMounted } from "vue";
  import { useMainStore } from "~/stores/index.js";

  const { $axios, $toast } = useNuxtApp();
  const store = useMainStore();
  const testSubmissions = ref([])
  const isLoading = ref(false)
  const limitPer = ref(10);
  const sortBy = ref('newest');
  const pageNumber = ref(1);
  const totalPages = ref(1);
  const quizId = ref(route.params.quiz_id);
  const title = ref('');
  const isDownloading = ref(false)

  onMounted(async () => {
    await getResults()
  });

  async function getResults() {
    try {
      isLoading.value = true
      const res = await $axios.get(`/results/quiz/${store.creatorId}/${quizId.value}?limit=${limitPer.value}&sorting=${sortBy.value}&pageNumber=${pageNumber.value}`)
      console.log(res.data.response.response, 'data')
      title.value = res.data.response.response[0].title
      testSubmissions.value = res.data.response.response.sort((a, b) => b.finalScore - a.finalScore);
      totalPages.value = Math.ceil(res.data.response.total / limitPer.value);
    } catch (error) {
      $toast(`${error}`)
    } finally {
      isLoading.value = false
    }
  }

  async function downloadAllResults() {
    isDownloading.value = true
    try {
      const response = await $axios.get(`/generate-xlsx/${quizId.value}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.value}.xlsx`);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      $toast.success('Results downloaded successfully');
    } catch (error) {
      $toast(`${error}`);
    }
    isDownloading.value = false
  }

  function prevPage() {
    if (pageNumber.value > 1) {
      pageNumber.value--;
      getResults();
    }
  }

  function nextPage() {
    if (pageNumber.value < totalPages.value) {
      pageNumber.value++;
      getResults();
    }
  }
</script>

<style>
  .shadow {
    box-shadow: 0px 2px 10px 0px #6c6c6c40;
  }

  .box-size {
    box-sizing: border-box;
    box-shadow: 0px 3px 15px 2px #97badb40;
  }

  .shadow-select {
    box-shadow: 0px 2px 9px 0px #6b6b6b40;
  }
</style>
