# FlowNote 组件文档

本文档介绍 FlowNote 中可用的 React 组件及其使用方法。

## 目录

- [UI 组件](#ui-组件)
- [动画组件](#动画组件)
- [自定义 Hooks](#自定义-hooks)
- [工具函数](#工具函数)

---

## UI 组件

### Button

**来源**: `shadcn/ui`

```tsx
import { Button } from '@/components/ui/button'

// 变体
<Button>默认</Button>
<Button variant="secondary">次要</Button>
<Button variant="destructive">危险</Button>
<Button variant="outline">轮廓</Button>
<Button variant="ghost">幽灵</Button>
<Button variant="link">链接</Button>

// 尺寸
<Button size="default">默认</Button>
<Button size="sm">小</Button>
<Button size="lg">大</Button>
<Button size="icon">图标</Button>
```

### Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>打开</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>标题</DialogTitle>
    </DialogHeader>
    <div>内容</div>
  </DialogContent>
</Dialog>
```

### Input

```tsx
import { Input } from '@/components/ui/input'

<Input placeholder="占位符" />
<Input type="password" />
<Input type="number" />
<Input disabled />
```

### Textarea

```tsx
import { Textarea } from '@/components/ui/textarea'

<Textarea placeholder="输入内容..." rows={4} />
```

### Badge

```tsx
import { Badge } from '@/components/ui/badge'

<Badge>默认</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="outline">轮廓</Badge>
<Badge variant="destructive">危险</Badge>
```

---

## 动画组件

### FadeIn

淡入动画组件。

```tsx
import { FadeIn } from '@/components/page-transition'

<FadeIn>
  <Content />
</FadeIn>

// 延迟和方向
<FadeIn delay={0.2} direction="up">
  <Content />
</FadeIn>
```

**Props**:
- `delay`: 延迟时间（秒）
- `duration`: 动画时长（秒）
- `direction`: 'up' | 'down' | 'left' | 'right' | 'none'

### ScaleOnTap

点击缩放效果。

```tsx
import { ScaleOnTap } from '@/components/page-transition'

<ScaleOnTap>
  <Button>点击缩放</Button>
</ScaleOnTap>

// 自定义缩放比例
<ScaleOnTap scale={0.9}>
  <Card />
</ScaleOnTap>
```

### HoverCard

悬停上浮效果。

```tsx
import { HoverCard } from '@/components/page-transition'

<HoverCard>
  <div className="p-4 bg-card rounded-lg">
    悬停查看效果
  </div>
</HoverCard>
```

### StaggerContainer / StaggerItem

列表交错动画。

```tsx
import { StaggerContainer, StaggerItem } from '@/components/page-transition'

<StaggerContainer staggerDelay={0.1}>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <ListItem {...item} />
    </StaggerItem>
  ))}
</StaggerContainer>
```

### SlideIn

滑入动画。

```tsx
import { SlideIn } from '@/components/page-transition'

<SlideIn direction="left">
  <Sidebar />
</SlideIn>
```

---

## 骨架屏组件

### Skeleton

基础骨架屏。

```tsx
import { Skeleton } from '@/components/skeletons'

<Skeleton className="h-4 w-32" />
```

### CardSkeleton

卡片骨架屏。

```tsx
import { CardSkeleton } from '@/components/skeletons'

<CardSkeleton />
```

### 页面骨架屏

```tsx
import { IdeasSkeleton, JournalSkeleton, FinanceSkeleton } from '@/components/skeletons'

// 加载状态
if (isLoading) {
  return <IdeasSkeleton />
}
```

---

## 自定义 Hooks

### useI18n

国际化 Hook。

```tsx
import { useI18n } from '@/lib/i18n'

function Component() {
  const { t, locale, setLocale } = useI18n()
  
  return (
    <div>
      <h1>{t('ideas.title')}</h1>
      <button onClick={() => setLocale('en')}>
        Switch to English
      </button>
    </div>
  )
}
```

**返回值**:
- `t(key: string)`: 翻译函数
- `locale`: 当前语言 'zh' | 'en'
- `setLocale`: 切换语言函数

---

## 工具函数

### cn

Tailwind 类名合并。

```tsx
import { cn } from '@/lib/utils'

const className = cn(
  'base-class',
  isActive && 'active-class',
  'override-class'
)
```

### storage

分片存储工具。

```tsx
import { storage } from '@/lib/storage'

// 保存数据（自动分片）
storage.setItem('key', data)

// 读取数据
const data = storage.getItem('key')

// 删除数据
storage.removeItem('key')

// 查看存储使用
const { used, total, percentage } = storage.getUsage()

// 清空所有 FlowNote 数据
storage.clearAll()
```

---

## 布局组件

### FlowShell

应用外壳布局，包含侧边栏和导航。

```tsx
// app/layout.tsx
import FlowShell from '@/components/flow-shell'

export default function Layout({ children }) {
  return (
    <FlowShell>
      {children}
    </FlowShell>
  )
}
```

### Providers

全局 Provider 组合。

```tsx
// app/layout.tsx
import { Providers } from '@/components/providers'

export default function Layout({ children }) {
  return (
    <Providers>
      {children}
    </Providers>
  )
}
```

包含：
- I18nProvider (国际化)
- ThemeProvider (主题)
- Toaster (Toast 通知)

---

## 图标

使用 Lucide React 图标库：

```tsx
import { Plus, Trash, Edit, Settings } from 'lucide-react'

<Plus className="h-4 w-4" />
<Settings className="h-6 w-6" />
```

常用图标：
- `Lightbulb` - 灵感
- `BookOpen` - 日记
- `Wallet` - 财务
- `Plus` - 添加
- `Trash2` - 删除
- `Edit` - 编辑
- `Settings` - 设置
- `Moon` / `Sun` - 主题切换
- `Globe` - 语言切换
- `Menu` - 菜单
- `ChevronLeft` / `ChevronRight` - 箭头
- `Sparkles` - 空状态

---

## 最佳实践

### 组件组合

```tsx
// 推荐：组合小组件
<ScaleOnTap>
  <Button variant="secondary" className="shadow-lg">
    <Plus className="h-5 w-5" />
    {t('ideas.newIdea')}
  </Button>
</ScaleOnTap>

// 推荐：动画包裹内容
<FadeIn delay={0.1}>
  <HoverCard>
    <Card />
  </HoverCard>
</FadeIn>
```

### 条件渲染

```tsx
// 使用 AnimatePresence 处理退出动画
<AnimatePresence mode="wait">
  {isLoading ? (
    <motion.div key="skeleton" exit={{ opacity: 0 }}>
      <Skeleton />
    </motion.div>
  ) : (
    <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Content />
    </motion.div>
  )}
</AnimatePresence>
```

### 响应式设计

```tsx
// 使用 Tailwind 响应式前缀
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

**文档版本**: v1.0  
**最后更新**: 2024-04-19
