<script setup lang="ts">
import type { SidebarGroup } from '~/types/sidebar'

const route = useRoute()
const currentPath = computed(() => {
  return route.path
})

// 获取所有页面
const { data: allPages } = await useFetch<string[]>('/api/pages/all')

// 获取页面标题缓存
const pageTitles = ref<Record<string, string>>({})

// 分组图标映射
const groupIcons: Record<string, string> = {
  'index': 'i-lucide-home',
  'getting-started': 'i-lucide-rocket',
  'tutorial': 'i-lucide-book',
  'api': 'i-lucide-code',
  'guide': 'i-lucide-compass',
  'docs': 'i-lucide-file-text',
  'reference': 'i-lucide-bookmark',
  'examples': 'i-lucide-lightbulb',
  'faq': 'i-lucide-help-circle',
  'changelog': 'i-lucide-clock',
  'blog': 'i-lucide-newspaper',
  'about': 'i-lucide-info',
  '其他': 'i-lucide-more-horizontal'
}

// 自动生成分组
const autoGroups = computed(() => {
  if (!Array.isArray(allPages.value)) return []

  const groups: Map<string, SidebarGroup> = new Map()

  // 先添加首页
  const indexPage = allPages.value.find(p => p === 'index')
  if (indexPage) {
    groups.set('index', {
      title: '开始',
      icon: 'i-lucide-home',
      items: [
        { slug: 'index', title: '首页' }
      ]
    })
  }

  // 遍历所有页面进行分组
  allPages.value.forEach(slug => {
    if (slug === 'index') return // 首页已处理

    const parts = slug.split('/')
    let groupName = '其他'
    let groupIcon = groupIcons['其他']

    if (parts.length === 1) {
      // 一级路径,单独成组或归类到"其他"
      const groupKey = parts[0]
      if (groupIcons[groupKey]) {
        groupName = groupKey
        groupIcon = groupIcons[groupKey]
      } else {
        // 使用 slug 作为标题,不单独成组
        if (!groups.has('其他')) {
          groups.set('其他', {
            title: '其他',
            icon: groupIcons['其他'],
            items: []
          })
        }
        groups.get('其他')?.items.push({ slug })
        return
      }
    } else {
      // 多级路径,使用第一级作为分组名
      groupName = parts[0]
      groupIcon = groupIcons[groupName] || 'i-lucide-folder'
    }

    if (!groups.has(groupName)) {
      groups.set(groupName, {
        title: groupName === 'index' ? '开始' :
               groupName === 'tutorial' ? '教程' :
               groupName === 'api' ? 'API' :
               groupName === 'guide' ? '指南' :
               groupName.charAt(0).toUpperCase() + groupName.slice(1),
        icon: groupIcon,
        items: []
      })
    }

    // 优先使用页面真实标题,否则从路径生成
    const pageTitle = pageTitles.value[slug]
    const title = pageTitle || parts[parts.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    groups.get(groupName)?.items.push({ slug, title })
  })

  // 转换为数组并排序
  return Array.from(groups.values()).sort((a, b) => {
    // 首页在最前
    if (a.title === '开始') return -1
    if (b.title === '开始') return 1
    // 其他在最后
    if (a.title === '其他') return 1
    if (b.title === '其他') return -1
    return a.title.localeCompare(b.title, 'zh-CN')
  })
})

// 客户端加载页面标题
onMounted(async () => {
  if (Array.isArray(allPages.value)) {
    const titlesPromises = allPages.value.map(async (slug) => {
      try {
        const page = await $fetch(`/api/pages/${slug}`)
        return { slug, title: page.parsed?.data?.title }
      } catch {
        return { slug, title: null }
      }
    })

    const results = await Promise.all(titlesPromises)
    results.forEach(({ slug, title }) => {
      if (title) {
        pageTitles.value[slug] = title
      }
    })
  }
})
</script>

<template>
  <div class="space-y-4">
    <!-- 搜索框 -->
    <div class="mb-6">
      <Search />
    </div>

    <!-- 分组侧边栏 -->
    <div class="space-y-1">
      <SidebarGroup
        v-for="group in autoGroups"
        :key="group.title"
        :title="group.title"
        :icon="group.icon"
        :items="group.items"
        :current-path="currentPath"
      />
    </div>
  </div>
</template>
