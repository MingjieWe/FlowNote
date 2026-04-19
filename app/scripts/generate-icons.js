const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgBuffer = fs.readFileSync(path.join(__dirname, '../resources/icon.svg'));

// Android icon sizes
const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

// Generate Android icons
async function generateIcons() {
  const androidResDir = path.join(__dirname, '../android/app/src/main/res');

  for (const [folder, size] of Object.entries(sizes)) {
    const outputDir = path.join(androidResDir, folder);

    // Generate foreground icon (with padding for adaptive icons)
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, 'ic_launcher_foreground.png'));

    // Generate regular icon
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, 'ic_launcher.png'));

    // Generate round icon
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, 'ic_launcher_round.png'));

    console.log(`Generated ${folder} icons (${size}x${size})`);
  }

  // Generate 512x512 for Google Play
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, '../resources/icon-512x512.png'));
  console.log('Generated icon-512x512.png');

  // Generate 192x192 for PWA
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, '../resources/icon-192x192.png'));
  console.log('Generated icon-192x192.png');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);