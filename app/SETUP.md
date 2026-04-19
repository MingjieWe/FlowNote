# FlowNote - Next.js 15 + shadcn/ui Project

## 🎉 项目初始化完成

本项目已成功配置为 **Next.js 15** 与 **shadcn/ui** 组件库的完整设置，包含 **Tailwind CSS v4** 和 **中性基色主题**。

## 📦 已安装的组件

以下 11 个 shadcn/ui 组件已安装并配置完毕：

1. **Button** - 多种变体的按钮组件
2. **Card** - 卡片容器，包含 Header、Content、Footer、Title、Description
3. **Input** - 文本输入字段
4. **Textarea** - 多行文本输入
5. **Badge** - 标签和徽章组件
6. **Dialog** - 模态对话框
7. **Scroll Area** - 自定义滚动区域
8. **Collapsible** - 可折叠的内容区域
9. **Separator** - 分隔符 / 分割线
10. **Avatar** - 用户头像组件
11. **Sidebar** - 侧边栏导航

## 🎨 主题配置

- **基色主题**: 中性（Neutral）
- **Tailwind CSS**: v4
- **配色方案**: 
  - 亮色模式：白色背景，黑色文字
  - 暗色模式：黑色背景，白色文字
- **支持**: 自动适应系统偏好

## 📂 项目结构

```
app/
├── components/
│   └── ui/                    # shadcn/ui 组件
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── badge.tsx
│       ├── dialog.tsx
│       ├── scroll-area.tsx
│       ├── collapsible.tsx
│       ├── separator.tsx
│       ├── avatar.tsx
│       └── sidebar.tsx
├── lib/
│   └── utils.ts               # 工具函数 (cn helper)
├── app/
│   ├── layout.tsx             # 根布局
│   ├── page.tsx               # 主页（组件展示）
│   └── globals.css            # 全局样式和主题变量
├── tailwind.config.ts         # Tailwind 配置
├── postcss.config.mjs         # PostCSS 配置
├── components.json            # shadcn/ui 配置
├── next.config.ts             # Next.js 配置
├── tsconfig.json              # TypeScript 配置
└── package.json               # 项目依赖

```

## 🚀 快速开始

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看项目。

### 构建生产版本

```bash
npm run build
npm start
```

## 📝 关键依赖

### Runtime Dependencies
- **react**: 19.1.0 - React 框架
- **react-dom**: 19.1.0 - React DOM 库
- **next**: 15.5.15 - Next.js 框架
- **class-variance-authority**: 组件变体管理
- **clsx**: 条件类名处理
- **lucide-react**: SVG 图标库
- **@radix-ui/react-*** - Headless UI 原始组件

### Dev Dependencies
- **@tailwindcss/postcss**: 4.x - Tailwind CSS PostCSS 插件
- **tailwindcss**: 4.x - Tailwind CSS 框架
- **typescript**: 5.x - TypeScript
- **eslint**: 9.x - 代码检查

## 🎯 使用示例

### Button 组件

```tsx
import { Button } from '@/components/ui/button'

export default function MyPage() {
  return (
    <Button>Click me</Button>
  )
}
```

### Card 组件

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        Content here
      </CardContent>
    </Card>
  )
}
```

### Input 组件

```tsx
import { Input } from '@/components/ui/input'

export default function MyForm() {
  return (
    <Input placeholder="Enter text..." />
  )
}
```

## 🛠️ 自定义主题

主题变量定义在 `app/globals.css` 中的 CSS 变量中。修改这些值可以改变整个应用的外观：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;
  --primary: 0 0% 0%;
  --secondary: 0 0% 96.1%;
  /* ... 更多变量 ... */
}
```

## 📖 文档和资源

- [Next.js 文档](https://nextjs.org/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Radix UI 文档](https://www.radix-ui.com)

## ✅ 项目检查清单

- [x] Next.js 15 已初始化
- [x] TypeScript 配置完成
- [x] Tailwind CSS v4 已安装
- [x] shadcn/ui 配置完成
- [x] 所有 11 个组件已安装
- [x] 中性主题已应用
- [x] 全局样式已配置
- [x] 组件演示页面已创建
- [x] ESLint 配置完成

## 🎓 下一步

1. 开始添加您的自定义组件
2. 在 `app` 目录中创建新页面
3. 根据需要自定义主题颜色
4. 构建您的应用功能

---

**项目初始化日期**: 2026年4月19日  
**框架版本**: Next.js 15.5.15  
**Tailwind 版本**: 4.x  
**shadcn/ui**: Latest
