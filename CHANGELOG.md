# Changelog

所有 FlowNote 的显著变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [0.1.0] - 2024-04-19

### ✨ 新增

#### 核心功能
- **Ideas 灵感模块** - 快速记录想法，支持标签分类
- **Journal 日记模块** - 日历视图管理每日日记，支持心情标记
- **Finance 财务模块** - 收入支出追踪，分类统计

#### 界面与体验
- 深色/浅色主题切换，支持自动检测系统偏好
- 中文/英文双语支持，默认中文
- 响应式设计，适配桌面端和移动端
- PWA 支持，可安装为独立应用
- 毛玻璃效果侧边栏

#### 动画效果
- 页面过渡淡入动画
- 按钮点击缩放反馈
- 卡片悬停阴影和上浮效果
- 列表交错入场动画
- 骨架屏加载效果

#### 技术特性
- 基于 Next.js 15 + React 19 + TypeScript 5
- Tailwind CSS 4 原子化样式
- shadcn/ui 组件库
- Framer Motion 动画
- Sonner Toast 通知
- 分片存储支持大数据

#### 组件
- Button, Dialog, Input, Textarea, Badge 等基础组件
- FadeIn, ScaleOnTap, HoverCard 等动画组件
- IdeasSkeleton, JournalSkeleton, FinanceSkeleton 骨架屏

#### Hooks 与工具
- `useI18n` 国际化 Hook
- `storage` 分片存储工具
- `cn` Tailwind 类名合并工具

---

## 计划版本

### [0.2.0] - 计划中

#### 功能
- [ ] 数据导入/导出（JSON/CSV 格式）
- [ ] 搜索功能（全文检索）
- [ ] 图片附件支持
- [ ] 语音输入（Web Speech API）
- [ ] 数据备份提醒

#### 优化
- [ ] 虚拟列表（大数据性能）
- [ ] 手势操作（滑动删除）
- [ ] 键盘快捷键

### [0.3.0] - 计划中

#### 功能
- [ ] 统计图表（收支趋势、心情分布）
- [ ] 提醒通知（每日记账提醒、日记提醒）
- [ ] 数据加密（端到端加密）
- [ ] 多用户支持（本地账户切换）

#### 集成
- [ ] 可选云同步（iCloud/Google Drive）
- [ ] 分享功能（生成图片分享）

### [1.0.0] - 计划中

#### 功能
- [ ] AI 助手（智能分类、内容建议）
- [ ] 模板系统（日记模板、记账模板）
- [ ] 高级搜索（过滤器、标签云）
- [ ] 数据迁移工具

---

## 更新类型说明

- `✨ 新增` - 新功能
- `🐛 修复` - 修复问题
- `⚡️ 优化` - 性能优化
- `💄 样式` - UI/样式变更
- `♻️ 重构` - 代码重构
- `📚 文档` - 文档更新
- `🔧 工具` - 开发工具

---

**维护者**: FlowNote Team  
**项目主页**: https://github.com/flownote/flownote
