<template>
    <nav aria-label="Breadcrumb" class="mb-4">
        <ol class="flex flex-wrap items-center text-sm text-gray-500 overflow-x-auto ">
            <li v-for="(item, index) in breadcrumbItems" :key="index" class="flex items-center sm:mb-0 mb-4">
                <div class="flex flex-row items-center">
                    <div v-if="index > 0" aria-hidden="true">
                        <svg class="w-4 h-4 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <NuxtLink v-if="item.path !== route.fullPath" :to="item.path"
                        class="hover:text-gray-700 font-bold text-purple-link truncate max-w-xs sm:max-w-none">
                        {{ item.name }}
                    </NuxtLink>
                    <span v-else class="font-medium text-gray-700 truncate max-w-xs sm:max-w-none">
                        {{ item.name }}
                    </span>
                </div>
            </li>
        </ol>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbItems = computed(() => {
    const pathArray = route.path.split('/').filter(Boolean);
    let currentPath = '';

    return [
        { name: 'Dashboard', path: '/' },
        ...pathArray.map((segment) => {
            currentPath += `/${segment}`;
            return {
                name: formatSegment(segment),
                path: currentPath,
            };
        }),
    ];
});

function formatSegment(segment) {
    // Handle dynamic route segments
    if (segment.startsWith('[') && segment.endsWith(']')) {
        const paramName = segment.slice(1, -1);
        return route.params[paramName] || paramName;
    }

    // Capitalize
    return segment.charAt(0).toUpperCase() + segment.slice(1);
}
</script>

<style scoped>
.text-purple-link {
    color: #1A4435;
}
</style>
