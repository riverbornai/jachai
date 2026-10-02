<template>
  <div class="w-[100%] m-auto">
    <breadcrumb></breadcrumb>
    <div class="grid col gap-8">
      <div class="">
        <div class="bg-[#fff] px-6 py-6 rounded-lg sticky top-[7.5rem] shadow">
          <div>
            <div class="mt-8">
              <div class="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-2">
                <div class="flex flex-col text-[ #0D2B22]">
                  <label class="text-[#0D2B22] font-medium" for="">Question Type</label>
                  <select v-model="type" class="shadow-select px-4 py-[6px] mt-2 rounded" name="type" id="type">
                    <option value="multiple">Multiple Choice</option>
                    <option value="single">Single Choices</option>
                  </select>
                </div>
                <div class="flex flex-col text-[ #0D2B22]">
                  <label class="text-[#0D2B22] font-medium" for="">Difficulty Level</label>
                  <select v-model="difficulty" name="" id="" class="shadow-select px-4 py-[6px] mt-2 rounded">
                    <option value="hard">Hard</option>
                    <option value="medium">Medium</option>
                    <option value="easy">Easy</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <div class="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-2">
                <div class="flex flex-col text-[ #0D2B22]">
                  <label class="text-[#0D2B22] font-medium" for="">Number of Question</label>
                  <select v-model="questionNumber" class="shadow-select px-4 py-[6px] mt-2 rounded" name="" id="">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                  </select>
                </div>
                <div class="flex flex-col text-[ #0D2B22]">
                  <label class="text-[#0D2B22] font-medium" for="">Options</label>
                  <select name="" id="" v-model="options" class="shadow-select px-4 py-[6px] mt-2 rounded">
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <div class="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-2">
                <div>
                  <label class="text-[#0D2B22] font-medium" for="">Per Question Marks</label>
                  <input v-model="perQuesMarks" type="number" class="shadow-select w-full px-4 py-[6px] mt-2 rounded"
                    placeholder="Add marks">
                </div>
                <div>
                  <h4 class="text-[#0D2B22] font-medium">Negative Score/wrong ans</h4>
                  <input v-model="negativeMark" type="number" class="shadow-select w-full px-4 py-[6px] mt-2 rounded"
                    placeholder="Add marks">
                </div>
              </div>
            </div>
            <div class="mt-4">
              <div class="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-2">
                <div>
                  <h4 class="text-[#0D2B22] font-medium">Exam Time Fixed?</h4>
                  <div
                    class="flex flex-row  items-center gap-4 text-[ #0D2B22] shadow-select px-4 py-[6px] mt-2 rounded cursor-pointer">
                    <input v-model="showTime" id="no-time" type="checkbox">
                    <label for="no-time" class="text-[#0D2B22] font-medium w-full cursor-pointer">Yes</label>
                  </div>
                </div>
                <div v-if="showTime">
                  <label class="text-[#0D2B22] font-medium" for="time">Input Exam Time (Minute)</label>
                  <input v-model="time" class="shadow-select px-4  py-[6px] w-[100%] mt-2 rounded" type="number"
                    id="time" placeholder="Input time what you want" />
                </div>

              </div>
            </div>

            <div class="mt-4 flex flex-col text-[ #0D2B22]">
              <label class="text-[#0D2B22] font-medium" for="">Show Test Result To Student</label>
              <select v-model="resultType" class="shadow-select px-4 py-[6px] mt-2 rounded" name="" id="">
                <option value="immediately">Immediately</option>
                <option value="notShow">Do Not Show</option>
              </select>
            </div>
            <div class="mt-4">
              <div class="flex flex-col text-[ #0D2B22]">
                <label class="text-[#0D2B22] font-medium" for="">Examinee Requirements</label>
                <p class="text-[10px] text-gray-600 italic mt-2">
                  * Note: You can only choose either email or phone number as a requirement. Selecting one will
                  automatically remove the other.
                </p>
                <select @change="createRequirements()" v-model="requireOption"
                  class="shadow-select px-4 py-[6px] mt-2 rounded" name="" id="">
                  <option value="">Select Options</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="roll">Roll</option>
                  <option value="phone">Phone</option>
                  <option value="department">Department/Group</option>
                  <option value="session">Session</option>
                  <option value="address">Address</option>
                </select>
              </div>
              <div class="flex gap-4 flex-wrap mt-4">
                <div v-for="(requirement, index) in examineeRequirements" :key="index">
                  <button @click="removeRequirements(index)"
                    class="flex items-center border border-solid border-[#0D2B22] px-4 py-[4px] rounded-[20px] capitalize">
                    {{ requirement }}
                    <span class="text-[#0D2B22] text-[20px]">&nbsp;&nbsp;X</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="mt-6">
              <div class="flex gap-4">
                <button :class="showTextInput
                  ? 'bg-[#0D2B22] rounded-[40px] text-[#fff]'
                  : 'bg-white text-[#0D2B22] border-[#0D2B22] border border-solid'
                  " class="rounded-md px-2 py-1" @click="toggleTextInput()">
                  Text
                </button>
                <button class="px-2 py-1 rounded-md" :class="showFileInput
                  ? 'bg-[#0D2B22] rounded-[40px] text-[#fff]'
                  : 'bg-white text-[#0D2B22] border-[#0D2B22] border border-solid'
                  " @click="toggleFileInput()">
                  File Upload
                </button>
                <!-- <button class="px-2 py-1 rounded-md" :class="showUrlInput
                  ? 'bg-[#0D2B22] rounded-[40px] text-[#fff]'
                  : 'bg-white text-[#0D2B22] border-[#0D2B22] border border-solid'
                  " @click="toggleUrlInput()">
                  URL
                </button> -->
              </div>
            </div>
            <div v-if="showTextInput" class="mt-4 flex flex-col">
              <label class="text-[#0D2B22] font-medium" for="docs">Paste your text here</label>
              <textarea class="mt-2 p-1 border-2 border-solid rounded focus:outline-none focus:border-[#0D2B22]"
                :class="{ 'border-red-500': textError }" name="" id="" cols="30" rows="10" v-model="text"
                @input="validateTextInput"></textarea>
              <p v-if="textError" class="text-red-500 text-sm mt-1 text-right">Minimum 40 characters</p>
            </div>


            <div class="mt-4" v-if="showFileInput">
              <template v-if="parsingText">
                <div class="border-2 border-dashed border-gray-400 rounded-lg p-5">

                  <p class="animate-pulse mr-2 text-[30px] text-center">⏳</p>
                  <p class="text-blue-700 text-center">

                    Please wait, Extracting text from file...
                  </p>
                </div>
              </template>

              <template v-else>
                <div v-if="selectedFileName" class="bg-[#40648E1A] p-3 rounded flex justify-between items-center">
                  <p class="p-0 m-0">{{ selectedFileName }}</p>
                  <button @click="removeSelectedFile()" class="text-[20px]">
                    ✖️
                  </button>
                </div>
                <div v-else id="drop-area" @dragover.prevent @drop="handleFileSelect" @click="$refs.fileInput.click()"
                  class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-400 rounded-lg bg-white text-gray-600 cursor-pointer hover:bg-gray-50">
                  <span id="drop-area-text" class=" text-center">Drag & Drop your files here or click to upload
                  </span>
                  <p class="mt-2 text-center">Supported file formats:
                    PNG,
                    JPEG, GIF, JPG, WEBP, TXT, MD, CSV, RTF, DOCX, ODT, PDF</p>
                  <input ref="fileInput" type="file" class="hidden"
                    accept=".png,.jpeg,.gif,.jpg,.JPEG,.webp,.txt,.md,.csv,.rtf,.docx,.odt,.pdf"
                    @change="handleFileSelect" />
                </div>
              </template>



            </div>
            <button @click="createQuiz()" class="mt-4 bg-[#0D2B22] w-[100%] py-2 rounded-md text-[#fff]">
              {{ isSubmittingData ? 'Generating Quiz...' : 'Create Quiz' }}
            </button>
          </div>
        </div>
      </div>
      <div class="bg-[#ffffff] w-[100%] sm:w-[100%] p-4 rounded-lg shadow">
        <template v-if="questions.length">
          <div>
            <div class="sm:flex grid grid-cols-2 gap-4">
              <button class="flex justify-center items-center shadow-base px-2 py-1 rounded"
                @click="toggleShowAnswer()">
                <svg v-if="showAnswer" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.83 9L15 12.16V12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9H11.83ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.77 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 11.21 7.2 10.47 7.53 9.8ZM2 4.27L4.28 6.55L4.73 7C3.08 8.3 1.78 10 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.81 19.08L19.73 22L21 20.73L3.27 3M12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 12.64 16.87 13.26 16.64 13.82L19.57 16.75C21.07 15.5 22.27 13.86 23 12C21.27 7.61 17 4.5 12 4.5C10.6 4.5 9.26 4.75 8 5.2L10.17 7.35C10.74 7.13 11.35 7 12 7Z"
                    fill="#0D2B22" />
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9ZM12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z"
                    fill="#0D2B22" />
                </svg>

                &nbsp;{{ showAnswer ? "Hide Answer" : "Show Answer" }}
              </button>
              <NuxtLink :to="`/quiz/${quizId}/edit`"
                class="flex justify-center items-center shadow-base px-2 py-1 rounded">
                <svg width="16" height="16" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.25 3C13.5049 3.00028 13.75 3.09788 13.9354 3.27285C14.1207 3.44782 14.2322 3.68695 14.2472 3.94139C14.2621 4.19584 14.1793 4.44638 14.0157 4.64183C13.8521 4.83729 13.6201 4.9629 13.367 4.993L13.25 5H5.25V19H19.25V11C19.2503 10.7451 19.3479 10.5 19.5228 10.3146C19.6978 10.1293 19.937 10.0178 20.1914 10.0028C20.4458 9.98789 20.6964 10.0707 20.8918 10.2343C21.0873 10.3979 21.2129 10.6299 21.243 10.883L21.25 11V19C21.2502 19.5046 21.0596 19.9906 20.7165 20.3605C20.3734 20.7305 19.9032 20.9572 19.4 20.995L19.25 21H5.25C4.74542 21.0002 4.25943 20.8096 3.88945 20.4665C3.51947 20.1234 3.29284 19.6532 3.255 19.15L3.25 19V5C3.24984 4.49542 3.44041 4.00943 3.7835 3.63945C4.12659 3.26947 4.59684 3.04284 5.1 3.005L5.25 3H13.25ZM19.493 3.343C19.673 3.16365 19.9144 3.05953 20.1684 3.05177C20.4223 3.04402 20.6697 3.13322 20.8603 3.30125C21.0508 3.46928 21.1703 3.70355 21.1944 3.95647C21.2185 4.2094 21.1454 4.46201 20.99 4.663L20.907 4.758L11.007 14.657C10.827 14.8363 10.5856 14.9405 10.3316 14.9482C10.0777 14.956 9.83029 14.8668 9.63972 14.6988C9.44916 14.5307 9.32969 14.2964 9.3056 14.0435C9.28151 13.7906 9.35459 13.538 9.51 13.337L9.593 13.243L19.493 3.343Z"
                    fill="#0D2B22" />
                </svg>
                &nbsp; Edit
              </NuxtLink>
              <button @click="showDownloadPopup" class="flex justify-center items-center shadow-base px-2 py-1 rounded">
                <svg width="16" height="16" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.5 9H15.5V3H9.5V9H5.5L12.5 17L19.5 9ZM4.5 19H20.5V21H4.5V19Z" fill="#0D2B22" />
                </svg>
                &nbsp; Download
              </button>

              <button v-if="isPublic" @click="copyQuizLink"
                class="flex justify-center items-center text-[#fff] bg-[#0D2B22] px-2 py-1 rounded" :disabled="!quizId">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_37_10013)">
                    <path
                      d="M11.5635 2.76758H6.61859C6.31151 2.76758 6.06348 3.01561 6.06348 3.3227C6.06348 3.62978 6.31151 3.87781 6.61859 3.87781H11.5635C11.8706 3.87781 12.1186 3.62978 12.1186 3.3227C12.1186 3.01561 11.8706 2.76758 11.5635 2.76758Z"
                      fill="white" />
                    <path
                      d="M11.5627 5.60645H2.97216C2.66507 5.60645 2.41704 5.85448 2.41704 6.16156C2.4131 6.46865 2.66507 6.71668 2.97216 6.71668H11.5627C11.8698 6.71668 12.1178 6.46865 12.1178 6.16156C12.1178 5.85448 11.8698 5.60645 11.5627 5.60645Z"
                      fill="white" />
                    <path
                      d="M8.08235 8.44531H2.97211C2.66502 8.44531 2.41699 8.69334 2.41699 9.00043C2.41699 9.30752 2.66502 9.55555 2.97211 9.55555H8.08628C8.38943 9.55555 8.63746 9.30752 8.63746 9.00043C8.63746 8.69334 8.38943 8.44531 8.08235 8.44531Z"
                      fill="white" />
                    <path
                      d="M6.84613 14.1221H2.97211C2.66502 14.1221 2.41699 14.3701 2.41699 14.6772C2.41699 14.9843 2.66502 15.2323 2.97211 15.2323H6.84613C7.15321 15.2323 7.40124 14.9843 7.40124 14.6772C7.40124 14.3701 7.15321 14.1221 6.84613 14.1221Z"
                      fill="white" />
                    <path
                      d="M6.61783 11.2832H2.97216C2.66507 11.2832 2.41704 11.5312 2.41704 11.8383C2.4131 12.1454 2.66507 12.3934 2.97216 12.3934H6.61783C6.92491 12.3934 7.17294 12.1454 7.17294 11.8383C7.17294 11.5312 6.92491 11.2832 6.61783 11.2832Z"
                      fill="white" />
                    <path
                      d="M17.4331 18.3701C18.9803 17.3189 20 15.5472 20 13.5394C20 11.9646 19.3701 10.5354 18.3543 9.48425L18.6181 9.22047L18.7677 9.37008C18.9921 9.59449 19.3543 9.56693 19.5551 9.37008C19.7717 9.15354 19.7717 8.79921 19.5551 8.58268L18.4646 7.50394C18.248 7.2874 17.8976 7.2874 17.6772 7.50394C17.4606 7.72047 17.4606 8.0748 17.6772 8.29134L17.8268 8.44094L17.5039 8.76378C16.6496 8.16535 15.6339 7.79528 14.5315 7.72441V0.555118C14.5315 0.248031 14.2835 0 13.9764 0H4.27559C4.12992 0 3.98819 0.0590551 3.88189 0.161417L0.161417 3.88189C0.0590551 3.98425 0 4.12598 0 4.27559V17.1732C0 17.4803 0.248031 17.7283 0.555118 17.7283H10.1142C10.3543 17.9606 10.6102 18.1732 10.8858 18.3622L10.189 19.0591C9.97244 19.2756 9.97244 19.626 10.189 19.8465C10.3701 20.0315 10.7559 20.0669 10.9764 19.8465L11.9055 18.9213C12.6024 19.2165 13.3661 19.378 14.1693 19.378C14.9646 19.378 15.7244 19.2165 16.4173 18.9252L17.3425 19.8504C17.5591 20.0669 17.9449 20.0315 18.1299 19.8504C18.3465 19.6339 18.3465 19.2795 18.1299 19.063L17.4331 18.3701ZM3.72047 1.89768V3.72051H1.89764L3.72047 1.89768ZM1.11024 16.6181V4.83071H4.27559C4.58268 4.83071 4.83071 4.58268 4.83071 4.27559V1.11024H13.4213V7.75591C10.5551 8.12598 8.33465 10.5748 8.33465 13.5394C8.33465 14.6693 8.66142 15.7205 9.22047 16.6181H1.11024ZM14.1654 18.2638C11.563 18.2638 9.44488 16.1457 9.44488 13.5394C9.44488 10.9331 11.563 8.81496 14.1654 8.81496C16.7677 8.81496 18.8858 10.9331 18.8858 13.5394C18.8898 16.1457 16.7717 18.2638 14.1654 18.2638Z"
                      fill="white" />
                    <path
                      d="M15.6813 12.98H14.7128V10.35C14.7128 10.043 14.4647 9.79492 14.1577 9.79492C13.8506 9.79492 13.6025 10.043 13.6025 10.35V13.5351C13.6025 13.8422 13.8506 14.0902 14.1577 14.0902H15.6813C15.9884 14.0902 16.2364 13.8422 16.2364 13.5351C16.2364 13.228 15.9884 12.98 15.6813 12.98Z"
                      fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_37_10013">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                &nbsp; Share Now
              </button>
              <NuxtLink v-else class="flex justify-center items-center text-[#fff] bg-[#0D2B22] px-2 py-1 rounded"
                :to="`/test/${quizId}`">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_37_10013)">
                    <path
                      d="M11.5635 2.76758H6.61859C6.31151 2.76758 6.06348 3.01561 6.06348 3.3227C6.06348 3.62978 6.31151 3.87781 6.61859 3.87781H11.5635C11.8706 3.87781 12.1186 3.62978 12.1186 3.3227C12.1186 3.01561 11.8706 2.76758 11.5635 2.76758Z"
                      fill="white" />
                    <path
                      d="M11.5627 5.60645H2.97216C2.66507 5.60645 2.41704 5.85448 2.41704 6.16156C2.4131 6.46865 2.66507 6.71668 2.97216 6.71668H11.5627C11.8698 6.71668 12.1178 6.46865 12.1178 6.16156C12.1178 5.85448 11.8698 5.60645 11.5627 5.60645Z"
                      fill="white" />
                    <path
                      d="M8.08235 8.44531H2.97211C2.66502 8.44531 2.41699 8.69334 2.41699 9.00043C2.41699 9.30752 2.66502 9.55555 2.97211 9.55555H8.08628C8.38943 9.55555 8.63746 9.30752 8.63746 9.00043C8.63746 8.69334 8.38943 8.44531 8.08235 8.44531Z"
                      fill="white" />
                    <path
                      d="M6.84613 14.1221H2.97211C2.66502 14.1221 2.41699 14.3701 2.41699 14.6772C2.41699 14.9843 2.66502 15.2323 2.97211 15.2323H6.84613C7.15321 15.2323 7.40124 14.9843 7.40124 14.6772C7.40124 14.3701 7.15321 14.1221 6.84613 14.1221Z"
                      fill="white" />
                    <path
                      d="M6.61783 11.2832H2.97216C2.66507 11.2832 2.41704 11.5312 2.41704 11.8383C2.4131 12.1454 2.66507 12.3934 2.97216 12.3934H6.61783C6.92491 12.3934 7.17294 12.1454 7.17294 11.8383C7.17294 11.5312 6.92491 11.2832 6.61783 11.2832Z"
                      fill="white" />
                    <path
                      d="M17.4331 18.3701C18.9803 17.3189 20 15.5472 20 13.5394C20 11.9646 19.3701 10.5354 18.3543 9.48425L18.6181 9.22047L18.7677 9.37008C18.9921 9.59449 19.3543 9.56693 19.5551 9.37008C19.7717 9.15354 19.7717 8.79921 19.5551 8.58268L18.4646 7.50394C18.248 7.2874 17.8976 7.2874 17.6772 7.50394C17.4606 7.72047 17.4606 8.0748 17.6772 8.29134L17.8268 8.44094L17.5039 8.76378C16.6496 8.16535 15.6339 7.79528 14.5315 7.72441V0.555118C14.5315 0.248031 14.2835 0 13.9764 0H4.27559C4.12992 0 3.98819 0.0590551 3.88189 0.161417L0.161417 3.88189C0.0590551 3.98425 0 4.12598 0 4.27559V17.1732C0 17.4803 0.248031 17.7283 0.555118 17.7283H10.1142C10.3543 17.9606 10.6102 18.1732 10.8858 18.3622L10.189 19.0591C9.97244 19.2756 9.97244 19.626 10.189 19.8465C10.3701 20.0315 10.7559 20.0669 10.9764 19.8465L11.9055 18.9213C12.6024 19.2165 13.3661 19.378 14.1693 19.378C14.9646 19.378 15.7244 19.2165 16.4173 18.9252L17.3425 19.8504C17.5591 20.0669 17.9449 20.0315 18.1299 19.8504C18.3465 19.6339 18.3465 19.2795 18.1299 19.063L17.4331 18.3701ZM3.72047 1.89768V3.72051H1.89764L3.72047 1.89768ZM1.11024 16.6181V4.83071H4.27559C4.58268 4.83071 4.83071 4.58268 4.83071 4.27559V1.11024H13.4213V7.75591C10.5551 8.12598 8.33465 10.5748 8.33465 13.5394C8.33465 14.6693 8.66142 15.7205 9.22047 16.6181H1.11024ZM14.1654 18.2638C11.563 18.2638 9.44488 16.1457 9.44488 13.5394C9.44488 10.9331 11.563 8.81496 14.1654 8.81496C16.7677 8.81496 18.8858 10.9331 18.8858 13.5394C18.8898 16.1457 16.7717 18.2638 14.1654 18.2638Z"
                      fill="white" />
                    <path
                      d="M15.6813 12.98H14.7128V10.35C14.7128 10.043 14.4647 9.79492 14.1577 9.79492C13.8506 9.79492 13.6025 10.043 13.6025 10.35V13.5351C13.6025 13.8422 13.8506 14.0902 14.1577 14.0902H15.6813C15.9884 14.0902 16.2364 13.8422 16.2364 13.5351C16.2364 13.228 15.9884 12.98 15.6813 12.98Z"
                      fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_37_10013">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                &nbsp; Start quiz
              </NuxtLink>
            </div>
          </div>
          <div class="mt-4">
            <h2 v-if="topic" class="py-2 text-[18px] font-bold text-[#454545]">
              {{ topic }}
            </h2>
            <mcq-view :questions="questions" :showAnswer="showAnswer"></mcq-view>
          </div>
        </template>
        <div v-else class="h-[100%] flex flex-col justify-center items-center">
          <div v-if="isSubmittingData" class="flex flex-col items-center gap-4">
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
            <p class="text-[#0D2B22] text-[18px]">Generating Quiz. It will take 20-30 seconds to generate.</p>

          </div>
          <div v-else class="flex flex-col items-center gap-4">
            <svg width="105" height="150" viewBox="0 0 21 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.75" y="0.75" width="19.5" height="28.5" rx="1.25" stroke="#B9DBFE" stroke-width="1.5" />
              <rect x="4.5" y="5.5" width="4" height="4" rx="0.5" stroke="#B9DBFE" />
              <rect x="4.5" y="5.5" width="4" height="4" rx="0.5" stroke="#B9DBFE" />
              <rect x="4.5" y="12.5" width="4" height="4" rx="0.5" stroke="#B9DBFE" />
              <rect x="10" y="6" width="7" height="1" fill="#B9DBFE" />
              <rect x="4" y="20" width="13" height="1" fill="#5DADFF" />
              <rect x="4" y="22" width="13" height="1" fill="#7CBDFF" />
              <rect x="4" y="24" width="13" height="1" fill="#B9DBFE" />
              <rect x="10" y="8" width="7" height="1" fill="#B9DBFE" />
              <rect x="10" y="15" width="7" height="1" fill="#B9DBFE" />
              <rect x="10" y="13" width="7" height="1" fill="#7CBDFF" />
              <line x1="5.35355" y1="6.64645" x2="6.35355" y2="7.64645" stroke="#5DADFF" />
              <line x1="9.35355" y1="5.35355" x2="6.35355" y2="8.35355" stroke="#5DADFF" />
            </svg>
            <p class="text-[#0D2B22] text-[18px] text-center">Generated Quiz will be displayed here.</p>
          </div>
        </div>
      </div>
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

          <p class="mt-2 text-center text-[#7E7E7E] text-base font-light">
            Download the quiz in PDF format. You can download the quiz with answers or without answers.
          </p>


          <button @click="downloadFile(isIncludeAnswer = true)"
            class="bg-[#0D2B22] mt-6 px-6 py-2 w-[100%] rounded text-[#fff]">
            {{ isDownloading && isIncludeAnswer ? 'Downloading...' : 'Download' }}
          </button>
          <button @click="downloadFile(isIncludeAnswer = false)"
            class="shadow-modal mt-6 px-6 py-2 w-[100%] rounded text-[#0D2B22]">
            {{ isDownloading && !isIncludeAnswer ? 'Downloading...' : 'Download (without answers)' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "app",
});
import { useMainStore } from "~/stores/index.js";
const { $axios, $toast } = useNuxtApp();
const store = useMainStore();

const examineeRequirements = ref(['name', 'phone', 'roll', 'department', 'session']);
const showAnswer = ref(false);
const requireOption = ref("");
const showQuestionSheet = ref(true);
const showFileInput = ref(false);
const showTextInput = ref(true);
const showUrlInput = ref(false);
const selectedFileName = ref("");
const type = ref("single");
const difficulty = ref("easy");
const questionNumber = ref(10);
const options = ref(4);
const text = ref("");
const time = ref(10);
// Every quiz in this engine is public/shareable — there is no private mode.
const isPublic = ref(true);
const resultType = ref('immediately');
const showDownloadModal = ref(false);
const isDownloading = ref(false)
const quizId = ref("");
const questions = ref([]);
const topic = ref('');
const isSubmittingData = ref(false);
const showTime = ref(true);
const fileUrl = ref('');
const fileType = ref('');
const link = ref('');
const isIncludeAnswer = ref(false);
const parsingText = ref(false);
const quizLink = ref('');
const perQuesMarks = ref(1);
const negativeMark = ref(0);
const textError = ref(false);

function createRequirements() {
  if (requireOption.value && !examineeRequirements.value.includes(requireOption.value)) {
    if (requireOption.value === 'email') {
      const phoneIndex = examineeRequirements.value.indexOf('phone');
      if (phoneIndex !== -1) {
        examineeRequirements.value.splice(phoneIndex, 1);
      }
      examineeRequirements.value.push('email');
    } else if (requireOption.value === 'phone') {
      const emailIndex = examineeRequirements.value.indexOf('email');
      if (emailIndex !== -1) {
        examineeRequirements.value.splice(emailIndex, 1);
      }
      examineeRequirements.value.push('phone');
    } else {
      examineeRequirements.value.push(requireOption.value);
    }
  }
}
function removeRequirements(index) {
  examineeRequirements.value.splice(index, 1);
}
function toggleFileInput() {
  showFileInput.value = true;
  showTextInput.value = false;
  showUrlInput.value = false;
}
function toggleTextInput() {
  showFileInput.value = false;
  showTextInput.value = true;
  showUrlInput.value = false;
}
function toggleUrlInput() {
  showFileInput.value = false;
  showTextInput.value = false;
  showUrlInput.value = true;
}
async function handleFileSelect(event) {
  event.preventDefault();
  const files = event.dataTransfer?.files || event.target.files;
  const maxFileSize = 10 * 1024 * 1024;

  if (files.length > 0) {
    const allowedExtensions = ['.png', '.jpeg', '.gif', '.jpg', '.JPEG', '.webp', '.txt', '.md', '.csv', '.rtf', '.docx', '.odt', '.pdf'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      selectedFileName.value = file.name;

      // Check file size
      if (file.size > maxFileSize) {
        $toast(`File size is too large. Maximum allowed size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
        return;
      }

      const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
      fileType.value = fileExtension.slice(1); // Remove the dot

      if (!allowedExtensions.includes(fileExtension)) {
        $toast(`File extension ${fileExtension} is not allowed. Please upload files with these extensions: ${allowedExtensions.join(', ')}`);
        return;
      }

      await uploadAndParseFile(file);
    }
  }
}

// Uploads the file straight to the backend (multipart/form-data) and parses
// it there — no external storage vendor involved.
async function uploadAndParseFile(file) {
  parsingText.value = true
  try {
    const textFileTypes = ['txt', 'md', 'csv', 'rtf', 'docx', 'odt'];
    const imageFileType = ['png', 'jpeg', 'gif', 'heic', 'jpg', 'JPEG', 'webp']
    let type = 'image'
    if (textFileTypes.includes(fileType.value)) {
      type = 'text'
    } else if (fileType.value == 'pdf') {
      type = 'pdf'
    } else if (imageFileType.includes(fileType.value)) {
      type = 'image'
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const res = await $axios.post(`/parser/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    text.value = res.data.response
    fileUrl.value = file.name
    showTextInput.value = true
    showFileInput.value = false
  } catch (error) {
    $toast(`${error}`)
  }
  parsingText.value = false
}
function removeSelectedFile() {
  selectedFileName.value = "";
}

function showDownloadPopup() {
  showDownloadModal.value = true
}
function hideDownloadPopup() {
  showDownloadModal.value = false
}
function toggleShowAnswer() {
  showAnswer.value = !showAnswer.value;
}

function validateTextInput() {
  textError.value = text.value.length < 40;
}

async function createQuiz() {

  textError.value = false;

  if (showTextInput.value && text.value.length < 40) {
    textError.value = true;
    $toast('Please enter at least 40 characters in the text field');
    return;
  }
  if (showFileInput.value && !fileUrl.value) {
    $toast('Please upload a file first');
    return;
  }

  isSubmittingData.value = true

  try {
    const data = {
      type: type.value,
      difficulty: difficulty.value,
      questionNumber: Number(questionNumber.value),
      isPublic: isPublic.value,
      optionsCount: Number(options.value),
      perQuesMarks: Number(perQuesMarks.value),
      negativeMark: Number(negativeMark.value),
      requirements: examineeRequirements.value,
      text: text.value,
      time: time.value || 0,
      resultType: resultType.value,
      userId: store.creatorId
    }
    const res = await $axios.post('/quiz', data)
    console.log(res.data, 'response')

    topic.value = res.data.response.title
    questions.value = res.data.response.questions
    console.log(res.data.response, 'response')
    quizId.value = res.data.response.uid
    link.value = `${window.location.origin}/test/${res.data.response.uid}`
    quizLink.value = `/test/${res.data.response.uid}`
    if (res.data.response) {
      $toast('Quiz has been created Succesfully')
    }
  } catch (error) {
    $toast(`${error}`)
  }
  isSubmittingData.value = false
}

function copyQuizLink() {
  navigator.clipboard.writeText(link.value)
    .then(() => {
      $toast('Link copied to clipboard');
    })
    .catch((error) => {
      $toast(`${error}`)

    });
}
async function downloadFile(isIncludeAnswer) {
  isDownloading.value = true

  try {
    const data = {
      quizId: quizId.value,
      isIncludeAnswer: isIncludeAnswer
    }
    const response = await $axios.post(`/download/pdf`, data, {
      responseType: 'blob'
    });
    console.log(response, 'response download')

    const url = window.URL.createObjectURL(new Blob([response?.data]));


    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file.pdf');
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  } catch (error) {
    $toast(`${error}`)

  }
  isDownloading.value = false
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

.shadow-modal {
  box-shadow: 0px 2px 9px 0px #6b6b6b40;
}

.shadow-select {
  box-shadow: 0px 2px 9px 0px #6b6b6b40;
  appearance: none;
  background-color: #fff;
}

.shadow-base {
  box-shadow: 0px 2px 10px 0px #6c6c6c40;
}
</style>
