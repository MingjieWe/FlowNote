# FlowNote 版本更新指南

本文档记录了更新应用版本号时需要修改的所有文件。

## 版本号格式
- 版本号格式: `x.y.z` (例如: 0.1.2)
- Android 额外有 build number (versionCode)

## 需要修改的文件清单

### 1. Web (Next.js)
**文件**: [`package.json`](package.json:3)
```json
"version": "0.1.2"
```

### 2. Android
**文件**: [`android/app/build.gradle`](android/app/build.gradle:11-12)
```gradle
versionCode 2        // 每次发布必须 +1
versionName "0.1.2"  // 与版本号一致
```

### 3. iOS
**文件**: [`ios/App/App.xcodeproj/project.pbxproj`](ios/App/App.xcodeproj/project.pbxproj)
- 搜索 `CURRENT_PROJECT_VERSION` (Debug 和 Release 各一处)
- 搜索 `MARKETING_VERSION` (Debug 和 Release 各一处)
```
CURRENT_PROJECT_VERSION = 2;     // build number，每次发布必须 +1
MARKETING_VERSION = 0.1.2;       // 与版本号一致
```

### 4. 页面显示版本
**文件**: [`components/flow-shell.tsx`](components/flow-shell.tsx)
- 第 252 行: 侧边栏底部版本号
- 第 380 行: 移动端菜单版本号
```tsx
// 侧边栏底部
{t('common.version')} 0.1.2

// 移动端菜单
FlowNote v0.1.2
```

## 快速更新脚本 (可选)

在项目根目录运行以下命令批量替换版本号（将 `NEW_VERSION` 和 `NEW_BUILD` 替换为实际值）：

```bash
NEW_VERSION="0.1.2"
NEW_BUILD="2"

# 更新 package.json
sed -i '' "s/\"version\": \"[0-9.]*\"/\"version\": \"$NEW_VERSION\"/" app/package.json

# 更新 Android
sed -i '' "s/versionCode [0-9]*/versionCode $NEW_BUILD/" app/android/app/build.gradle
sed -i '' "s/versionName \"[0-9.]*\"/versionName \"$NEW_VERSION\"/" app/android/app/build.gradle

# 更新 iOS
sed -i '' "s/CURRENT_PROJECT_VERSION = [0-9]*;/CURRENT_PROJECT_VERSION = $NEW_BUILD;/g" app/ios/App/App.xcodeproj/project.pbxproj
sed -i '' "s/MARKETING_VERSION = [0-9.]*;/MARKETING_VERSION = $NEW_VERSION;/g" app/ios/App/App.xcodeproj/project.pbxproj

# 更新页面显示版本
sed -i '' "s/{t('common.version')} [0-9.]*/{t('common.version')} $NEW_VERSION/" app/components/flow-shell.tsx
sed -i '' "s/FlowNote v[0-9.]*/FlowNote v$NEW_VERSION/" app/components/flow-shell.tsx
```

## 构建与同步步骤

修改版本号后，必须执行以下步骤才能使 Android 和 iOS 应用显示新版本：

```bash
# 1. 清理 Android 旧的构建资源（避免 TypeScript 错误）
rm -rf app/android/app/build/intermediates/assets/debug/mergeDebugAssets/public/types
rm -rf app/android/app/src/main/assets/public/types

# 2. 重新构建 Web 应用
cd app && npm run build

# 3. 同步到 Android
npx cap sync android

# 4. 同步到 iOS
npx cap sync ios
```

## 发布检查清单

- [ ] `package.json` 版本已更新
- [ ] `android/app/build.gradle` versionCode 和 versionName 已更新
- [ ] `ios/App/App.xcodeproj/project.pbxproj` CURRENT_PROJECT_VERSION 和 MARKETING_VERSION 已更新（Debug 和 Release）
- [ ] `components/flow-shell.tsx` 两处版本显示已更新
- [ ] 运行 `npm run icons:generate` 重新生成图标（如有需要）
- [ ] **执行「构建与同步步骤」**
- [ ] Android 构建测试通过
- [ ] iOS 构建测试通过

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 0.1.2 | 2026-04-21 | 统一三端版本号 |
| 0.1.1 | - | Android 端版本 |
| 0.1.0 | - | Web 初始版本 |
| 1.0   | - | iOS 初始版本 |
