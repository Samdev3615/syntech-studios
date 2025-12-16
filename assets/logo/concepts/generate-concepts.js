const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const concepts = [
  'option-a-geometric.svg',
  'option-b-monogram.svg',
  'option-c-symbol.svg'
];

console.log('🎨 Génération des concepts PNG...\n');

async function generateConcepts() {
  for (const concept of concepts) {
    const inputPath = path.join(__dirname, concept);
    const outputPath = path.join(__dirname, concept.replace('.svg', '.png'));

    try {
      await sharp(inputPath)
        .resize(800, 200) // 2x pour Retina
        .png()
        .toFile(outputPath);

      console.log(`✅ ${concept.replace('.svg', '.png')}`);
    } catch (error) {
      console.error(`❌ Erreur sur ${concept}:`, error.message);
    }
  }

  console.log('\n✨ Terminé !');
}

generateConcepts();
