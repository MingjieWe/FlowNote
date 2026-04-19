# FlowNote Android APK 构建指南

## 环境要求

构建 Android APK 需要以下工具：

1. **Node.js** (已安装)
2. **Android Studio** - [下载地址](https://developer.android.com/studio)
3. **Android SDK** - 随 Android Studio 一起安装
4. **Java JDK** - Android Studio 自带或单独安装

## 快速开始

### 第一步：安装 Android Studio

1. 访问 https://developer.android.com/studio 下载并安装
2. 打开 Android Studio，安装默认推荐的 SDK 组件
3. 记下 Android SDK 路径（通常是 `~/Library/Android/sdk`）

### 第二步：配置环境变量

在 `~/.zshrc` 或 `~/.bash_profile` 中添加：

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

然后运行 `source ~/.zshrc` 使配置生效。

### 第三步：构建 APK

在终端中运行：

```bash
# 方式1: 使用脚本（推荐）
chmod +x scripts/build-apk.sh
./scripts/build-apk.sh

# 方式2: 手动步骤
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

构建完成后，APK 文件位于：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 第四步：安装到设备

#### 方法 A: 通过 USB 安装

1. 在 Android 手机上开启「开发者选项」和「USB 调试」
2. 用 USB 线连接手机
3. 运行：

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

#### 方法 B: 通过 Android Studio 安装

1. 打开 Android Studio
2. 选择 "Open an existing Android Studio project"
3. 选择 `android` 文件夹
4. 点击运行按钮（▶️）或选择 Build > Build Bundle(s) / APK(s)

#### 方法 C: 直接传输 APK

将 `app-debug.apk` 文件发送到手机，在手机上点击安装（需要允许安装未知来源应用）。

## 项目结构

```
app/
├── android/              # Android 原生项目（由 Capacitor 生成）
│   ├── app/src/main/     # 应用源码和资源
│   └── build.gradle      # 构建配置
├── dist/                 # Web 应用构建输出
├── resources/            # 应用图标资源
├── scripts/
│   ├── build-apk.sh      # APK 构建脚本
│   └── generate-icons.js # 图标生成脚本
├── capacitor.config.ts   # Capacitor 配置
└── ANDROID_BUILD.md      # 本文件
```

## 自定义配置

### 修改应用图标

1. 替换 `resources/icon.svg` 为你的图标（建议 512x512 SVG）
2. 运行 `node scripts/generate-icons.js` 重新生成各尺寸图标

### 修改应用信息

编辑 `capacitor.config.ts`：

```typescript
const config: CapacitorConfig = {
  appId: 'com.haixing.flownote',  // 应用包名
  appName: 'FlowNote',             // 应用名称
  webDir: 'dist',
  // ...
};
```

### 发布到应用商店

要构建发布版 APK（用于 Google Play）：

```bash
cd android
./gradlew assembleRelease
```

注意：发布版本需要签名密钥，请参考 [Android 签名文档](https://developer.android.com/studio/publish/app-signing)。

## 常见问题

### 1. gradlew 命令找不到

确保你在 `android` 目录下运行命令，或者使用完整路径：
```bash
cd android && ./gradlew assembleDebug
```

### 2. SDK 未找到

检查 `ANDROID_HOME` 环境变量：
```bash
echo $ANDROID_HOME
```

如果没有输出，请按照「配置环境变量」步骤设置。

### 3. 构建失败

尝试清理并重新构建：
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### 4. 同步失败

如果 Web 代码有更新，需要重新同步：
```bash
npm run build
npx cap sync android
```

## 更新应用

当 Web 代码有更新时：

```bash
# 1. 重新构建 Web
npm run build

# 2. 同步到 Android
npx cap sync android

# 3. 重新构建 APK
cd android && ./gradlew assembleDebug
```

或使用脚本一键完成：
```bash
./scripts/build-apk.sh
```

## 技术栈

- **Capacitor**: Web 到原生应用的桥梁
- **Next.js**: React 框架
- **Tailwind CSS**: 样式框架
- **Android SDK**: 原生 Android 开发工具
