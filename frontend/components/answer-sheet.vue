<template>
  <div class=" ">
    <div class="mt-4" v-for="(quiz, index) in questions" :key="quiz.id">

      <h4 class="text-[#5E5E5E] font-medium"><span class="font-bold">{{ index + 1 }}. </span>{{ quiz.question }}</h4>
      <div class="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-2">
        <div v-for="(option, index) in quiz.options" :key="index">
          <p :style="getBackgroundStyle(quiz, option)" class="border-[#D0D0D0] border-solid border px-3 py-2 rounded">
            {{ String.fromCharCode(65 + index) }}.
            {{ option }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  questions: {
    type: Array,
    required: true,
  },
});

const getBackgroundStyle = (quiz, option) => {

  if (quiz.selectedOptions.includes(option) && quiz.answers.includes(option)) {
    return 'background: #1e7839; color: #fff; border: none;';
  } else if (quiz.selectedOptions.includes(option) && !quiz.answers.includes(option)) {
    return 'background: #fa0303; color: #fff; border: none;';
  } else if (!quiz.selectedOptions.includes(option) && quiz.answers.includes(option)) {
    return 'background: #9df0b6;';
  } else {
    return 'background: #fff;';
  }
};


</script>

<style lang="scss" scoped></style>
