# iOS 快速参考

## 快速开始

```bash
cd app
npm install                    # 安装依赖
npm run build                  # 构建 Web 资源
npm run ios:sync              # 同步到 iOS
npm run ios:open              # 在 Xcode 中打开项目
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run ios:sync` | 构建 Web 资源并同步到 iOS |
| `npm run ios:open` | 在 Xcode 中打开 iOS 项目 |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建用于生产的 Web 资源 |

## 项目结构

```
app/ios/
├── App/
│   ├── App/                           # iOS 应用源代码
│   │   ├── Podfile                   # CocoaPods 配置
│   │   ├── Pods/                     # CocoaPods 依赖
│   │   ├── public/                   # Web 资源
│   │   └── capacitor.config.json     # Capacitor 配置
│   ├── App.xcodeproj/                # Xcode 项目
│   └── App.xcworkspace/              # Xcode 工作区
├── capacitor-cordova-ios-plugins/    # 原生插件
└── debug.xcconfig                     # 调试配置
```

## 开发流程

### 1. Web 应用更改
```bash
# 自动更新监视
npm run dev

# 完成后，同步到 iOS
npm run build
npm run ios:sync
```

### 2. 在模拟器测试
```bash
npm run ios:open  # 打开 Xcode
# 在 Xcode 中选择模拟器 → 点击运行按钮 (Cmd+R)
```

### 3. 在真实设备测试
```bash
npm run ios:open
# 连接 iPhone → 在 Xcode 中选择设备 → 点击运行 (Cmd+R)
```

## 常见问题解决

### Pod 安装问题
```bash
cd ios/App
pod install --repo-update
cd ../..
npm run ios:sync
```

### Web 资源未更新
```bash
rm -rf ios/App/App/public
npm run build
npm run ios:sync
```

### Xcode 构建失败
```bash
# 清除构建
rm -rf ~/Library/Developer/Xcode/DerivedData/App*

# 重新安装 Pod
cd ios/App
pod install
cd ../..

# 重新同步
npm run ios:sync
npm run ios:open
```

## 配置文件位置

- **Capacitor 配置**: `ios/App/App/capacitor.config.json`
- **应用信息**: `ios/App/App/Info.plist`  
- **Xcode 项目**: `ios/App/App.xcodeproj/`
- **根配置**: `capacitor.config.ts` (会自动同步)

## 下一步

1. 查看完整文档: [IOS_BUILD.md](./IOS_BUILD.md)
2. 运行开发服务器: `npm run dev`
3. 同步并打开: `npm run ios:sync && npm run ios:open`
4. 在 Xcode 中按 Cmd+R 运行应用

## 有用资源

- [Capacitor iOS 文档](https://capacitorjs.com/docs/ios)
- [Xcode 文档](https://developer.apple.com/xcode/)
- [Capacitor 插件库](https://capacitorjs.com/docs/plugins)
