<script setup lang="ts">
import Fuse from 'fuse.js'
import { useDebounceFn, onClickOutside } from '@vueuse/core'

const query = ref('')
const showResults = ref(false)
const searchRef = ref<HTMLElement>()

// 所有页面数据
const allPages = ref<any[]>([])

// 客户端加载所有页面内容
onMounted(async () => {
  try {
    const slugs = await $fetch<string[]>('/api/pages')
    if (!Array.isArray(slugs)) return

    const pagesData = await Promise.all(
      slugs.map(async (slug) => {
        try {
          const page = await $fetch(`/api/pages/${slug}`)
          return { slug, ...page }
        } catch {
          return null
        }
      })
    )
    allPages.value = pagesData.filter((p): p is NonNullable<typeof p> => p !== null)
  } catch {
    // 静默失败
  }
})

const fuse = computed(() => {
  if (!Array.isArray(allPages.value) || allPages.value.length === 0) return null
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
      @focus="showResults = query.value.length > 0"
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
