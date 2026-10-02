<template>
  <div>
    <div class="mt-4" v-for="(quiz, index) in questions" :key="quiz.question">
      <h4 class="text-[#5E5E5E] font-medium"><span class="font-bold">{{ index + 1 }}.</span> {{ quiz.question }}</h4>
      <div class="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-2">
        <button v-for="(option, index) in quiz.options" :key="index" :disabled="isAnswered(quiz, option)"
          @click="setAnswer(quiz, option)"
          class="border-[#D0D0D0] text-left w-[100%] border-solid border px-3 py-2 rounded-sm"
          :class="{ 'bg-gray-300': isSelected(quiz, option) }">
          {{ String.fromCharCode(65 + index) }}. {{ option }}
        </button>
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
    answers: {
      type: Array,
      required: true,
    },
    questionType: {
      type: String,
      required: true,
    }
  });

  const emit = defineEmits(['updateAnswers']);

  function setAnswer(quiz, option) {
    const existingAnswer = props.answers.find(ans => ans.id === quiz.id);

    if (props.questionType === 'multiple') {
      let selectedOptions = existingAnswer ? [...existingAnswer.selectedOptions] : [];

      // Toggle the option in the selectedOptions array
      if (selectedOptions.includes(option)) {
        selectedOptions = selectedOptions.filter(opt => opt !== option); // Remove if already selected
      } else {
        selectedOptions.push(option); // Add if not already selected
      }
      const newAnswer = {
        question: quiz.question,
        selectedOptions: selectedOptions,
        options: quiz.options,
        id: quiz.id
        // Update the selected options
      };

      emit('updateAnswers', newAnswer);
    } else {
      // For single choice questions, just replace the selected option
      const newAnswer = {
        question: quiz.question,
        selectedOptions: [option],
        options: quiz.options,
        id: quiz.id
        // Single option for single-choice question
      };
      emit('updateAnswers', newAnswer);
    }
  }

  function isAnswered(quiz, option) {
    const existingAnswer = props.answers.find(ans => ans.id === quiz.id);
    if (!existingAnswer) return false;

    if (props.questionType === 'multiple') {
      return existingAnswer.selectedOptions.includes(option);;
    } else {
      return existingAnswer.selectedOptions.length;
    }
  }

  function isSelected(quiz, option) {
    const existingAnswer = props.answers.find(ans => ans.id === quiz.id);
    if (!existingAnswer) return false;

    if (props.questionType === 'multiple') {
      return existingAnswer.selectedOptions.includes(option);
    } else {
      return existingAnswer.selectedOptions[0] === option;
    }
  }

</script>