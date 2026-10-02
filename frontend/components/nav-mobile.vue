<template>
  <div
    class="navigation w-full px-4 py-4 fixed top-0 left-0 overflow-hidden z-10 bg-white shadow-md"
  >
    <div class="header-content flex justify-between items-center flex-row">
      <div class="flex gap-4">
        <NuxtLink to="/">
          <img class="h-[32px]" src="/static/icon.svg" alt="" />
        </NuxtLink>
      </div>
      <div class="flex items-center ml-auto">
        <button @click.stop="showMenuPopup = !showMenuPopup">Menu</button>
      </div>
    </div>
  </div>

  <div
    v-if="showMenuPopup"
    class="popup-sidebar fixed top-[70px] left-0 z-50 w-[300px] h-[calc(100vh-70px)] overflow-y-auto"
  >
    <mobile-menu></mobile-menu>
  </div>
</template>
<script setup>
const showMenuPopup = ref(false);
</script>
<style scoped>
@media screen and (max-width: 1023px) {
  .navigation {
    display: block !important;
    width: 100%;
    margin: 0 auto;
  }

  .popup-sidebar {
    display: block !important;
    background: linear-gradient(
      239.25deg,
      #34166c 37.6%,
      #1a4435 66.06%,
      #441ba1 85.95%
    );
  }
}

.navigation {
  display: none;
}

.popup-sidebar {
  display: none;
}
</style>
