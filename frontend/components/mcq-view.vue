<template>
    <div class="">
        <div class="mt-4" v-for="(quiz, quizIndex) in questions" :key="quizIndex">
            <h4 class="text-[#5E5E5E] font-medium">
                {{ quiz.question }}
            </h4>

            <div class="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-2">
                <div v-for="(option, optionIndex) in quiz.options" :key="optionIndex">
                    <p class="border-[#D0D0D0] border-solid border px-3 py-2 rounded-sm">
                        {{ String.fromCharCode(65 + optionIndex) }}. {{ option }}
                    </p>

                </div>
            </div>
            <div v-if="showAnswer" class="flex gap-2 mt-4">
                <p>Answer:</p>
                <div class="" v-for="(option, optionIndex) in quiz.options" :key="optionIndex">
                    <div class="flex gap-1">
                        <input :checked="quiz.answers.includes(option)" type="checkbox"
                            :disabled="!quiz.answers.includes(option)" class="accent-pink-500" />
                        <label> {{ String.fromCharCode(65 + optionIndex) }}</label>
                    </div>
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
    showAnswer: {
        type: Boolean,
        required: true,
    },

});


</script>