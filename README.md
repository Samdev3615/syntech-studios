# SynTech Studios

**Studio de développement premium** — Web, Mobile, CRM, Automation & Design

[![Status](https://img.shields.io/badge/Status-En%20D%C3%A9veloppement-yellow)]()
[![Version](https://img.shields.io/badge/Version-0.2.0-blue)]()
[![Budget](https://img.shields.io/badge/Budget-20--55€%2Fmois-green)]()

---

## 🎯 Vision du Projet

**Problème** : Clients et agences perdent des heures à cadrer des projets. Les cahiers des charges sont souvent incomplets, flous ou incohérents.

**Solution** : Un assistant IA qui guide les clients à travers une interview structurée OU analyse leur document existant pour générer un brief professionnel exploitable.

**Valeur ajoutée** :
- ⏱️ **Gain de temps** : Brief complet en 15-30 minutes (vs 2-3h de réunion)
- 🎯 **Qualité** : Questions professionnelles type chef de projet senior
- 🔒 **Confidentialité** : 3 modes (Demo, Privé, NDA)
- 📊 **Export** : PDF professionnel + JSON structuré

---

## 🏗️ Architecture

### Composantes du Système

```
┌─────────────────────────────────────────────────────┐
│  🌐 FRONTEND (Next.js 14)                          │
│  ├─ Application standalone (syntechstudios.com)    │
│  └─ Widget intégrable (iframe)                     │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│  ⚙️ BACKEND (Node.js + Express)                     │
│  ├─ API REST (CRUD sessions, briefs, NDAs)         │
│  ├─ WebSocket (Chat temps réel)                    │
│  ├─ OpenAI Integration (GPT-4 Turbo)               │
│  └─ File Processing (PDF/DOCX parsing)             │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│  💾 DATABASES                                       │
│  ├─ PostgreSQL (Neon) — Données structurées        │
│  ├─ Redis (Upstash) — Cache & sessions             │
│  └─ R2 (Cloudflare) — Fichiers uploadés            │
└─────────────────────────────────────────────────────┘
```

### Stack Technique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| **Frontend** | Next.js 14 + TypeScript | App Router, RSC, Edge, SEO |
| **Styling** | Tailwind CSS + shadcn/ui | Design system moderne, gratuit |
| **Animations** | Framer Motion + GSAP | Effets premium |
| **State** | Zustand + TanStack Query | Simple, performant |
| **Backend** | Node.js 20 + Express | Léger, mature, TypeScript |
| **Database** | PostgreSQL 15 (Drizzle ORM) | Relationnel, SQL-first |
| **Cache** | Redis 7 | Sessions, rate limiting |
| **Storage** | Cloudflare R2 | 10 GB gratuit |
| **IA** | OpenAI GPT-4 Turbo | Best-in-class conversations |
| **Hosting** | Vercel + Railway | Free tiers généreux |

---

## 📁 Structure du Projet

```
SynTech Studios/
├── apps/
│   ├── web/                    # Application Next.js principale
│   │   ├── app/                # App Router (Next.js 14)
│   │   ├── components/         # Composants React
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utils & helpers
│   │   └── public/             # Assets statiques
│   │
│   ├── backend/                # API Node.js
│   │   ├── src/
│   │   │   ├── api/            # Routes & controllers
│   │   │   ├── services/       # Business logic
│   │   │   ├── models/         # Database models
│   │   │   ├── database/       # DB config & migrations
│   │   │   └── websocket/      # Socket.io handlers
│   │   └── tests/              # Tests unitaires
│   │
│   └── widget/                 # Widget intégrable (Vite)
│       ├── src/
│       └── public/
│
├── packages/
│   ├── types/                  # Types TypeScript partagés
│   ├── ui/                     # Composants UI partagés
│   └── config/                 # Config partagée
│
├── docs/
│   ├── ARCHITECTURE.md         # 🏗️ Architecture technique complète
│   ├── ROADMAP.md              # 🗺️ Plan de développement par sessions
│   └── DEVLOG.md               # 📓 Journal de développement
│
├── README.md                   # 👋 Ce fichier
├── package.json                # Root package (monorepo)
├── turbo.json                  # Config Turborepo
└── pnpm-workspace.yaml         # Config pnpm workspaces
```

---

## 📚 Documentation

### Pour Développeurs

| Document | Description | Lien |
|----------|-------------|------|
| **Architecture** | Stack technique, diagrammes, schéma DB, design system | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| **Roadmap** | Plan séquencé en 30+ sessions sur 10 semaines | [ROADMAP.md](./ROADMAP.md) |
| **DevLog** | Journal de développement, décisions, bugs, metrics | [DEVLOG.md](./DEVLOG.md) |

### Pour Product Owners / Stakeholders

- **Vision produit** : Voir section "Vision du Projet" ci-dessus
- **Budget & Coûts** : 20-55€/mois pour MVP (détails dans ARCHITECTURE.md)
- **Timeline** : 10 semaines pour MVP production-ready (détails dans ROADMAP.md)
- **Features MVP** :
  - ✅ Mode interview guidée (sans cahier des charges)
  - ✅ Mode analyse de document (upload PDF/DOCX)
  - ✅ 3 modes de confidentialité (Demo, Privé, NDA)
  - ✅ Génération brief structuré (JSON + PDF)
  - ✅ Widget intégrable sur n'importe quel site
  - ✅ Site vitrine premium avec effets visuels

---

## 🚀 Quick Start (À venir)

> ⚠️ **Note** : Le projet est actuellement en phase de conception. Les commandes ci-dessous seront fonctionnelles après la Session 1.1.

### Prérequis
- Node.js 20+ LTS
- pnpm 8+
- Compte OpenAI (API key)
- Comptes gratuits : Neon, Upstash, Cloudflare

### Installation

```bash
# Cloner le repo
git clone https://github.com/syntechstudios/ai-assistant.git
cd ai-assistant

# Installer dépendances (monorepo)
pnpm install

# Copier .env.example et remplir les variables
cp apps/backend/.env.example apps/backend/.env
cp apps/web/.env.example apps/web/.env

# Setup base de données
cd apps/backend
pnpm db:migrate
pnpm db:seed

# Lancer tous les projets en dev
cd ../..
pnpm dev
```

### Accès

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001
- **Widget Demo** : http://localhost:3000/widget-demo

---

## 💰 Budget & Coûts

### Setup Initial
- Domaine (optionnel) : ~15€/an
- Tests API OpenAI : ~5-10€
- **Total setup** : **~20€**

### Coûts Mensuels (MVP - 100 utilisateurs/mois)

| Service | Plan | Coût |
|---------|------|------|
| Vercel (Frontend) | Hobby | 0€ |
| Railway (Backend) | Free tier | 0-5€ |
| Neon (PostgreSQL) | Free tier | 0€ |
| Upstash (Redis) | Free tier | 0€ |
| Cloudflare R2 | Free tier | 0€ |
| OpenAI API | Pay-as-you-go | 20-50€ |
| Sentry (Monitoring) | Developer | 0€ |
| **TOTAL** | | **20-55€/mois** |

### Scaling (1000+ utilisateurs/mois)
Budget estimé : **100-300€/mois**
- OpenAI : 100-200€
- Railway : 20-50€
- Bases de données : 20-50€
- CDN/Monitoring : 10-20€

---

## 📊 Roadmap & Milestones

### Phase 0 : Conception (Préparation)
- [x] Architecture définie
- [x] Documentation créée
- [x] Logo professionnel (Ocean Blue)
- [x] Guide de marque complet

### Phase 1 : Fondations (Semaines 1-2)
- [x] Setup environnement dev (monorepo)
- [ ] Bases de données configurées
- [ ] Structure de base déployée

### Phase 2 : Backend Core (Semaines 3-4)
- [ ] API REST complète
- [ ] Intégration OpenAI
- [ ] WebSocket temps réel
- [ ] Parsing PDF/DOCX

### Phase 3 : Frontend Standalone (Semaines 5-6)
- [ ] Interface chat
- [ ] Upload fichiers
- [ ] Export brief

### Phase 4 : Widget Intégrable (Semaine 7)
- [ ] Widget iframe
- [ ] Script d'intégration
- [ ] Documentation

### Phase 5 : Site Vitrine (Semaine 8)
- [ ] Landing page premium
- [ ] Animations & effets
- [ ] SEO optimisé

### Phase 6 : Tests & Déploiement (Semaines 9-10)
- [ ] Tests E2E
- [ ] Déploiement production
- [ ] Monitoring

**Détails complets** : Voir [ROADMAP.md](./ROADMAP.md)

---

## 🎨 Design System

### Palette de Couleurs

**Ocean Blue (Principal)**
```css
--ocean-light: #7dd3fc;   /* Clarté & Transparence */
--ocean: #0ea5e9;         /* Innovation & Dynamisme */
--ocean-dark: #0369a1;    /* Expertise & Confiance */
```

**Marine (Fond clair)**
```css
--marine-light: #1e3a8a;
--marine: #1e40af;
--marine-dark: #172554;
```

**Fond**
```css
--bg-primary: #0a0a0f;    /* Noir profond */
--bg-secondary: #1a1a2e;  /* Gris ardoise */
```

### Typographie
- **Primary** : SF Pro Display, Inter, System fonts
- **Mono** : Fira Code Variable

### Animations
- Framer Motion (micro-interactions)
- GSAP (animations avancées)
- Smooth scroll (Lenis)

---

## 🔐 Confidentialité & Sécurité

### 3 Modes de Confidentialité

#### 🎭 Mode DEMO
- Aucun stockage
- Données en mémoire uniquement
- Auto-purge après 30 min

#### 🔒 Mode PRIVÉ
- Stockage temporaire Redis (TTL 2h)
- Aucune trace permanente
- Suppression automatique garantie

#### ✅ Mode NDA
- NDA signé électroniquement
- Données chiffrées (AES-256)
- Stockage sécurisé PostgreSQL
- Accès contrôlé

### Mesures de Sécurité
- Rate limiting (50 req/15min)
- Validation stricte des inputs (Zod)
- Chiffrement at-rest & in-transit
- CORS restrictif
- Scan antivirus uploads (optionnel)
- Logs d'audit (mode NDA)

---

## 🧪 Tests

### Stratégie de Tests

```bash
# Tests unitaires (Jest)
pnpm test

# Tests E2E (Playwright)
pnpm test:e2e

# Coverage
pnpm test:coverage
```

### Objectifs de Coverage
- Backend : > 70%
- Frontend : > 60%
- Critical paths : 100%

---

## 🚀 Déploiement

### Environnements

| Env | URL | Branch | Auto-deploy |
|-----|-----|--------|-------------|
| **Production** | syntechstudios.com | `main` | ✅ |
| **Staging** | staging.syntechstudios.com | `develop` | ✅ |
| **Preview** | preview-*.vercel.app | `feature/*` | ✅ |

### Pipeline CI/CD

```
Push → GitHub Actions
  ├─ Lint & Type Check
  ├─ Tests unitaires
  ├─ Build
  └─ Deploy (Vercel + Railway)
```

---

## 📈 Métriques & KPIs

### Performance Targets
- Time to First Byte : < 200ms
- Largest Contentful Paint : < 2.5s
- Lighthouse Score : > 95/100
- API Response Time : < 300ms (p95)

### Business Metrics (Post-Launch)
- Briefs générés/mois
- Taux de complétion
- Temps moyen par brief
- Satisfaction utilisateur (NPS)

---

## 🤝 Contribution

### Workflow Git

```bash
# Créer une branche feature
git checkout -b feature/nom-feature

# Commiter avec convention
git commit -m "feat: description"

# Pousser et créer PR
git push origin feature/nom-feature
```

### Convention de Commits

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactoring
test: ajout de tests
chore: tâches maintenance
```

---

## 📞 Support & Contact

### Équipe
- **Product Owner** : À définir
- **Lead Developer** : À définir
- **Designer** : À définir

### Ressources
- **Documentation** : Voir `/docs`
- **Issues** : GitHub Issues (à créer)
- **Discussions** : GitHub Discussions (à créer)

---

## 📄 Licence

À définir (Propriétaire ou MIT)

---

## 🙏 Remerciements

- [Vercel](https://vercel.com) pour l'hébergement frontend
- [Railway](https://railway.app) pour l'hébergement backend
- [OpenAI](https://openai.com) pour l'API GPT-4
- [shadcn](https://ui.shadcn.com) pour les composants UI

---

**Dernière mise à jour** : 2025-12-16
**Version** : 0.2.0 (Développement)
**Status** : 🟡 En développement actif

---

> 💡 **Note** : Ce projet suit une approche startup méthodologique avec documentation rigoureuse et séquencement par sessions courtes. Voir [ROADMAP.md](./ROADMAP.md) pour le plan détaillé.
