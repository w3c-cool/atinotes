/**
 * 侧边栏配置类型定义
 */

export interface SidebarItem {
  slug: string
  title?: string
}

export interface SidebarGroup {
  title: string
  icon?: string
  items: SidebarItem[]
}
