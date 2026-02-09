<script setup lang="ts">
import Fuse from 'fuse.js'
import { useDebounceFn, onClickOutside } from '@vueuse/core'

const { data: pages } = await useFetch('/api/pages')
const query = ref('')
const showResults = ref(false)
const searchRef = ref<HTMLElement>()

// 加载所有页面内容用于搜索
const { data: allPages } = await useFetch('/api/pages/all', {
  transform: async (slugs) => {
    if (!Array.isArray(slugs)) return []
    const pagesData = await Promise.all(
      slugs.map(async (slug) => {
        const { data } = await $fetch(`/api/pages/${slug}`)
        return { slug, ...data }
      })
    )
    return pagesData
  }
})

const fuse = computed(() => {
  if (!allPages.value) return null
  return new Fuse(allPages.value, {
    keys: [
      { name: 'slug', weight: 0.3 },
      { name: 'parsed.data.title', weight: 0.4 },
      { name: 'body', weight: 0.3 }
    ],
    threshold: 0.4,
    ignoreLocation: true
  })
})

const searchResults = computed(() => {
  if (!query.value || !fuse.value) return []
  return fuse.value.search(query.value).map(r => r.item)
})

const debouncedSearch = useDebounceFn((val: string) => {
  query.value = val
}, 300)

onClickOutside(searchRef, () => {
  showResults.value = false
})

watch(query, (val) => {
  showResults.value = val.length > 0
})
</script>

<template>
  <div ref="searchRef" class="relative">
    <UInput
      icon="i-lucide-search"
      placeholder="搜索文档..."
      size="sm"
      color="neutral"
      variant="soft"
      @input="debouncedSearch($event)"
      @focus="showResults = query.length > 0"
    />
    <div
      v-if="showResults && searchResults.length > 0"
      class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
    >
      <div class="max-h-96 overflow-y-auto">
        <NuxtLink
          v-for="page in searchResults"
          :key="page.slug"
          :to="page.slug === 'index' ? '/' : `/${page.slug}`"
          class="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          @click="showResults = false"
        >
          <div class="font-medium text-gray-900 dark:text-gray-100">
            {{ page.parsed?.data?.title || page.slug }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ page.slug === 'index' ? '首页' : page.slug }}
          </div>
        </NuxtLink>
      </div>
    </div>
    <div
      v-if="showResults && query && searchResults.length === 0"
      class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-500 dark:text-gray-400"
    >
      未找到相关文档
    </div>
  </div>
</template>
