<script setup lang="ts">
const props = defineProps<{
  updatedAt?: string
  author?: string
  readTime?: number
  tags?: string[]
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
    <div v-if="updatedAt" class="flex items-center gap-1">
      <UIcon name="i-lucide-calendar" class="w-4 h-4" />
      <span>{{ formatDate(updatedAt) }}</span>
    </div>

    <div v-if="readTime" class="flex items-center gap-1">
      <UIcon name="i-lucide-clock" class="w-4 h-4" />
      <span>约 {{ readTime }} 分钟阅读</span>
    </div>

    <div v-if="author" class="flex items-center gap-1">
      <UIcon name="i-lucide-user" class="w-4 h-4" />
      <span>{{ author }}</span>
    </div>

    <div v-if="tags && tags.length > 0" class="flex items-center gap-2">
      <UIcon name="i-lucide-tag" class="w-4 h-4" />
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="tag in tags"
          :key="tag"
          :label="tag"
          color="neutral"
          variant="subtle"
          size="xs"
        />
      </div>
    </div>
  </div>
</template>
