# FlowNote 技术文档

本文档详细介绍 FlowNote 应用的架构设计、核心模块实现和开发规范。

## 目录

1. [架构概览](#架构概览)
2. [核心模块](#核心模块)
3. [组件系统](#组件系统)
4. [状态管理](#状态管理)
5. [存储方案](#存储方案)
6. [国际化实现](#国际化实现)
7. [动画系统](#动画系统)
8. [样式系统](#样式系统)
9. [性能优化](#性能优化)
10. [开发规范](#开发规范)

---

## 架构概览

### 技术选型

| 层级 | 技术 | 说明 |
|-----|------|------|
| 框架 | Next.js 15 | App Router 模式，支持 SSR/SSG |
| 语言 | TypeScript 5 | 严格类型检查 |
| UI | React 19 | 函数组件 + Hooks |
| 样式 | Tailwind CSS 4 | 原子化 CSS |
| 组件 | shadcn/ui | Radix UI 封装 |
| 动画 | Framer Motion | 声明式动画 |
| 构建 | Turbopack | 快速开发构建 |

### 目录结构详解

```
app/
├── app/                    # 路由页面
│   ├── layout.tsx         # 根布局（Provider 注入）
│   ├── page.tsx           # 首页（重定向到 /ideas）
│   ├── globals.css        # 全局样式 + Tailwind
│   ├── manifest.ts        # PWA 配置
│   ├── ideas/             # 灵感模块
│   ├── journal/           # 日记模块
│   └── finance/           # 财务模块
├── components/
│   ├── ui/                # shadcn/ui 组件
│   ├── flow-shell.tsx     # 应用外壳布局
│   ├── providers.tsx      # 全局 Provider
│   ├── page-transition.tsx # 动画组件
│   └── skeletons.tsx      # 骨架屏
├── lib/
│   ├── utils.ts           # cn 工具函数
│   ├── i18n.tsx           # 国际化
│   └── storage.ts         # 分片存储
└── ...
```

---

## 核心模块

### 1. Ideas (灵感模块)

**文件**: `app/app/ideas/page.tsx`

**数据模型**:
```typescript
interface Idea {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: number
}
```

**功能**:
- 创建/编辑/删除灵感卡片
- 标签自动提取和筛选
- 卡片网格布局（响应式：1/2/3 列）
- 内容预览（最多 240 字符）

**存储键**: `flownote-ideas`

### 2. Journal (日记模块)

**文件**: `app/app/journal/page.tsx`

**数据模型**:
```typescript
type Mood = 'happy' | 'calm' | 'sad' | 'excited' | 'tired' | 'anxious'

interface JournalEntry {
  id: string
  date: string        // YYYY-MM-DD
  content: string
  mood: Mood
  createdAt: number
}
```

**功能**:
- 日历视图展示（原生 JavaScript 生成）
- 心情选择器（6 种心情 + emoji）
- 按日期编辑/删除
- 月份导航

**存储键**: `flownote-journal`

### 3. Finance (财务模块)

**文件**: `app/app/finance/page.tsx`

**数据模型**:
```typescript
type TransactionType = 'income' | 'expense'
type Category = '餐饮' | '交通' | '购物' | '娱乐' | '居住' | '医疗' | '教育' | '其他'
  | '工资' | '投资' | '兼职' | '奖金'

interface Transaction {
  id: string
  amount: number
  type: TransactionType
  category: Category
  date: string
  note?: string
  createdAt: number
}
```

**功能**:
- 收入/支出记录
- 分类图标和颜色
- 月度统计（收入/支出/结余）
- 分类筛选

**存储键**: `flownote-finance`

---

## 组件系统

### FlowShell (应用外壳)

**文件**: `app/components/flow-shell.tsx`

职责：
- 响应式侧边栏导航（桌面/移动端）
- 主题切换按钮
- 语言切换按钮
- 移动端抽屉菜单

**响应式断点**:
- `lg` (1024px+): 展开式侧边栏
- `< lg`: 汉堡菜单 + 抽屉

### UI 组件 (shadcn/ui)

使用组件列表：
- `button` - 按钮
- `dialog` - 弹窗
- `input` - 输入框
- `textarea` - 文本域
- `badge` - 标签
- `card` - 卡片
- `scroll-area` - 滚动区域
- `separator` - 分隔线
- `avatar` - 头像
- `collapsible` - 可折叠
- `sidebar` - 侧边栏
- `skeleton` - 骨架屏

所有组件支持：
- 深色模式
- 无障碍 (ARIA)
- 键盘导航

---

## 状态管理

### 本地状态

每个页面独立管理状态：

```typescript
// Ideas Page
const [ideas, setIdeas] = useState<Idea[]>([])
const [filterTag, setFilterTag] = useState<string>('All')
const [dialogOpen, setDialogOpen] = useState(false)
```

### 全局状态 (Context)

**Theme (next-themes)**:
```typescript
<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
```

**I18n (自定义)**:
```typescript
const I18nContext = createContext<{
  locale: 'zh' | 'en'
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}>()
```

### 持久化状态

使用 `useEffect` 同步 localStorage：

```typescript
// 加载
useEffect(() => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) setIdeas(JSON.parse(raw))
}, [])

// 保存
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas))
}, [ideas])
```

---

## 存储方案

### 标准存储

适用于小数据（< 1MB）：

```typescript
localStorage.setItem('key', JSON.stringify(data))
```

### 分片存储

适用于大数据（> 1MB），自动分片避免配额限制：

**文件**: `app/lib/storage.ts`

```typescript
import { storage } from '@/lib/storage'

// 保存（自动分片）
storage.setItem('flownote-data', largeDataObject)

// 读取（自动合并）
const data = storage.getItem('flownote-data')

// 查看使用情况
const { used, total, percentage } = storage.getUsage()
```

**分片策略**:
- 单块大小：1MB
- 命名格式：`flownote-chunk-{key}-{index}`
- 元数据存储在原 key 中

---

## 国际化实现

**文件**: `app/lib/i18n.tsx`

### 设计原则

- 轻量级（无外部库依赖）
- 类型安全
- 支持嵌套键
- 自动回退英文

### 使用示例

```typescript
const { t, locale, setLocale } = useI18n()

// 基础翻译
t('ideas.title')        // "灵感笔记"
t('common.save')        // "保存"

// 嵌套翻译
t('journal.moods.happy') // "开心"

// 切换语言
setLocale('en')
```

### 添加新语言

1. 在 `translations` 对象中添加语言键
2. 更新 `Locale` 类型
3. 在 UI 中添加切换选项

---

## 动画系统

**文件**: `app/components/page-transition.tsx`

### 动画组件

| 组件 | 用途 | 参数 |
|-----|------|------|
| `PageTransition` | 页面级过渡 | - |
| `FadeIn` | 淡入动画 | delay, duration, direction |
| `ScaleOnTap` | 点击缩放 | scale |
| `HoverCard` | 悬停上浮 | - |
| `StaggerContainer` | 子元素交错 | staggerDelay |
| `SlideIn` | 滑入动画 | direction |

### 使用示例

```tsx
// 页面淡入
<FadeIn delay={0.1}>
  <Content />
</FadeIn>

// 点击反馈
<ScaleOnTap scale={0.95}>
  <Button>保存</Button>
</ScaleOnTap>

// 卡片悬停
<HoverCard>
  <Card />
</HoverCard>

// 列表交错动画
<StaggerContainer staggerDelay={0.05}>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <ListItem {...item} />
    </StaggerItem>
  ))}
</StaggerContainer>
```

### 动画规范

- 时长：200-400ms
- 缓动：`[0.25, 0.1, 0.25, 1]` (ease-out)
- 支持 `prefers-reduced-motion`

---

## 样式系统

**文件**: `app/app/globals.css`

### Tailwind 配置

主题扩展：
```typescript
// tailwind.config.ts
colors: {
  border: 'hsl(var(--border))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: { DEFAULT: 'hsl(var(--primary))', foreground: '...' },
  // ...
}
```

### CSS 变量

浅色主题（默认）：
```css
:root {
  --background: 0 0% 98%;
  --foreground: 0 0% 6%;
  --primary: 0 0% 6%;
  --primary-foreground: 0 0% 100%;
  /* ... */
}
```

深色主题：
```css
.dark {
  --background: 0 0% 8%;
  --foreground: 0 0% 96%;
  /* ... */
}
```

### 自定义工具类

```css
/* GPU 加速 */
.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* 毛玻璃效果 */
.glass {
  @apply backdrop-blur-md bg-white/80;
}

/* 文字截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## 性能优化

### 1. 构建优化

- **Turbopack**: 开发模式快速 HMR
- **代码分割**: 按路由自动分割
- **Tree Shaking**: 移除未使用代码

### 2. 运行时优化

- **GPU 加速**: 动画元素添加 `translateZ(0)`
- **will-change**: 动画前提示浏览器优化
- **懒加载**: 图片和组件延迟加载

### 3. 存储优化

- **分片存储**: 大数据自动分片
- **存储监控**: 检测接近容量上限

### 4. 移动端优化

- **触摸目标**: 最小 48px
- **滚动性能**: 隐藏移动端滚动条
- **输入优化**: 防止 iOS 缩放问题

### 5. PWA 优化

- **Service Worker**: 离线缓存
- **Manifest**: 可安装配置
- **预加载**: 关键资源预加载

---

## 开发规范

### 命名规范

| 类型 | 规范 | 示例 |
|-----|------|------|
| 组件 | PascalCase | `FlowShell`, `IdeaCard` |
| 函数 | camelCase | `useIdeas`, `formatDate` |
| 常量 | UPPER_SNAKE | `STORAGE_KEY`, `MAX_SIZE` |
| 类型 | PascalCase | `Idea`, `Transaction` |
| 文件 | kebab-case | `flow-shell.tsx`, `use-ideas.ts` |

### 组件规范

```typescript
// 1. 类型定义
interface ButtonProps {
  variant?: 'default' | 'primary'
  onClick?: () => void
  children: React.ReactNode
}

// 2. 组件实现
export function Button({ variant = 'default', onClick, children }: ButtonProps) {
  return (
    <button className={...} onClick={onClick}>
      {children}
    </button>
  )
}

// 3. 默认导出（页面组件）
export default function IdeasPage() { ... }
```

### 导入顺序

```typescript
// 1. React/Next
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// 2. 第三方库
import { motion } from 'framer-motion'
import { toast } from 'sonner'

// 3. 组件
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/page-transition'

// 4. 工具
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
```

### 错误处理

```typescript
try {
  const parsed = JSON.parse(raw)
} catch {
  // 静默失败，使用默认值
  setIdeas([])
}
```

### 注释规范

```typescript
// 单行注释：解释 "为什么"

/**
 * 函数注释
 * @param id - 实体唯一标识
 * @returns 实体对象或 null
 */
function getById(id: string): Entity | null { ... }
```

---

## 调试指南

### 浏览器控制台命令

```javascript
// 查看所有 FlowNote 数据
Object.entries(localStorage)
  .filter(([k]) => k.startsWith('flownote'))
  .forEach(([k, v]) => console.log(k, JSON.parse(v)))

// 清除所有数据
import('@/lib/storage').then(m => m.storage.clearAll())

// 检查存储使用
import('@/lib/storage').then(m => console.log(m.storage.getUsage()))
```

### React DevTools

- 使用 Profiler 分析渲染性能
- 检查 Context 值变化
- 查看组件层级结构

### 网络调试

- Application → Local Storage 查看数据
- Lighthouse 评估 PWA 分数
- Performance 记录动画性能

---

## 部署指南

### 静态导出

```bash
cd app
npm run build
```

输出目录：`app/dist` (如配置) 或 `app/.next`

### 部署平台

| 平台 | 配置 |
|-----|------|
| Vercel | 自动检测 Next.js |
| Netlify | 构建命令：`npm run build` |
| Cloudflare Pages | 使用 `@cloudflare/next-on-pages` |

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 更新日志

### v0.1.0 (2024-04-19)

- ✅ 初始版本发布
- ✅ Ideas 灵感模块
- ✅ Journal 日记模块
- ✅ Finance 财务模块
- ✅ 深色/浅色主题
- ✅ 中文/英文国际化
- ✅ PWA 支持
- ✅ 响应式设计
- ✅ Framer Motion 动画
- ✅ 分片存储

---

## 路线图

### v0.2.0 计划

- [ ] 数据导入/导出 (JSON/CSV)
- [ ] 云同步支持 (可选)
- [ ] 搜索功能
- [ ] 图片附件
- [ ] 语音输入

### v0.3.0 计划

- [ ] 多用户支持
- [ ] 端到端加密
- [ ] 统计图表
- [ ] 提醒通知

---

**文档版本**: v1.0  
**最后更新**: 2024-04-19  
**维护者**: FlowNote Team
