# 🖼️ Génération des PNG — Guide Rapide

Ce dossier contient un script automatique pour générer **tous les PNG nécessaires** depuis les SVG.

---

## 🚀 Installation & Génération (2 minutes)

### Étape 1 : Installer les dépendances

Ouvre un terminal dans ce dossier et exécute :

```bash
npm install
```

Cela installera `sharp`, la bibliothèque de conversion d'images la plus performante.

### Étape 2 : Générer les PNG

```bash
npm run generate
```

**OU directement :**

```bash
node generate-pngs.js
```

### Résultat

Le script va créer un dossier `exports/` avec **25+ fichiers PNG** :

```
exports/
├── favicons/
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── favicon-96x96.png
├── logos/
│   ├── logo-200.png
│   ├── logo-400.png
│   ├── logo-800.png (Retina)
│   └── logo-1200.png (Ultra HD)
├── mobile/
│   ├── apple-touch-icon-180.png
│   ├── android-chrome-192.png
│   └── android-chrome-512.png
├── icons/
│   ├── icon-64.png
│   ├── icon-128.png
│   ├── icon-256.png
│   └── icon-512.png
└── social/
    └── og-image-1200x630.png
```

---

## 📋 Liste Complète des Exports

### Favicons (Web)
| Fichier | Taille | Usage |
|---------|--------|-------|
| `favicon-16x16.png` | 16×16 | Onglet navigateur (petite) |
| `favicon-32x32.png` | 32×32 | Onglet navigateur (standard) |
| `favicon-96x96.png` | 96×96 | Raccourcis bureau |

### Logos Complets
| Fichier | Largeur | Usage |
|---------|---------|-------|
| `logo-200.png` | 200px | Signature email, petits espaces |
| `logo-400.png` | 400px | Header site web |
| `logo-800.png` | 800px | Écrans Retina (2×) |
| `logo-1200.png` | 1200px | Print, ultra haute résolution |

### Logos Monochromes
| Fichier | Description |
|---------|-------------|
| `logo-white-*.png` | Logo blanc (fond foncé) |
| `logo-black-*.png` | Logo noir (fond clair) |

### Icons Mobile
| Fichier | Taille | Usage |
|---------|--------|-------|
| `apple-touch-icon-180.png` | 180×180 | iOS app icon, raccourci |
| `android-chrome-192.png` | 192×192 | Android app icon |
| `android-chrome-512.png` | 512×512 | Android splash screen |

### Icons Génériques
| Fichier | Taille | Usage |
|---------|--------|-------|
| `icon-64.png` | 64×64 | Avatar, petit icon |
| `icon-128.png` | 128×128 | Notifications |
| `icon-256.png` | 256×256 | App launchers |
| `icon-512.png` | 512×512 | HD displays |

### Social Media
| Fichier | Taille | Usage |
|---------|--------|-------|
| `og-image-1200x630.png` | 1200×630 | Open Graph (Facebook, Twitter, LinkedIn) |

---

## 🔧 Personnalisation

### Ajouter d'autres tailles

Édite le fichier `generate-pngs.js` et ajoute dans la section `EXPORTS` :

```javascript
{
  input: 'syntech-logo-full.svg',
  outputs: [
    { name: 'mon-logo-custom.png', width: 600 }, // Largeur custom
    { name: 'mon-icon-custom.png', width: 150, height: 150 }, // Taille exacte
  ]
}
```

Puis relance : `npm run generate`

### Changer la qualité

Par défaut, Sharp génère des PNG de haute qualité. Pour réduire le poids :

```javascript
.png({ quality: 80 }) // Au lieu de .png()
```

---

## 🌐 Alternative : Conversion en Ligne

Si tu ne veux pas installer Node.js, utilise ces outils en ligne :

### CloudConvert (Recommandé)
1. Va sur : https://cloudconvert.com/svg-to-png
2. Upload un SVG (ex: `syntech-logo-full.svg`)
3. Clique sur l'icône "⚙️" pour choisir la taille
4. Télécharge le PNG

### Autres outils
- **SVGOMG** : https://jakearchibald.github.io/svgomg/ (optimisation)
- **Favicon.io** : https://favicon.io/favicon-converter/ (favicon multi-tailles)
- **RealFaviconGenerator** : https://realfavicongenerator.net/ (favicon complet)

---

## 📦 Intégration dans le Site Web

### HTML (Favicons)

```html
<head>
  <!-- Favicon standard -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

  <!-- Apple Touch Icon (iOS) -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png">

  <!-- Android -->
  <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192.png">

  <!-- Open Graph (Social Media) -->
  <meta property="og:image" content="https://syntechstudios.com/og-image-1200x630.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
</head>
```

### React/Next.js

```tsx
import Image from 'next/image'
import LogoPNG from '@/assets/logo/exports/logo-400.png'

export function Header() {
  return (
    <Image
      src={LogoPNG}
      alt="SynTech Studios"
      width={200}
      height={50}
    />
  )
}
```

### CSS (Background)

```css
.logo {
  background-image: url('/assets/logo/exports/logo-400.png');
  background-size: contain;
  width: 200px;
  height: 50px;
}
```

---

## ⚡ Performance

### Tailles de fichiers (estimées)

| Type | Taille approximative |
|------|---------------------|
| SVG (logo complet) | ~8 Ko |
| PNG 200px | ~15 Ko |
| PNG 400px | ~30 Ko |
| PNG 800px | ~60 Ko |
| PNG 1200px | ~90 Ko |
| Icon 512px | ~35 Ko |

### Optimisation

Pour réduire encore plus le poids :

1. **Utiliser WebP** (support moderne uniquement)
   ```bash
   npm install sharp
   node -e "require('sharp')('logo.png').webp().toFile('logo.webp')"
   ```

2. **Compresser avec TinyPNG**
   https://tinypng.com/ (jusqu'à -70% de poids)

3. **Servir via CDN**
   - Cloudflare Images
   - Vercel Image Optimization
   - AWS CloudFront

---

## 🐛 Dépannage

### Erreur : "Cannot find module 'sharp'"

```bash
npm install sharp
```

### Erreur : "ENOENT: no such file or directory"

Vérifie que tu es bien dans le dossier `assets/logo/` :

```bash
cd "C:\Users\97250\Desktop\SynTech Studios\assets\logo"
node generate-pngs.js
```

### Erreur : "sharp installation failed"

Sur Windows, sharp nécessite Visual C++ Build Tools. Deux solutions :

**Solution A (Recommandée)** : Utiliser un outil en ligne (CloudConvert)

**Solution B** : Installer les build tools
```bash
npm install --global windows-build-tools
npm install sharp
```

### Les PNG sont flous

Assure-toi d'utiliser les versions **2× pour écrans Retina** :
- Logo 400px → Afficher en 200px sur le site
- Logo 800px → Afficher en 400px sur le site

---

## 📚 Ressources

- **Sharp Documentation** : https://sharp.pixelplumbing.com/
- **SVG vs PNG Guide** : https://vecta.io/blog/comparing-svg-and-png-file-formats
- **Favicon Best Practices** : https://evilmartians.com/chronicles/how-to-favicon-in-2021

---

## ✅ Checklist Finale

Avant de déployer le site :

- [ ] Générer tous les PNG (25+ fichiers)
- [ ] Tester favicons sur différents navigateurs
- [ ] Vérifier Open Graph image (partage sur réseaux sociaux)
- [ ] Optimiser les PNG (TinyPNG)
- [ ] Upload sur CDN ou dossier public/
- [ ] Tester affichage sur mobile (iOS + Android)
- [ ] Vérifier performances Lighthouse (score images)

---

**Questions ?** Voir [BRAND.md](../../BRAND.md) pour toutes les guidelines.

**Dernière mise à jour** : 2025-12-15
