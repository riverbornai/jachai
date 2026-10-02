<template>
  <div class="">
    <div class="mt-4" v-for="(quiz, quizIndex) in questions" :key="quizIndex">
      <h4 v-if="!isEditing(quizIndex, 'question')" @click="showInputFieldForEdit(quizIndex, 'question')"
        class="text-[#5E5E5E] font-medium">
        <span class="font-bold">{{ quizIndex + 1 }}.</span> {{ quiz.question }}
      </h4>
      <input v-else class="border-[#D0D0D0] border-solid border px-3 py-2 rounded-sm w-[100%]" :value="quiz.question"
        @blur="setData(quizIndex, 'question', $event.target.value)"
        @keypress.enter="setData(quizIndex, 'question', $event.target.value)" type="text">
      <div class="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-2">
        <div v-for="(option, optionIndex) in quiz.options" :key="optionIndex">
          <p v-if="!isEditing(quizIndex, `option-${optionIndex}`)"
            @click="showInputFieldForEdit(quizIndex, `option-${optionIndex}`)"
            class="border-[#D0D0D0] border-solid border px-3 py-2 rounded-sm">
            {{ String.fromCharCode(65 + optionIndex) }}. {{ option }}
          </p>
          <input class="border-[#D0D0D0] border-solid border px-3 py-2 rounded-sm w-[100%]" v-else
            @blur="setData(quizIndex, `option-${optionIndex}`, $event.target.value)"
            @keypress.enter="setData(quizIndex, `option-${optionIndex}`, $event.target.value)" :value="option"
            type="text" />
        </div>
      </div>
      <div v-if="showAnswer" class="flex flex-col item-start gap-2 mt-4">
        <p>Answers:</p>
        <div v-for="(answer, answerIndex) in quiz.answers" :key="answerIndex">
          <p v-if="!isEditing(quizIndex, `answer-${answerIndex}`)"
            @click="showInputFieldForEdit(quizIndex, `answer-${answerIndex}`)"
            class="border-[#D0D0D0] border-solid border px-3 py-2 rounded-sm">
            {{ answer }}
          </p>
          <input class="border-[#D0D0D0] border-solid border px-3 py-2 rounded-sm w-[100%] grid grid-cols-2" v-else
            @blur="setData(quizIndex, `answer-${answerIndex}`, $event.target.value)"
            @keypress.enter="setData(quizIndex, `answer-${answerIndex}`, $event.target.value)" :value="answer"
            type="text" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    questions: {
      type: Array,
      required: true,
    },
    showAnswer: {
      type: Boolean,
      required: true,
    },
  });

  const editingState = ref({});

  function showInputFieldForEdit(quizIndex, field) {
    if (!editingState.value[quizIndex]) {
      editingState.value[quizIndex] = {};
    }
    editingState.value[quizIndex][field] = true;
  }

  function isEditing(quizIndex, field) {
    return editingState.value[quizIndex]?.[field] || false;
  }

  function setData(quizIndex, field, newValue) {
    const quiz = props.questions[quizIndex];
    if (quiz) {
      if (field === 'question') {
        quiz.question = newValue;
      } else if (field.startsWith('option-')) {
        const optionIndex = parseInt(field.split('-')[1]);
        quiz.options[optionIndex] = newValue;
      } else if (field.startsWith('answer-')) {
        const answerIndex = parseInt(field.split('-')[1]);
        quiz.answers[answerIndex] = newValue;
      }
    }
    editingState.value[quizIndex][field] = false;
  }
</script>