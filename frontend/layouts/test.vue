<template>

    <div class="min-h-screen custom-bg-color text-gray-800">
        <main class="my-auto flex flex-col w-full transition-all duration-150 ease-in">
            <nav-mobile class="block sm:hidden"></nav-mobile>
            <app-navbar class="sm:block hidden"></app-navbar>
            <div class="mt-8 sm:mt-28 mb-8 mx-auto contains flex flex-col justify-center items-center ">
                <slot />
            </div>
        </main>
    </div>
</template>

<script setup></script>
<style scoped>
    @media screen and (max-width: 420px) {
        .mobile {
            width: 90%;
            margin: 0 auto;
        }
    }

    @media screen and (max-width: 1023px) {
        .custom-bg-color {
            margin: 0 auto;
        }

        .contains {
            width: 90%;
            margin: 6rem auto 1rem auto;
        }
    }

    @media screen and (min-width: 1024px) {
        .contains {
            max-width: 100vw;
            width: 90%;
        }
    }
</style>
