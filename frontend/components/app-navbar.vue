<template>
  <header
    class="hidden display py-4 px-14 fixed overflow-hidden z-10 bg-white w-full top-0 right-0 shadow-sm"
  >
    <div class="header-content flex justify-between items-center flex-row">
      <div>
        <NuxtLink to="/" class="flex items-center gap-2">
          <img class="h-[30px]" src="/static/icon.svg" alt="" />
          <p class="text-[28px] font-[600] text-[#0D2B22]">JACHAI</p>
        </NuxtLink>
      </div>
      <div class="flex items-center ml-auto">
        <div class="mr-8 flex justify-center items-center gap-8">
          <NuxtLink
            class="text-[#0D2B22] hover:opacity-80"
            :class="{ '#0D2B22 font-bold': $route.path === '/' }"
            to="/"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            class="text-[#0D2B22] hover:opacity-80"
            :class="{ '#0D2B22 font-bold': $route.path === '/quiz' }"
            to="/quiz"
          >
            Quizzes
          </NuxtLink>
          <NuxtLink
            class="flex justify-center items-center bg-[#0D2B22] px-3 py-1 text-[#fff] rounded-md"
            to="/quiz/create"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_37_5087)">
                <path
                  d="M12 0C5.37262 0 0 5.37262 0 12C0 18.6278 5.37262 24 12 24C18.6278 24 24 18.6278 24 12C24 5.37262 18.6278 0 12 0ZM12 22.5236C6.21037 22.5236 1.5 17.7896 1.5 12C1.5 6.21033 6.21037 1.49995 12 1.49995C17.7896 1.49995 22.5 6.21035 22.5 12C22.5 17.7896 17.7896 22.5236 12 22.5236ZM17.25 11.25H12.75V6.75C12.75 6.336 12.414 6 12 6C11.586 6 11.25 6.336 11.25 6.75V11.25H6.75C6.336 11.25 6 11.586 6 12C6 12.414 6.336 12.75 6.75 12.75H11.25V17.25C11.25 17.664 11.586 18 12 18C12.414 18 12.75 17.664 12.75 17.25V12.75H17.25C17.664 12.75 18 12.414 18 12C18 11.586 17.664 11.25 17.25 11.25Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_37_5087">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span>&nbsp; Create Quiz</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup></script>

<style scoped>
@media screen and (min-width: 1023px) {
  .display {
    display: block;
  }
}
</style>
