<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  saving?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  save: []
}>()

const showPreview = ref(true)
const editor = ref<HTMLTextAreaElement>()

function autogrow() {
  if (!editor.value) return
  editor.value.style.height = '5px'
  editor.value.style.height = `${editor.value.scrollHeight}px`
}

const { parsed } = useAsyncData(`markdown-preview-${props.modelValue.slice(0, 20)}`, async () => {
  if (!props.modelValue) return null
  return await parseMarkdown(props.modelValue)
}, {
  watch: [() => props.modelValue]
})

onMounted(() => {
  autogrow()
})

watch(() => props.modelValue, autogrow)
</script>

<template>
  <div class="markdown-editor">
    <!-- 工具栏 -->
    <div class="flex items-center justify-between mb-4 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-t-lg border border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-2">
        <UButton
          :icon="showPreview ? 'i-lucide-layout' : 'i-lucide-file-text'"
          size="xs"
          color="neutral"
          variant="ghost"
          @click="showPreview = !showPreview"
        >
          {{ showPreview ? '分屏预览' : '仅编辑' }}
        </UButton>
        <USeparator orientation="vertical" class="h-4" />
        <UTooltip text="粗题">
          <UButton
            icon="i-lucide-bold"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="emit('update:modelValue', modelValue + '**粗体**')"
          />
        </UTooltip>
        <UTooltip text="斜体">
          <UButton
            icon="i-lucide-italic"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="emit('update:modelValue', modelValue + '*斜体*')"
          />
        </UTooltip>
        <UTooltip text="代码">
          <UButton
            icon="i-lucide-code"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="emit('update:modelValue', modelValue + '`代码`')"
          />
        </UTooltip>
        <UTooltip text="链接">
          <UButton
            icon="i-lucide-link"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="emit('update:modelValue', modelValue + '[链接](url)')"
          />
        </UTooltip>
        <UTooltip text="引用">
          <UButton
            icon="i-lucide-quote"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="emit('update:modelValue', modelValue + '> 引用')"
          />
        </UTooltip>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          type="submit"
          :loading="saving"
          size="xs"
          color="neutral"
        >
          {{ saving ? 'Saving' : 'Save' }}
        </UButton>
        <USlot name="cancel">
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
          >
            Cancel
          </UButton>
        </USlot>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="flex border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
      <!-- 编辑器 -->
      <div
        class="flex-1"
        :class="{ 'w-1/2': showPreview }"
      >
        <textarea
          ref="editor"
          :value="modelValue"
          class="w-full h-full min-h-[400px] p-4 font-mono text-sm resize-none focus:outline-none"
          @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        />
      </div>

      <!-- 预览 -->
      <div
        v-if="showPreview"
        class="w-1/2 p-4 overflow-y-auto bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none border-l border-gray-200 dark:border-gray-700"
      >
        <MDCRenderer v-if="parsed" :body="parsed.body" />
        <div v-else class="text-gray-400">预览区域</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.markdown-editor {
  @apply w-full;
}
</style>
