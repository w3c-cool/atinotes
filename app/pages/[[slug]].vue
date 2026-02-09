<script setup>
const editing = ref(false)
const saving = ref(false)
const slug = useRoute().params.slug || 'index'
const { data: page } = await useFetch(`/api/pages/${slug}`)
const { data: pages } = await useFetch('/api/pages/all')
const { loggedIn } = useUserSession()

// 计算阅读时间 (约 400 字/分钟)
const readTime = computed(() => {
  if (!page.value?.body) return 0
  const wordCount = page.value.body.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 400))
})

useSeoMeta({
  titleTemplate: '%s | W3C技术联盟',
  title: () => page.value.parsed.data?.title || 'Missing title',
  description: () => page.value.parsed.data?.description || 'Missing description',
  ogTitle: () => (page.value.parsed.data?.title || 'Missing title') + ' | W3C技术联盟'
})

defineOgImageComponent('OgImagePage', {
  title: page.value.parsed.data?.title || 'Missing title',
  description: page.value.parsed.data?.description || 'Missing description'
})

function editMode() {
  if (!loggedIn.value) {
    return
  }
  editing.value = true
}

function save() {
  if (!editing.value || saving.value) return
  saving.value = true
  $fetch(`/api/pages/${slug}`, {
    method: 'PUT',
    body: { body: page.value.body }
  }).then(async ({ parsed }) => {
    page.value.parsed = parsed
    editing.value = saving.value = false
  }).catch((err) => {
    editing.value = saving.value = false
    alert(err.data.message)
  })
}

const currentPath = computed(() => slug === 'index' ? '/' : `/${slug}`)
</script>

<template>
  <UPage>
    <template #left>
      <Sidebar />
    </template>

    <template
      v-if="page.parsed?.toc?.links?.length"
      #right
    >
      <UContentToc :links="page.parsed?.toc?.links" />
    </template>

    <!-- 面包屑导航 -->
    <Breadcrumb :current-slug="slug" />

    <UPageHeader
      v-if="!editing"
      :title="page.parsed?.data?.title"
      :description="page.parsed?.data?.description"
      @dblclick="editMode"
    >
      <template
        v-if="loggedIn"
        #links
      >
        <UButton
          color="neutral"
          icon="i-lucide-pen"
          variant="soft"
          label="Edit"
          size="sm"
          @click="editMode"
        />
      </template>
    </UPageHeader>

    <!-- 页面元信息 -->
    <PageMeta
      v-if="!editing"
      :updated-at="page.parsed?.data?.updatedAt"
      :author="page.parsed?.data?.author"
      :read-time="readTime"
      :tags="page.parsed?.data?.tags"
    />

    <UPageBody
      prose
      @dblclick="editMode"
    >
      <form
        v-if="editing"
        @submit.prevent="save"
      >
        <MarkdownEditor
          v-model="page.body"
          :saving="saving"
        />
      </form>
      <div v-else>
        <MDCRenderer
          :body="page.parsed.body"
          class="body"
        />
        <!-- 上一篇/下一篇导航 -->
        <PageNavigation
          v-if="pages"
          :current-slug="slug"
          :pages="pages"
        />
      </div>
    </UPageBody>
  </UPage>
</template>

<style lang="postcss" scoped>
textarea {
  width: 100%;
  min-height: 200px;
  height: 100%;
  border-width: 0;
  outline: none;
  resize: none;
}
</style>
