# iOS Build Guide for FlowNote

## Prerequisites

- macOS with Xcode installed (version 14.0 or later recommended)
- iOS deployment target: 14.0+
- CocoaPods (usually installed with Xcode)
- Node.js 18+ and npm

## Project Structure

```
ios/
├── App/
│   ├── App/                          # Main app source code
│   ├── App.xcodeproj/               # Xcode project configuration
│   └── CapApp-SPM/                  # Swift Package Manager dependencies
├── capacitor-cordova-ios-plugins/   # Native plugins
└── debug.xcconfig                    # Debug configuration
```

## Available npm Scripts

```bash
# Build web assets and sync to iOS
npm run ios:sync

# Open iOS project in Xcode
npm run ios:open

# Full workflow
npm run build && npm run ios:sync && npm run ios:open
```

## Development Workflow

### 1. Initial Setup

```bash
cd app
npm install
npm run build
npm run ios:sync
npm run ios:open
```

### 2. Running in Xcode

1. Open Xcode by running `npm run ios:open`
2. Select the target device or simulator
3. Click the Run button (▶) or press Cmd+R
4. App will launch in the selected device/simulator

### 3. Making Changes

**TypeScript/React Changes:**
```bash
npm run dev              # Run development server
npm run build            # Build for production
npm run ios:sync         # Sync web assets to iOS
```

**Native iOS Changes:**
- Edit files directly in Xcode (usually in `ios/App/App/`)
- Rebuild in Xcode (Cmd+B)

### 4. Syncing Web Assets

After making changes to your Next.js app:
```bash
npm run build
npm run ios:sync
```

This copies the latest `dist/` folder to the iOS app's web assets.

## Building for Distribution

### 1. Configure Signing

In Xcode:
1. Open the project: `App.xcodeproj`
2. Select the "App" target
3. Go to Signing & Capabilities tab
4. Select your team and provisioning profile

### 2. Build Archive

```bash
# Or use Xcode directly
xcodebuild archive \
  -scheme App \
  -configuration Release \
  -archivePath build/App.xcarchive \
  CODE_SIGN_IDENTITY="Apple Distribution: Your Name" \
  PROVISIONING_PROFILE="Your Profile"
```

### 3. Create IPA

Use Xcode Organizer or `xcodebuild` to export as IPA:
```bash
xcodebuild -exportArchive \
  -archivePath build/App.xcarchive \
  -exportPath build/ipa \
  -exportOptionsPlist ExportOptions.plist
```

## Testing

### Unit Tests

```bash
npm run lint
```

### Run on Simulator

```bash
npm run ios:open
# Select iOS Simulator from device list
# Press Cmd+R to run
```

### Run on Physical Device

1. Connect iPhone via USB
2. Open Xcode: `npm run ios:open`
3. Select your device from the device selector
4. Press Cmd+R

## Troubleshooting

### Pod Installation Issues

```bash
cd ios/App
pod install --repo-update
cd ../..
npm run ios:sync
```

### Assets Not Updating

```bash
# Clear and rebuild
rm -rf ios/App/App/public
npm run build
npm run ios:sync
```

### Xcode Build Errors

1. Clean build folder: Cmd+Shift+K
2. Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData/*`
3. Reinstall pods:
   ```bash
   cd ios/App
   rm -rf Pods Podfile.lock
   pod install
   cd ../..
   npm run ios:sync && npm run ios:open
   ```

### Simulator Issues

```bash
# Reset simulator
xcrun simctl erase all

# Or use Xcode: Simulator > Reset Content and Settings...
```

## Configuration Files

### capacitor.config.json
Located at `ios/App/App/capacitor.config.json` - contains app configuration synced from root `capacitor.config.ts`

### Info.plist
Located at `ios/App/App/Info.plist` - contains iOS app metadata

### Build Settings
Xcode project settings can be modified in `App.xcodeproj/`

## Performance Optimization

1. **Enable Release Mode:**
   - In Xcode: Scheme → Edit Scheme → Run → Release
   
2. **Optimize Assets:**
   - Use compressed images in `public/`
   - Minimize JavaScript bundles
   
3. **Monitor Memory:**
   - Use Xcode's Instruments (Product → Profile)

## Publishing to App Store

1. Create App Store Connect record
2. Configure signing certificates
3. Build and archive in Release mode
4. Upload via Xcode Organizer or Transporter
5. Submit for review

## Useful Resources

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Xcode Documentation](https://developer.apple.com/xcode/)
- [Apple Developer Program](https://developer.apple.com/programs/)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)

## Support

For Capacitor-specific issues, refer to:
- [Capacitor Docs](https://capacitorjs.com/docs)
- [GitHub Issues](https://github.com/ionic-team/capacitor/issues)

For iOS/Xcode issues:
- [Apple Developer Forums](https://developer.apple.com/forums/)
- [Stack Overflow iOS Tag](https://stackoverflow.com/questions/tagged/ios)
