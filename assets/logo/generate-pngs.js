/**
 * Script de génération des PNG depuis les SVG
 * Génère toutes les tailles nécessaires pour web, mobile et social media
 *
 * Usage: node generate-pngs.js
 * Prérequis: npm install sharp
 */

const fs = require('fs');
const path = require('path');

// Vérifier si sharp est installé
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('❌ Erreur : Le package "sharp" n\'est pas installé');
  console.log('\n📦 Installation requise :');
  console.log('   npm install sharp');
  console.log('\n   OU');
  console.log('\n   pnpm install sharp');
  process.exit(1);
}

// Configuration des exports
const EXPORTS_DIR = path.join(__dirname, 'exports');
const SVG_DIR = __dirname;

// Créer le dossier exports s'il n'existe pas
if (!fs.existsSync(EXPORTS_DIR)) {
  fs.mkdirSync(EXPORTS_DIR, { recursive: true });
}

// Définition de tous les formats à générer
const EXPORTS = [
  // ==================== FAVICONS ====================
  {
    input: 'syntech-icon.svg',
    outputs: [
      { name: 'favicon-16x16.png', width: 16, height: 16 },
      { name: 'favicon-32x32.png', width: 32, height: 32 },
      { name: 'favicon-96x96.png', width: 96, height: 96 },
    ]
  },

  // ==================== LOGO COMPLET ====================
  {
    input: 'syntech-logo-full.svg',
    outputs: [
      { name: 'logo-200.png', width: 200 },
      { name: 'logo-400.png', width: 400 },
      { name: 'logo-800.png', width: 800 }, // High-res pour Retina
      { name: 'logo-1200.png', width: 1200 }, // Ultra high-res
    ]
  },

  // ==================== LOGO BLANC ====================
  {
    input: 'syntech-logo-white.svg',
    outputs: [
      { name: 'logo-white-200.png', width: 200 },
      { name: 'logo-white-400.png', width: 400 },
      { name: 'logo-white-800.png', width: 800 },
    ]
  },

  // ==================== LOGO MARINE (FOND BLANC) ====================
  {
    input: 'syntech-logo-marine.svg',
    outputs: [
      { name: 'logo-marine-200.png', width: 200 },
      { name: 'logo-marine-400.png', width: 400 },
      { name: 'logo-marine-800.png', width: 800 },
    ]
  },

  // ==================== MOBILE ICONS ====================
  {
    input: 'syntech-icon.svg',
    outputs: [
      { name: 'apple-touch-icon-180.png', width: 180, height: 180 }, // iOS
      { name: 'android-chrome-192.png', width: 192, height: 192 }, // Android
      { name: 'android-chrome-512.png', width: 512, height: 512 }, // Android splash
    ]
  },

  // ==================== ICON MULTI-TAILLES ====================
  {
    input: 'syntech-icon.svg',
    outputs: [
      { name: 'icon-64.png', width: 64, height: 64 },
      { name: 'icon-128.png', width: 128, height: 128 },
      { name: 'icon-256.png', width: 256, height: 256 },
      { name: 'icon-512.png', width: 512, height: 512 },
    ]
  },
];

// Fonction de conversion SVG → PNG
async function convertSvgToPng(inputPath, outputPath, width, height = null) {
  try {
    const sharpInstance = sharp(inputPath);

    if (height) {
      // Si hauteur spécifiée, resize exact
      await sharpInstance
        .resize(width, height, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent
        })
        .png()
        .toFile(outputPath);
    } else {
      // Sinon, resize par largeur en gardant ratio
      await sharpInstance
        .resize(width)
        .png()
        .toFile(outputPath);
    }

    return true;
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
    return false;
  }
}

// Fonction principale
async function generateAllPngs() {
  console.log('🎨 SynTech Studios — Générateur PNG\n');
  console.log('📁 Dossier source : ' + SVG_DIR);
  console.log('📁 Dossier export : ' + EXPORTS_DIR);
  console.log('─'.repeat(60));

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const exportGroup of EXPORTS) {
    const inputPath = path.join(SVG_DIR, exportGroup.input);

    // Vérifier que le fichier source existe
    if (!fs.existsSync(inputPath)) {
      console.log(`\n⚠️  Fichier source introuvable : ${exportGroup.input}`);
      totalFailed += exportGroup.outputs.length;
      continue;
    }

    console.log(`\n📄 ${exportGroup.input}`);

    for (const output of exportGroup.outputs) {
      const outputPath = path.join(EXPORTS_DIR, output.name);
      const dimensions = output.height
        ? `${output.width}×${output.height}`
        : `${output.width}px`;

      process.stdout.write(`   → ${output.name} (${dimensions})... `);

      const success = await convertSvgToPng(
        inputPath,
        outputPath,
        output.width,
        output.height
      );

      if (success) {
        console.log('✅');
        totalSuccess++;
      } else {
        console.log('❌');
        totalFailed++;
      }
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`\n✅ ${totalSuccess} fichiers générés avec succès`);
  if (totalFailed > 0) {
    console.log(`❌ ${totalFailed} échecs`);
  }
  console.log(`\n📦 Tous les PNG sont dans : ${EXPORTS_DIR}`);
}

// Fonction pour générer l'Open Graph image (social media)
async function generateOGImage() {
  console.log('\n🎨 Génération de l\'image Open Graph (1200×630)...');

  const ogPath = path.join(EXPORTS_DIR, 'og-image-1200x630.png');

  try {
    // Créer une image OG avec fond gradient et logo centré
    const width = 1200;
    const height = 630;

    // SVG pour l'OG image (fond + logo)
    const ogSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
          </linearGradient>
        </defs>

        <!-- Background -->
        <rect width="${width}" height="${height}" fill="url(#bg)"/>

        <!-- Dark overlay -->
        <rect width="${width}" height="${height}" fill="#0a0a0f" opacity="0.7"/>

        <!-- Logo (sera superposé) -->
        <text x="${width/2}" y="${height/2 - 40}"
              font-family="Arial, sans-serif"
              font-size="80"
              font-weight="bold"
              fill="white"
              text-anchor="middle">SynTech Studios</text>

        <text x="${width/2}" y="${height/2 + 40}"
              font-family="Arial, sans-serif"
              font-size="36"
              fill="#a1a1aa"
              text-anchor="middle">Assistant IA de Cadrage Projet</text>
      </svg>
    `;

    await sharp(Buffer.from(ogSvg))
      .png()
      .toFile(ogPath);

    console.log('   ✅ og-image-1200x630.png généré');
  } catch (error) {
    console.error('   ❌ Erreur:', error.message);
  }
}

// Fonction pour créer un favicon.ico multi-tailles
async function generateFavicon() {
  console.log('\n🎨 Génération du favicon.ico...');
  console.log('   ⚠️  Pour créer un .ico multi-tailles, utilisez un outil en ligne :');
  console.log('   → https://www.favicon-generator.org/');
  console.log('   → Uploader : exports/favicon-32x32.png');
}

// Exécution
(async () => {
  try {
    await generateAllPngs();
    await generateOGImage();
    await generateFavicon();

    console.log('\n✨ Génération terminée !\n');
  } catch (error) {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  }
})();
