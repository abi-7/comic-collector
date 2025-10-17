# 📱 Comic Vault - Mobile Setup Guide

Your barcode scanner is ready! However, it requires a **physical mobile device** to work since web browsers don't have access to camera barcode scanning APIs.

## 🚀 Quick Setup

### Step 1: Export to GitHub
1. Click the GitHub button in the top right of Lovable
2. Export your project to your GitHub account

### Step 2: Clone and Install
```bash
# Clone your repository
git clone <YOUR_GITHUB_URL>
cd comic-vault

# Install dependencies
npm install

# Build the project
npm run build
```

### Step 3: Add Mobile Platforms

**For iOS (requires Mac with Xcode):**
```bash
npx cap add ios
npx cap sync ios
npx cap open ios
```
Then run from Xcode on a physical iPhone or simulator.

**For Android (requires Android Studio):**
```bash
npx cap add android
npx cap sync android
npx cap open android
```
Then run from Android Studio on a physical device or emulator.

### Step 4: Test the Scanner!
1. Open the app on your device
2. Tap the camera button
3. Point at any barcode (comic book, product, etc.)
4. Watch it scan automatically!

## 📦 What Barcodes Are Supported?

The scanner supports these common formats:
- **EAN-13** & **EAN-8** (Most comic books use these!)
- **UPC-A** & **UPC-E** (North American products)
- **Code 128**, **Code 39**, **Code 93** (Various products)

## 🔧 Troubleshooting

### Camera Permission Issues
If the scanner doesn't work:
1. Check your device settings
2. Make sure the app has camera permissions
3. Try restarting the app

### Android: Add to AndroidManifest.xml
The barcode scanner plugin should auto-configure, but if you have issues, ensure these permissions are in `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" />
```

### iOS: Add to Info.plist
Make sure `ios/App/App/Info.plist` includes:

```xml
<key>NSCameraUsageDescription</key>
<string>To scan comic book barcodes and add them to your collection</string>
```

## 🔄 Making Changes

After making code changes in Lovable:
```bash
# Pull latest changes
git pull

# Sync to mobile platforms
npx cap sync

# Rebuild if needed
npm run build
npx cap sync
```

## 💡 Next Steps

Once scanning works, you can:
1. Connect to **Lovable Cloud** to save scanned comics
2. Integrate with a comic book API to auto-fetch comic details
3. Add features like collection stats and wishlists

## 📚 Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Barcode Scanner Plugin](https://github.com/capawesome-team/capacitor-mlkit/tree/main/packages/barcode-scanning)
- [Lovable Mobile Apps Guide](https://docs.lovable.dev/)
