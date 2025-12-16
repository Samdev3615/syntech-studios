# 🏗️ ARCHITECTURE TECHNIQUE — SYNTECH STUDIOS AI ASSISTANT

> **Version** : 1.0.0
> **Date de création** : 2025-12-15
> **Dernière mise à jour** : 2025-12-15
> **Statut** : 📋 EN CONCEPTION

---

## 📊 Vue d'ensemble

### Objectif du projet
Créer un assistant IA conversationnel pour cadrer des projets digitaux, intégrable comme :
- **Application web standalone** (syntechstudios.com/assistant)
- **Widget iframe** intégrable sur n'importe quel site

### Contraintes business
- ✅ **Budget minimum** : Maximiser l'utilisation de services gratuits/freemium
- ✅ **Site vitrine premium** : Technologie moderne avec effets visuels impressionnants
- ✅ **Confidentialité stricte** : 3 modes (Demo, Privé, NDA)
- ✅ **Scalabilité** : Architecture prête pour la croissance

---

## 🎯 Stack Technique (COÛT OPTIMISÉ)

### Frontend — Next.js 14
```yaml
Framework: Next.js 14.1 (App Router)
Langage: TypeScript 5.3
Styling: Tailwind CSS 3.4
UI Components: shadcn/ui (gratuit)
Animations:
  - Framer Motion (animations React)
  - GSAP (animations avancées)
  - Lenis (smooth scroll)
State Management: Zustand 4.4
Data Fetching: TanStack Query 5.0
3D Graphics: Three.js / React Three Fiber (optionnel)
```

**Coût** : 0€ (technologies open source)

### Backend — Node.js
```yaml
Runtime: Node.js 20 LTS
Framework: Express.js 4.18
Langage: TypeScript 5.3
API: REST + WebSocket (Socket.io)
Validation: Zod 3.22
```

**Coût** : 0€ (technologies open source)

### Base de données
```yaml
Primary DB: PostgreSQL 15
  - Provider: Neon (free tier: 0.5 GB, suffisant pour MVP)
  - Alternative: Supabase (free tier: 500 MB)

Cache/Sessions: Redis
  - Provider: Upstash (free tier: 10K commandes/jour)
  - Alternative: Redis Cloud (30 MB gratuit)

File Storage:
  - Provider: Cloudflare R2 (10 GB gratuit)
  - Alternative: Supabase Storage (1 GB gratuit)
```

**Coût estimé** : 0€ en MVP (free tiers suffisants)

### IA & LLM
```yaml
Provider: OpenAI
Model: GPT-4 Turbo (gpt-4-turbo-preview)
Fallback: GPT-3.5 Turbo (moins cher)

Stratégie d'optimisation coûts:
  - Streaming responses (meilleure UX)
  - Context window optimisé (réduire tokens)
  - Cache des prompts répétitifs
  - Rate limiting utilisateur
```

**Coût estimé** :
- GPT-4 Turbo : ~$0.01/1K tokens input, ~$0.03/1K tokens output
- Budget mensuel estimé MVP : **20-50€/mois** (100-250 conversations)

### Hébergement & Déploiement

#### Frontend (Next.js)
```yaml
Provider: Vercel
Plan: Hobby (gratuit)
Limitations:
  - 100 GB bandwidth/mois
  - Builds illimités
  - Domaine custom gratuit
Features:
  - Edge functions
  - Analytics basique
  - Déploiement automatique (Git)
```

**Coût** : 0€

#### Backend (Node.js API)
```yaml
Option 1 (Recommandée): Railway
  - Free tier: 500h/mois + 5$/mois de crédit
  - PostgreSQL inclus
  - Auto-deploy Git
  - Coût estimé: 0-5$/mois

Option 2: Render
  - Free tier: 750h/mois
  - PostgreSQL gratuit (90 jours puis 7$/mois)
  - Coût estimé: 0$/mois (MVP)

Option 3: VPS Hetzner (si besoin scalabilité)
  - CX11: 4.15€/mois (2 vCPU, 4 GB RAM)
  - Self-hosted PostgreSQL + Redis
  - Setup plus complexe mais coût fixe
```

**Coût estimé** : 0-5€/mois

### Monitoring & Analytics
```yaml
Error Tracking: Sentry (free tier: 5K events/mois)
Analytics: Vercel Analytics (gratuit) + PostHog (free tier)
Uptime Monitoring: UptimeRobot (gratuit: 50 monitors)
Logs: Better Stack (free tier: 1 GB/mois)
```

**Coût** : 0€

---

## 🏛️ Architecture Système

### Diagramme Global

```
┌─────────────────────────────────────────────────────────────────┐
│                         UTILISATEURS                             │
│  • Client avec projet  • Visiteur  • Admin SynTech              │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
    ┌────▼─────┐                   ┌────▼────┐
    │  Widget  │                   │   App   │
    │  Iframe  │                   │ Standalone│
    └────┬─────┘                   └────┬────┘
         │                               │
         └───────────────┬───────────────┘
                         │
                    ┌────▼────┐
                    │ Vercel  │
                    │ Next.js │
                    │ Edge    │
                    └────┬────┘
                         │ HTTPS/WSS
         ┌───────────────┴───────────────┐
         │                               │
    ┌────▼─────┐                   ┌────▼────┐
    │   REST   │                   │   WSS   │
    │   API    │                   │ Socket  │
    └────┬─────┘                   └────┬────┘
         │                               │
         └───────────────┬───────────────┘
                         │
              ┌──────────▼──────────┐
              │   BACKEND (Railway) │
              │   Node.js + Express │
              └──────────┬──────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼─────┐   ┌────▼────┐   ┌─────▼────┐
    │PostgreSQL│   │  Redis  │   │ OpenAI   │
    │  (Neon)  │   │(Upstash)│   │   API    │
    └──────────┘   └─────────┘   └──────────┘
         │
    ┌────▼─────┐
    │    R2    │
    │(Fichiers)│
    └──────────┘
```

### Structure des Services Backend

```
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── session.routes.ts      # POST /session, GET /session/:id
│   │   │   ├── chat.routes.ts         # POST /chat/message
│   │   │   ├── file.routes.ts         # POST /file/upload
│   │   │   ├── nda.routes.ts          # POST /nda/generate, /accept
│   │   │   └── brief.routes.ts        # GET /brief/export/:format
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts     # Validation session
│   │   │   ├── rateLimit.middleware.ts
│   │   │   └── upload.middleware.ts   # Validation fichiers
│   │   └── controllers/
│   │       ├── SessionController.ts
│   │       ├── ChatController.ts
│   │       ├── FileController.ts
│   │       └── BriefController.ts
│   ├── services/
│   │   ├── ai/
│   │   │   ├── OpenAIService.ts       # Abstraction OpenAI
│   │   │   ├── ConversationEngine.ts  # Logique interview
│   │   │   ├── PromptLibrary.ts       # Templates prompts
│   │   │   └── RAGService.ts          # Analyse documents
│   │   ├── parser/
│   │   │   ├── PDFParser.ts
│   │   │   ├── DOCXParser.ts
│   │   │   └── TextAnalyzer.ts
│   │   ├── privacy/
│   │   │   ├── DataLifecycle.ts       # Gestion données/TTL
│   │   │   ├── NDAGenerator.ts
│   │   │   └── EncryptionService.ts
│   │   └── export/
│   │       ├── PDFExporter.ts
│   │       └── JSONFormatter.ts
│   ├── models/
│   │   ├── Session.model.ts
│   │   ├── Message.model.ts
│   │   ├── NDA.model.ts
│   │   └── Brief.model.ts
│   ├── database/
│   │   ├── postgresql.ts              # Drizzle ORM
│   │   ├── redis.ts                   # Upstash client
│   │   └── migrations/
│   ├── websocket/
│   │   ├── socket.handler.ts
│   │   └── events.ts
│   ├── utils/
│   │   ├── logger.ts                  # Pino logger
│   │   ├── errors.ts
│   │   └── validators.ts
│   └── config/
│       ├── env.ts                     # Validation env vars
│       └── constants.ts
└── tests/
```

---

## 🎨 Frontend — Design System

### Palette de Couleurs (Premium Tech)
```css
/* Dark Theme (principal) */
--bg-primary: #0a0a0f;      /* Noir profond */
--bg-secondary: #1a1a2e;    /* Gris ardoise */
--bg-tertiary: #16213e;     /* Bleu marine foncé */

--accent-primary: #8b5cf6;  /* Violet vibrant */
--accent-secondary: #06b6d4; /* Cyan électrique */
--accent-gradient: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);

--text-primary: #ffffff;
--text-secondary: #a1a1aa;
--text-muted: #52525b;

/* Glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-blur: blur(20px);
```

### Typographie
```css
/* Fonts */
Font-Primary: Inter Variable (Google Fonts - gratuit)
Font-Mono: Fira Code Variable (code/tech)
Font-Display: Clash Display (titres impactants - gratuit)

/* Échelle */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
--text-7xl: 4.5rem;    /* 72px */
```

### Animations & Effets

#### Micro-interactions
```typescript
// Boutons avec effet magnetic
const magneticEffect = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
}

// Cards avec tilt 3D (react-tilt)
<Tilt tiltMaxAngleX={5} tiltMaxAngleY={5}>
  <Card />
</Tilt>

// Smooth reveal on scroll (Framer Motion)
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
}
```

#### Effets visuels premium

**1. Hero avec gradient animé**
```tsx
// Gradient qui bouge (GSAP)
<div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-cyan-600/20 to-purple-600/20 animate-gradient" />
```

**2. Particules flottantes** (particles.js ou custom Canvas)
```tsx
<ParticlesBackground
  density={50}
  color="#8b5cf6"
  opacity={0.3}
/>
```

**3. Bento Grid avec hover effects**
```tsx
// Cards qui s'illuminent au survol
<BentoCard className="group">
  <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-600/10 to-violet-600/0
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
</BentoCard>
```

**4. Text reveal animation**
```tsx
// Texte qui apparaît lettre par lettre
<TextReveal text="Assistant IA de Cadrage Projet" />
```

**5. Scroll-triggered animations** (Intersection Observer + Framer)

**6. Curseur personnalisé** (optionnel mais impressionnant)

---

## 🔐 Sécurité & Confidentialité

### Gestion des 3 modes

#### Mode DEMO (zéro stockage)
```typescript
// Tout en mémoire côté serveur (Map JavaScript)
const demoSessions = new Map<string, Session>()

// Auto-purge après 30 min d'inactivité
setTimeout(() => demoSessions.delete(sessionId), 30 * 60 * 1000)
```

#### Mode PRIVÉ (Redis avec TTL)
```typescript
// Upstash Redis avec expiration automatique
await redis.setex(`session:${sessionId}`, 7200, JSON.stringify(data))

// Aucune sauvegarde en DB permanente
```

#### Mode NDA (PostgreSQL chiffré)
```typescript
// Données chiffrées AES-256
import { createCipheriv, createDecipheriv } from 'crypto'

const algorithm = 'aes-256-gcm'
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')

function encrypt(text: string) {
  const iv = crypto.randomBytes(16)
  const cipher = createCipheriv(algorithm, key, iv)
  // ... chiffrement
}
```

### Rate Limiting
```typescript
// Express rate limit
import rateLimit from 'express-rate-limit'

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 50, // 50 messages max
  message: 'Trop de messages, réessayez dans 15 minutes.'
})

app.use('/api/chat', chatLimiter)
```

### Validation des uploads
```typescript
// Multer avec restrictions
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Type de fichier non autorisé'))
    }

    cb(null, true)
  }
})
```

---

## 📊 Schéma Base de Données

### PostgreSQL (Drizzle ORM)

```typescript
// schema.ts
import { pgTable, uuid, varchar, timestamp, text, jsonb, boolean } from 'drizzle-orm/pg-core'

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  privacyMode: varchar('privacy_mode', { length: 10 }).notNull(), // 'demo' | 'private' | 'nda'
  status: varchar('status', { length: 20 }).default('active'), // 'active' | 'completed' | 'archived'
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  metadata: jsonb('metadata'), // Données chiffrées en mode NDA
})

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'user' | 'assistant' | 'system'
  content: text('content').notNull(), // Chiffré en mode NDA
  timestamp: timestamp('timestamp').defaultNow(),
})

export const ndas = pgTable('ndas', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  clientEmail: varchar('client_email', { length: 255 }).notNull(),
  companyName: varchar('company_name', { length: 255 }),
  documentUrl: text('document_url').notNull(), // URL R2/S3
  status: varchar('status', { length: 20 }).default('pending'), // 'pending' | 'accepted'
  generatedAt: timestamp('generated_at').defaultNow(),
  acceptedAt: timestamp('accepted_at'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
})

export const briefs = pgTable('briefs', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  data: jsonb('data').notNull(), // Structure JSON complète du brief
  status: varchar('status', { length: 20 }).default('draft'), // 'draft' | 'complete'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const uploadedFiles = pgTable('uploaded_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => sessions.id).notNull(),
  filename: varchar('filename', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(), // URL R2
  fileType: varchar('file_type', { length: 50 }),
  fileSize: integer('file_size'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
})
```

---

## 🚀 Optimisations Performances

### Frontend
```yaml
- Code splitting automatique (Next.js)
- Image optimization (next/image)
- Font optimization (next/font)
- Route prefetching
- Lazy loading components (React.lazy)
- Memoization (React.memo, useMemo, useCallback)
- Virtual scrolling pour longues listes
```

### Backend
```yaml
- Connection pooling PostgreSQL
- Redis caching (prompts fréquents)
- Response compression (gzip)
- Streaming responses (OpenAI + Socket.io)
- Database indexing sur colonnes critiques
```

### OpenAI
```yaml
- Streaming responses (meilleure UX + perception de vitesse)
- Context pruning (garder seulement 10 derniers messages)
- Prompt caching (réutiliser system prompts)
- Fallback GPT-3.5 pour questions simples
```

---

## 📈 Stratégie de Scaling (Post-MVP)

### Quand passer aux plans payants ?

**Vercel** : Passer à Pro (20$/mois) si :
- \> 100 GB bandwidth/mois
- Besoin d'analytics avancées

**Railway/Render** : Passer à payant (~5-20$/mois) si :
- \> 500h compute/mois
- Besoin de garanties uptime

**PostgreSQL/Redis** : Passer à payant (~10-25$/mois) si :
- \> 1 GB données
- \> 10K requêtes/jour Redis

**OpenAI** : Budget variable selon utilisation
- Prévoir 100-500€/mois si 1000+ conversations/mois

### Architecture évoluée (>1000 utilisateurs/jour)
```
- Load balancer (Nginx/Cloudflare)
- Backend horizontal scaling (plusieurs instances)
- CDN global (Cloudflare R2 + CDN)
- Database read replicas
- Queue system (BullMQ + Redis) pour tâches lourdes
- Monitoring avancé (Datadog/New Relic)
```

---

## 🎯 KPIs Techniques

### Performance
- Time to First Byte (TTFB) : < 200ms
- First Contentful Paint (FCP) : < 1.5s
- Largest Contentful Paint (LCP) : < 2.5s
- Time to Interactive (TTI) : < 3.5s
- Lighthouse Score : > 95/100

### Disponibilité
- Uptime : > 99.5% (MVP), > 99.9% (Production)
- Temps de réponse API : < 300ms (p95)
- WebSocket latency : < 100ms

### Coûts (MVP - 100 utilisateurs/mois)
- Hébergement : 0-5€/mois
- Base de données : 0€/mois (free tiers)
- OpenAI : 20-50€/mois
- Monitoring : 0€/mois (free tiers)
- **TOTAL** : **20-55€/mois**

---

## 📚 Technologies & Ressources

### Documentation
- Next.js : https://nextjs.org/docs
- Drizzle ORM : https://orm.drizzle.team/docs
- Tailwind CSS : https://tailwindcss.com/docs
- Framer Motion : https://www.framer.com/motion
- shadcn/ui : https://ui.shadcn.com

### Inspiration Design
- https://www.awwwards.com (sites primés)
- https://www.relume.io (composants modernes)
- https://aceternity.com/components (effets visuels)
- https://ui.aceternity.com (UI components premium)

### Outils Développement
- VS Code + Extensions (ESLint, Prettier, Tailwind IntelliSense)
- Postman/Insomnia (tests API)
- Drizzle Studio (GUI base de données)
- Redis Commander (GUI Redis)

---

## 🔄 Prochaines Étapes

Voir `ROADMAP.md` pour le séquencement détaillé des tâches.

---

**Dernière mise à jour** : 2025-12-15
**Responsable** : Équipe SynTech Studios
**Status** : ✅ Architecture validée, prête pour implémentation
