<script setup lang="ts">
const props = defineProps<{
  currentSlug: string
}>()

const breadcrumbItems = computed(() => {
  if (props.currentSlug === 'index') {
    return [{ label: '首页', to: '/' }]
  }

  // 将 slug 按 / 分割生成面包屑
  const parts = props.currentSlug.split('/').filter(Boolean)
  const items = [
    { label: '首页', to: '/' }
  ]

  let path = ''
  parts.forEach((part, index) => {
    path += `/${part}`
    const isLast = index === parts.length - 1
    items.push({
      label: part,
      to: isLast ? undefined : path
    })
  })

  return items
})
</script>

<template>
  <nav class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
    <template v-for="(item, index) in breadcrumbItems" :key="item.label">
      <UIcon name="i-lucide-chevron-right" class="w-4 h-4" :class="{ 'invisible': index === 0 }" />
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-else class="text-gray-900 dark:text-gray-100 font-medium">
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
