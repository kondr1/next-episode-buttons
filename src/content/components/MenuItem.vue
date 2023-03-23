<template>
    <a
        href="#"
        class="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700! dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        role="menuitem"
        @click="$parent?.$emit('checked', value)"
    >
        {{value}}
    </a>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
defineProps<{
    value: string
}>()
</script>