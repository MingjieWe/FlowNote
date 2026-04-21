const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Use PNG icon instead of SVG
const iconPath = '/Users/haixing/Downloads/FlowNote/FlowNote/imgs/flownote.png';
const pngBuffer = fs.readFileSync(iconPath);

// Android icon sizes
const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

// Generate Android icons with proper padding
async function generateIcons() {
  const androidResDir = path.join(__dirname, '../android/app/src/main/res');

  for (const [folder, size] of Object.entries(sizes)) {
    const outputDir = path.join(androidResDir, folder);

    // Calculate padded size (icon takes up 80% of the canvas)
    const paddedSize = Math.round(size * 0.8);
    const padding = Math.round((size - paddedSize) / 2);

    // Generate foreground icon (with padding for adaptive icons)
    await sharp(pngBuffer)
      .resize(paddedSize, paddedSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'ic_launcher_foreground.png'));

    // Generate regular icon
    await sharp(pngBuffer)
      .resize(paddedSize, paddedSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'ic_launcher.png'));

    // Generate round icon
    await sharp(pngBuffer)
      .resize(paddedSize, paddedSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'ic_launcher_round.png'));

    console.log(`Generated ${folder} icons (${size}x${size} with 10% padding)`);
  }

  // Generate iOS App Store icon (1024x1024)
  const iosIconDir = path.join(__dirname, '../ios/App/App/Assets.xcassets/AppIcon.appiconset');
  await sharp(pngBuffer)
    .resize(1024, 1024, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.join(iosIconDir, 'AppIcon-512@2x.png'));
  console.log('Generated iOS AppIcon-512@2x.png (1024x1024)');

  // Generate 512x512 for Google Play and PWA (with padding)
  await sharp(pngBuffer)
    .resize(410, 410, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.join(__dirname, '../resources/icon-512x512.png'));
  console.log('Generated resources/icon-512x512.png');

  // Copy to public directory for Web
  fs.copyFileSync(
    path.join(__dirname, '../resources/icon-512x512.png'),
    path.join(__dirname, '../public/icon-512x512.png')
  );
  console.log('Copied icon-512x512.png to public/');

  // Generate 192x192 for PWA (with padding)
  await sharp(pngBuffer)
    .resize(154, 154, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .extend({
      top: 19,
      bottom: 19,
      left: 19,
      right: 19,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.join(__dirname, '../resources/icon-192x192.png'));
  console.log('Generated resources/icon-192x192.png');

  // Copy to public directory for Web
  fs.copyFileSync(
    path.join(__dirname, '../resources/icon-192x192.png'),
    path.join(__dirname, '../public/icon-192x192.png')
  );
  console.log('Copied icon-192x192.png to public/');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);