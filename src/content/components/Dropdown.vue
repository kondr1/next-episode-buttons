<template>
    <div class="inline-flex items-stretch rounded-md border bg-white dark:border-gray-800 dark:bg-gray-900">
  <a
    @click="ok = !ok"
    class="rounded-l-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-200"
  >
    {{val}}
  </a>

  <div class="relative">
    <button
      type="button"
      class="inline-flex h-full items-center justify-center rounded-r-md border-l border-gray-100 px-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      @click="ok = !ok"
    >
      <span class="sr-only">Menu</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <div
      class="absolute right-0 z-10 mt-4 w-56 origin-top-right rounded-md border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
      role="menu"
      v-show="ok"
    >
      <DropdownInternal @checked="checked">
        <slot ></slot>
      </DropdownInternal>
    </div>
  </div>
</div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import DropdownInternal from './internal/DropdownInternal.vue';

const props = defineProps<{
    modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

let ok = ref(false)
let val = ref(props.modelValue)

function checked(e: any) {
    ok.value = false
    val = e
    emit('update:modelValue', e)
}

</script>