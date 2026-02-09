<script setup lang="ts">
const props = defineProps<{
  title: string
  icon?: string
  items: Array<{
    slug: string
    title?: string
  }>
  currentPath: string
}>()

const isOpen = ref(true)

const isCurrent = (slug: string) => {
  return props.currentPath === (slug === 'index' ? '/' : `/${slug}`)
}
</script>

<template>
  <div class="mb-4">
    <button
      class="flex items-center justify-between w-full px-2 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center gap-2">
        <UIcon v-if="icon" :name="icon" class="w-4 h-4" />
        <span>{{ title }}</span>
      </div>
      <UIcon
        :name="isOpen ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
        class="w-4 h-4 transition-transform"
      />
    </button>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="isOpen" class="mt-1 space-y-1">
        <NuxtLink
          v-for="item in items"
          :key="item.slug"
          :to="item.slug === 'index' ? '/' : `/${item.slug}`"
          class="flex items-center px-2 py-1.5 text-sm rounded-md transition-colors"
          :class="isCurrent(item.slug)
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          "
        >
          {{ item.title || (item.slug === 'index' ? '首页' : item.slug) }}
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>
