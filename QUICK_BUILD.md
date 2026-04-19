# FlowNote APK 快速构建指南

由于网络限制，命令行构建遇到了一些依赖下载问题。请使用 Android Studio 图形界面来完成最后的构建，这会自动处理所有依赖。

## 步骤

### 1. 打开 Android Studio

打开 Android Studio，选择 **"Open an existing Android Studio project"**

### 2. 选择项目

导航到并选择文件夹：
```
/Users/haixing/Downloads/FlowNote/FlowNote/app/android
```

### 3. 等待 Gradle 同步

Android Studio 会自动：
- 下载所需的 Gradle 版本
- 下载 Android SDK Platform 36（如果缺失）
- 下载其他依赖

> 第一次同步可能需要 5-10 分钟，取决于网络速度。

### 4. 构建 APK

同步完成后，点击菜单栏的：
```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```

或者点击工具栏的构建按钮（🔨）。

### 5. 获取 APK

构建成功后，在右下角会弹出通知：
```
Build Analyzer detected...
```

点击 **"locate"** 链接，或在以下位置找到 APK：
```
app/android/app/build/outputs/apk/debug/app-debug.apk
```

### 6. 安装到手机

#### 方法 A: 通过 USB
1. 手机开启开发者模式和 USB 调试
2. 用 USB 连接电脑
3. 在 Android Studio 点击 **"Run"** 按钮（▶️）

#### 方法 B: 手动传输
将 `app-debug.apk` 发送到手机，在手机上点击安装。

## 可能遇到的问题

### 问题 1: SDK Platform 未找到
Android Studio 会自动提示下载缺失的 SDK，点击下载即可。

### 问题 2: 依赖下载慢
可以在 Android Studio 设置中配置国内镜像：
1. 打开 `gradle.properties`
2. 添加阿里云镜像：
```properties
systemProp.http.proxyHost=mirrors.aliyun.com
systemProp.http.proxyPort=80
```

### 问题 3: 构建失败
点击菜单 **File → Invalidate Caches / Restart**，然后重试。

## 项目已配置完成

所有准备工作已完成：
- ✅ Capacitor 已安装和配置
- ✅ Android 平台已添加
- ✅ 应用图标已生成
- ✅ Web 资源已同步

你只需要在 Android Studio 中点击构建即可！
