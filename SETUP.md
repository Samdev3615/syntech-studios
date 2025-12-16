# 🛠️ Guide de Setup — SynTech Studios

## ✅ Session 1.1 Complétée

### Structure Créée

```
SynTech Studios/
├── apps/
│   ├── web/           ✅ Next.js 14 + TypeScript + Tailwind
│   ├── backend/       ✅ Node.js + Express + TypeScript
│   └── widget/        ✅ Vite + React + TypeScript
├── packages/
│   ├── types/         ✅ Types TypeScript partagés
│   └── ui/            ✅ Composants UI (Button, Input, Card)
└── Configuration      ✅ Turborepo + pnpm workspaces
```

### Fichiers de Configuration

- ✅ `package.json` — Root monorepo
- ✅ `turbo.json` — Turborepo pipeline
- ✅ `pnpm-workspace.yaml` — pnpm workspaces
- ✅ `tsconfig.json` — TypeScript (root + apps + packages)
- ✅ `.gitignore` — Git exclusions
- ✅ `.prettierrc` — Formatage code
- ✅ `.eslintrc.json` — Linting
- ✅ `.nvmrc` — Version Node.js

### Dépendances Installées

**Total : 604 packages**

- Next.js 14
- React 18
- TypeScript 5.3
- Tailwind CSS 3.4
- Express 4.18
- Drizzle ORM
- OpenAI 4.24
- Socket.io 4.6
- Vite 5.0
- Framer Motion 10.16
- Zustand 4.4
- TanStack Query 5.14
- Et beaucoup plus...

## 🚀 Prochaines Étapes

### Session 1.2 : Configuration Services

**À faire :**

1. **Créer compte Neon.tech (PostgreSQL)**
   - Aller sur https://neon.tech
   - Créer un compte gratuit
   - Créer une database
   - Copier `DATABASE_URL`

2. **Créer compte Upstash (Redis)**
   - Aller sur https://upstash.com
   - Créer un compte gratuit
   - Créer une database Redis
   - Copier `REDIS_URL`

3. **Obtenir clé OpenAI**
   - Aller sur https://platform.openai.com
   - Créer une API key
   - Copier `OPENAI_API_KEY`

4. **Configurer Cloudflare R2 (optionnel)**
   - Aller sur https://cloudflare.com
   - Créer un bucket R2
   - Copier credentials

5. **Créer fichier `.env`**

```bash
# Backend
cd apps/backend
cp .env.example .env
# Éditer .env avec vos clés

# Web (si nécessaire)
cd ../web
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
```

### Session 1.3 : Premier Lancement

```bash
# Lancer tous les projets
pnpm dev
```

**Ports :**
- Frontend (web) : http://localhost:3000
- Backend (API) : http://localhost:3001
- Widget (dev) : http://localhost:5173

## 📦 Scripts Disponibles

### Root

```bash
pnpm dev          # Lancer tous les projets en dev
pnpm build        # Build tous les projets
pnpm lint         # Linter tous les projets
pnpm clean        # Nettoyer node_modules + build
pnpm format       # Formatter avec Prettier
```

### Par App

```bash
# Web
cd apps/web
pnpm dev          # Next.js dev server
pnpm build        # Production build
pnpm start        # Serve production build
pnpm lint         # Lint

# Backend
cd apps/backend
pnpm dev          # Dev avec tsx watch
pnpm build        # Build TypeScript
pnpm start        # Run production

# Widget
cd apps/widget
pnpm dev          # Vite dev server
pnpm build        # Build widget
pnpm preview      # Preview build
```

## 🎯 État Actuel

### ✅ Complété

- [x] Structure monorepo
- [x] Configuration Turborepo
- [x] Configuration TypeScript (strict mode)
- [x] Configuration Tailwind CSS
- [x] Composants UI de base (Button, Input, Card)
- [x] Types partagés (User, Project, Message, API)
- [x] Backend Express basique
- [x] Frontend Next.js basique
- [x] Widget Vite basique
- [x] Logos copiés dans public/
- [x] Dépendances installées (604 packages)

### ⏳ En Attente

- [ ] Configuration .env (backend + web)
- [ ] Base de données PostgreSQL (Neon)
- [ ] Redis (Upstash)
- [ ] Schéma DB avec Drizzle ORM
- [ ] Migrations DB
- [ ] Premier lancement pnpm dev

## 🔧 Dépannage

### Problème : pnpm non trouvé

```bash
npm install -g pnpm
```

### Problème : Port déjà utilisé

```bash
# Changer le port dans package.json de l'app concernée
# Ou tuer le processus :
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Linux/Mac:
lsof -ti:3000 | xargs kill
```

### Problème : Build TypeScript échoue

```bash
# Rebuild tout
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

## 📊 Métriques Session 1.1

- **Durée** : ~1h30
- **Fichiers créés** : 35+
- **Lignes de code** : ~800
- **Packages installés** : 604
- **Taille node_modules** : ~500 MB
- **Progression** : 8% du projet total

## 📚 Documentation

- [README.md](./README.md) — Aperçu général
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Architecture technique
- [ROADMAP.md](./ROADMAP.md) — Plan de développement
- [DEVLOG.md](./DEVLOG.md) — Journal de développement
- [BRAND.md](./assets/logo/BRAND.md) — Guide de marque

---

**Dernière mise à jour** : 2025-12-16
**Version** : 0.2.0
**Session** : 1.1 ✅
