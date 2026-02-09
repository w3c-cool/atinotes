<script setup>
const editor = ref(null)
const editing = ref(false)
const saving = ref(false)
const slug = useRoute().params.slug || 'index'
const { data: page } = await useFetch(`/api/pages/${slug}`)
const { data: pages } = await useFetch('/api/pages')
const { loggedIn } = useUserSession()

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

async function editMode() {
  if (!loggedIn.value) {
    return
  }
  editing.value = true
  await nextTick()
  editor.value.focus()
  autogrow()
}

function autogrow() {
  if (!editor.value) return
  editor.value.style.height = '5px'
  editor.value.style.height = `${editor.value.scrollHeight}px`
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
      <div class="mb-6">
        <h3 class="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">
          文档列表
        </h3>
        <ul class="space-y-1">
          <li v-for="p in pages || []" :key="p">
            <NuxtLink
              :to="p === 'index' ? '/' : `/${p}`"
              class="flex items-center px-2 py-1.5 text-sm rounded-md transition-colors"
              :class="currentPath === (p === 'index' ? '/' : `/${p}`)
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              "
            >
              {{ p === 'index' ? '首页' : p }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </template>
    <template
      v-if="page.parsed?.toc?.links?.length"
      #right
    >
      <UContentToc :links="page.parsed?.toc?.links" />
    </template>
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
    <UPageBody
      prose
      @dblclick="editMode"
    >
      <form
        v-if="editing"
        class="editor-wrapper"
        @submit.prevent="save"
      >
        <textarea
          ref="editor"
          v-model="page.body"
          @blur="save"
          @input="autogrow"
        />
        <UButton type="submit">
          {{ saving ? 'Saving' : 'Save' }}
        </UButton>
      </form>
      <MDCRenderer
        v-else
        :body="page.parsed.body"
        class="body"
      />
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
