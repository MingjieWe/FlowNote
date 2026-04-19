# FlowNote

一款简洁优雅的笔记应用，支持灵感记录、日记和财务管理。

## 功能特性

- 💡 **灵感** - 快速记录创意想法，支持标签分类
- 📔 **日记** - 带心情追踪的日记功能，日历视图
- 💰 **财务** - 收支记录与统计，多分类管理
- 🌓 **深色模式** - 支持浅色/深色主题切换
- 🌐 **双语支持** - 中文/英文界面

## 技术栈

- Next.js 15 + React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui
- Capacitor (Android)

## 开发

```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 构建
npm run build
```

## 打包 Android APK

### 环境准备

1. 安装 [Android Studio](https://developer.android.com/studio)
2. 配置 Android SDK 环境变量

### 构建步骤

```bash
# 方式1: 使用脚本（推荐）
npm run android:build

# 方式2: 手动步骤
npm run android:sync
cd android && ./gradlew assembleDebug
```

详细说明请查看 [app/ANDROID_BUILD.md](app/ANDROID_BUILD.md)。

### APK 位置

构建完成后，APK 位于：
```
app/android/app/build/outputs/apk/debug/app-debug.apk
```

## 项目结构

```
FlowNote/
├── app/              # Next.js 应用
│   ├── app/          # 页面
│   ├── components/   # 组件
│   ├── android/      # Android 项目
│   └── ...
└── README.md
```

## License

MIT
