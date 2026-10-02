<template>
  <div class="w-[100%] my-auto">
  </div>
</template>

<script setup>
definePageMeta({
  layout: "app",
});
import { onMounted } from "vue";
onMounted(async () => {
  navigateTo('/')
});
const showTimer = ref(true);
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
</style>
