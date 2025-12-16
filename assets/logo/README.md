# 🎨 Logo SynTech Studios — Assets

Ce dossier contient tous les assets du logo SynTech Studios.

## 📁 Fichiers Disponibles

### Logos SVG (Vectoriels)
- `syntech-logo-full.svg` — Logo complet avec gradient (usage principal)
- `syntech-icon.svg` — Icon seul avec animations (favicon, avatar)
- `syntech-logo-white.svg` — Logo blanc monochrome (fond foncé)
- `syntech-logo-black.svg` — Logo noir monochrome (fond clair)

### Preview
- `preview.html` — Page de prévisualisation interactive

## 🚀 Usage Rapide

### Dans HTML
```html
<!-- Logo principal -->
<img src="assets/logo/syntech-logo-full.svg"
     alt="SynTech Studios"
     width="200">

<!-- Icon seul -->
<img src="assets/logo/syntech-icon.svg"
     alt="SynTech Studios"
     width="80">
```

### Dans React/Next.js
```tsx
import Image from 'next/image'
import Logo from '@/assets/logo/syntech-logo-full.svg'

export function Header() {
  return (
    <Image
      src={Logo}
      alt="SynTech Studios"
      width={200}
      height={50}
    />
  )
}
```

### Dans CSS (Background)
```css
.logo {
  background-image: url('/assets/logo/syntech-logo-full.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 200px;
  height: 50px;
}
```

## 📐 Spécifications

### Dimensions Minimales
| Fichier | Largeur min | Hauteur min | Usage |
|---------|-------------|-------------|-------|
| `syntech-logo-full.svg` | 200px | 50px | Web, print |
| `syntech-icon.svg` | 32px | 32px | Favicon, UI |

### Zone de Sécurité
Toujours laisser un espace libre équivalent à **50% de la hauteur du logo** autour de celui-ci.

### Formats de Fond
- **Fond foncé** → Utiliser `syntech-logo-full.svg` ou `syntech-logo-white.svg`
- **Fond clair** → Utiliser `syntech-logo-full.svg` ou `syntech-logo-black.svg`

## 🎨 Couleurs du Logo

### Gradient Principal
```css
background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
```

### Violet
- HEX: `#8b5cf6`
- RGB: `139, 92, 246`

### Cyan
- HEX: `#06b6d4`
- RGB: `6, 182, 212`

## 🔍 Prévisualisation

Ouvrir `preview.html` dans un navigateur pour voir toutes les variations :
```bash
# Windows
start preview.html

# Mac
open preview.html

# Linux
xdg-open preview.html
```

## 📦 Exports Additionnels

Pour générer des exports PNG/WebP, utiliser un outil comme :
- [SVGOMG](https://jakearchibald.github.io/svgomg/) (optimisation SVG)
- [CloudConvert](https://cloudconvert.com/svg-to-png) (conversion)
- Figma/Illustrator (export multi-tailles)

### Tailles PNG Recommandées
```
favicon-16x16.png
favicon-32x32.png
favicon-96x96.png
apple-touch-icon-180x180.png
android-chrome-192x192.png
android-chrome-512x512.png
og-image-1200x630.png
```

## 📚 Documentation Complète

Pour toutes les guidelines d'utilisation, voir :
- [BRAND.md](../../BRAND.md) — Guide d'identité visuelle complet

## ⚠️ Usage Autorisé

Le logo et les assets de marque **SynTech Studios** sont propriété de SynTech Studios.

**Autorisé** :
- ✅ Usage interne (équipe, documents)
- ✅ Partenaires officiels (avec accord)
- ✅ Presse (articles, mentions)

**Non autorisé** :
- ❌ Modification du logo
- ❌ Usage commercial sans accord
- ❌ Imitation de l'identité

## 📞 Support

Questions sur l'utilisation du logo ?
**Email** : brand@syntechstudios.com

---

**Version** : 1.0.0
**Dernière mise à jour** : 2025-12-15
