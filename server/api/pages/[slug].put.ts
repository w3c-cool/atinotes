import { kv } from 'hub:kv'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

export default eventHandler(async (event) => {
  await requireUserSession(event)
  const { slug } = event.context.params || {}
  if (!slug) {
    throw createError({ statusCode: 400, message: 'Missing slug' })
  }
  // Force being a string
  const { body } = await readBody(event)
  const parsed = await parseMarkdown(body)

  // 添加更新时间戳
  const updatedAt = new Date().toISOString()

  // 如果 parsed.data 存在,保留原有数据并添加更新时间
  if (parsed.data) {
    parsed.data.updatedAt = updatedAt
  } else {
    parsed.data = { updatedAt }
  }

  await kv.set(slug, { body, parsed })

  return { slug, body, parsed }
})
