const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const heroImages = [
  'Hero_1.jpg',
  'Hero_2.jpg',
  'Hero_3.jpg',
  'Hero_4.jpg',
  'Hero_5.jpg',
  'Hero_6.jpg',
  'Hero_7.jpg',
  'Hero_First.jpg',
  'og-image.jpg',
  'og-photo.png'
];

async function convertImages() {
  for (const image of heroImages) {
    const inputPath = path.join(publicDir, image);
    const ext = path.extname(image);
    const name = path.basename(image, ext);
    const outputPath = path.join(publicDir, `${name}.webp`);

    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${image} - not found`);
      continue;
    }

    try {
      await sharp(inputPath)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);

      const inputSize = fs.statSync(inputPath).size;
      const outputSize = fs.statSync(outputPath).size;
      const savings = ((inputSize - outputSize) / inputSize * 100).toFixed(1);

      console.log(`Converted ${image} -> ${name}.webp (${savings}% smaller)`);
    } catch (err) {
      console.error(`Error converting ${image}:`, err.message);
    }
  }
}

convertImages();
