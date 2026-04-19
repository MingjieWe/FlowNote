# 🚀 Next.js 15 + shadcn/ui 项目 - 快速参考

## 📍 项目位置
```
/Users/haixing/Downloads/FlowNote/FlowNote/app
```

## ⚡ 常用命令

```bash
# 启动开发服务器
npm run dev              # → http://localhost:3000

# 构建生产版本
npm run build

# 启动生产服务器  
npm start

# 运行 ESLint
npm run lint

# 安装新的 shadcn/ui 组件
npx shadcn-ui@latest add [component-name]
```

## 🎯 已安装的 11 个组件

| 组件 | 导入路径 | 用途 |
|------|---------|------|
| Button | `@/components/ui/button` | 交互式按钮 |
| Card | `@/components/ui/card` | 内容容器 |
| Input | `@/components/ui/input` | 文本输入 |
| Textarea | `@/components/ui/textarea` | 多行输入 |
| Badge | `@/components/ui/badge` | 标签/徽章 |
| Dialog | `@/components/ui/dialog` | 模态框 |
| ScrollArea | `@/components/ui/scroll-area` | 滚动容器 |
| Collapsible | `@/components/ui/collapsible` | 可折叠区域 |
| Separator | `@/components/ui/separator` | 分割线 |
| Avatar | `@/components/ui/avatar` | 头像 |
| Sidebar | `@/components/ui/sidebar` | 侧边栏 |

## 📂 关键文件

| 文件 | 说明 |
|------|------|
| `app/globals.css` | 全局样式 + 主题 CSS 变量 |
| `tailwind.config.ts` | Tailwind 配置 |
| `components.json` | shadcn/ui 配置 |
| `app/page.tsx` | 主页（包含组件演示） |
| `components/ui/*.tsx` | UI 组件库 |
| `lib/utils.ts` | 工具函数（cn 助手） |

## 💻 代码示例

### 导入和使用组件
```tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### 创建新页面
1. 在 `app/` 目录中创建文件夹 (如: `app/about/`)
2. 添加 `page.tsx` 文件
3. 根路由: `/` → `app/page.tsx`
4. 子页面: `/about` → `app/about/page.tsx`

## 🎨 定制主题

编辑 `app/globals.css` 中的 CSS 变量：

```css
:root {
  --primary: 0 0% 0%;           /* 主色 */
  --secondary: 0 0% 96.1%;      /* 次色 */
  --muted: 0 0% 96.1%;          /* 禁用色 */
  --accent: 0 0% 0%;            /* 强调色 */
  --destructive: 0 84.2% 60.2%; /* 危险色 */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* ... 暗色模式变量 ... */
  }
}
```

## 📦 主要依赖

```json
{
  "dependencies": {
    "react": "19.1.0",
    "next": "15.5.15",
    "tailwindcss": "^4",
    "lucide-react": "latest",
    "@radix-ui/*": "最新版"
  }
}
```

## ✅ 项目状态

- ✅ 构建成功
- ✅ 所有 11 个组件已安装
- ✅ TypeScript 类型完整
- ✅ 深色模式支持
- ✅ ESLint 配置完成
- ✅ 可立即投入生产

## 🔍 调试技巧

### 查看 CSS 变量
```bash
# 打开浏览器开发工具
右键 → 检查 → 元素 → 选择元素
# 在 Styles 面板中查看 CSS 变量
```

### 检查类名冲突
```bash
npm run lint
```

### Tailwind 类名不生效？
- 确保类名在 `tailwind.config.ts` 的 `content` 中
- 清理 `.next` 缓存: `rm -rf .next`
- 重启开发服务器

## 🎓 学习资源

- [Next.js 文档](https://nextjs.org/docs)
- [shadcn/ui GitHub](https://github.com/shadcn-ui/ui)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [组件演示页面](http://localhost:3000) ← 实时查看所有组件

## 📞 常见问题

**Q: 如何添加更多 shadcn/ui 组件？**
```bash
npx shadcn-ui@latest add input
```

**Q: 如何改变主题颜色？**
修改 `app/globals.css` 中的 HSL 值

**Q: 如何禁用暗色模式？**
在 `tailwind.config.ts` 中设置 `darkMode: false`

**Q: 如何使用服务器组件？**
移除文件顶部的 `'use client'` 指令

---

**项目就绪！** 🎉 开始开发你的应用吧！
