<template>
    <div class="block rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
        <h3 class="mt-3 text-xl font-bold text-white">{{title}}</h3>
        <p class="mt-4 text-sm mb-5 text-gray-300">
            {{ caption }}
        </p>
        <slot > </slot>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  caption: string
}>()
</script>