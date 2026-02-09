<script setup lang="ts">
const props = defineProps<{
  currentSlug: string
  pages: string[]
}>()

const currentIndex = computed(() => props.pages.indexOf(props.currentSlug))

const prevPage = computed(() => {
  if (currentIndex.value <= 0) return null
  return props.pages[currentIndex.value - 1]
})

const nextPage = computed(() => {
  if (currentIndex.value === -1 || currentIndex.value >= props.pages.length - 1) return null
  return props.pages[currentIndex.value + 1]
})
</script>

<template>
  <div v-if="prevPage || nextPage" class="flex justify-between gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
    <UButton
      v-if="prevPage"
      :to="prevPage === 'index' ? '/' : `/${prevPage}`"
      icon="i-lucide-arrow-left"
      color="neutral"
      variant="ghost"
      trailing
    >
      <template #default>
        <div class="text-left">
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">上一篇</div>
          <div>{{ prevPage === 'index' ? '首页' : prevPage }}</div>
        </div>
      </template>
    </UButton>

    <div v-else class="flex-1" />

    <UButton
      v-if="nextPage"
      :to="nextPage === 'index' ? '/' : `/${nextPage}`"
      icon="i-lucide-arrow-right"
      color="neutral"
      variant="ghost"
    >
      <template #default>
        <div class="text-right">
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">下一篇</div>
          <div>{{ nextPage === 'index' ? '首页' : nextPage }}</div>
        </div>
      </template>
    </UButton>
  </div>
</template>
