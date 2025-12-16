const sharp = require('sharp');
const path = require('path');

const palettes = [
  'option-1-tech-blue.svg',
  'option-2-ocean-blue.svg',
  'option-3-corporate-blue.svg',
  'version-marine-white-bg.svg'
];

console.log('🎨 Génération des PNG pour comparaison...\n');

async function generatePalettes() {
  for (const palette of palettes) {
    const inputPath = path.join(__dirname, palette);
    const outputPath = path.join(__dirname, palette.replace('.svg', '.png'));

    try {
      await sharp(inputPath)
        .resize(800, 200) // 2x pour Retina
        .png()
        .toFile(outputPath);

      console.log(`✅ ${palette.replace('.svg', '.png')}`);
    } catch (error) {
      console.error(`❌ ${palette}:`, error.message);
    }
  }

  console.log('\n✨ Terminé ! Ouvre compare.html dans ton navigateur.');
}

generatePalettes();
