<template>
    <!-- class="group flex items-center justify-between rounded-lg border border-current px-5 py-3 border-gray-800 text-gray-900 transition-colors hover:bg-indigo-600 focus:outline-none focus:ring active:bg-indigo-500" -->
    <a 
        class="m-1.5 block  group-hover:text-white hover:text-cyan text-fill-white w-fit h-min rounded-full border border-current px-5 py-3 border-white text-white transition-colors hover:bg-indigo-600 focus:outline-none focus:ring active:bg-indigo-500"
        style="text-shadow: rgb(0, 0, 0) 4px 0px 5px,
                            rgb(0, 0, 0) -4px 0px 5px,
                            rgb(0, 0, 0) 0px 4px 5px,
                            rgb(0, 0, 0) 0px -4px 5px;
                box-shadow: rgb(0,0,0) 0px 0px 10px inset, rgb(0,0,0) 0px 0px 10px;"
        :href="href" >
        <!-- style="text-shadow: #6366f1 0px 0px 5px;" -->
        <span class="font-medium text-sm">
            {{ text }}
        </span>
        <!-- <font-awesome-icon icon="fa-solid fa-caret-right" size="sm"/> -->
    </a>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps<{
    text: string
    href?: string
}>()
</script>