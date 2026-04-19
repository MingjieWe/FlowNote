#!/bin/bash

# FlowNote Android APK 构建脚本
# 请先确保已安装 Android Studio 和 Android SDK

set -e

echo "🚀 开始构建 FlowNote Android APK..."

# 1. 构建 Web 应用
echo "📦 步骤 1: 构建 Web 应用..."
npm run build

# 2. 同步到 Android 项目
echo "📱 步骤 2: 同步到 Android 项目..."
npx cap sync android

# 3. 构建 APK
echo "🔨 步骤 3: 构建 APK..."
cd android

# 检查是否有 Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️ 警告: ANDROID_HOME 环境变量未设置"
    echo "请设置 Android SDK 路径，例如:"
    echo "export ANDROID_HOME=$HOME/Library/Android/sdk"
    echo ""
fi

# 使用 Gradle 构建 APK
./gradlew assembleDebug

echo ""
echo "✅ 构建完成!"
echo ""
echo "📍 APK 位置:"
echo "   android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "📲 安装到设备:"
echo "   adb install android/app/build/outputs/apk/debug/app-debug.apk"
