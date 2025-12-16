# 🔑 Guide d'Obtention des Clés API — SynTech Studios

Ce guide vous accompagne pas à pas pour obtenir toutes les clés API nécessaires au fonctionnement du backend.

---

## 📋 Récapitulatif des Services Nécessaires

| Service | Gratuit ? | Temps setup | Priorité |
|---------|-----------|-------------|----------|
| **Neon (PostgreSQL)** | ✅ Oui (0.5 GB) | ~5 min | 🔴 **Critique** |
| **Upstash (Redis)** | ✅ Oui (10K req/jour) | ~3 min | 🔴 **Critique** |
| **OpenAI** | ⚠️ Pay-as-you-go | ~2 min | 🔴 **Critique** |
| **Cloudflare R2** | ✅ Oui (10 GB) | ~5 min | 🟡 Optionnel (pour plus tard) |

**Budget estimé** : 5-10€ pour tester OpenAI

---

## 1️⃣ Neon.tech (PostgreSQL)

### Pourquoi Neon ?
- PostgreSQL serverless gratuit (0.5 GB)
- Pas de carte bancaire requise pour le free tier
- Branching de DB (très pratique pour dev)
- Excellent pour MVP

### Étapes

1. **Créer un compte**
   - Aller sur : https://neon.tech
   - Cliquer sur "Sign Up"
   - S'inscrire avec GitHub ou Email

2. **Créer un projet**
   - Cliquer sur "New Project"
   - Nom du projet : `syntech-studios`
   - Région : Choisir la plus proche (US East ou Europe)
   - PostgreSQL version : 15 ou 16
   - Cliquer sur "Create Project"

3. **Obtenir la Connection String**
   - Une fois le projet créé, vous verrez la "Connection String"
   - Format : `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - **⚠️ IMPORTANT** : Copier cette string **immédiatement** (elle contient le mot de passe)

4. **Copier dans .env**
   ```bash
   DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

---

## 2️⃣ Upstash (Redis)

### Pourquoi Upstash ?
- Redis serverless gratuit (10K commandes/jour)
- Parfait pour caching et sessions temporaires (mode PRIVÉ)
- Pas de carte bancaire requise

### Étapes

1. **Créer un compte**
   - Aller sur : https://upstash.com
   - Cliquer sur "Sign Up"
   - S'inscrire avec GitHub ou Email

2. **Créer une database Redis**
   - Dans le dashboard, cliquer sur "Create Database"
   - Nom : `syntech-redis`
   - Type : **Redis**
   - Région : Choisir la plus proche de votre backend (US East ou Europe)
   - TLS : **Activer** (recommandé)
   - Cliquer sur "Create"

3. **Obtenir la Connection String**
   - Dans la page de détails de la database
   - Copier "Connection String" (format : `redis://default:xxx@xxx.upstash.io:6379`)
   - Ou copier les informations séparées (Endpoint + Password)

4. **Copier dans .env**
   ```bash
   REDIS_URL=redis://default:xxxxxxxxxxxxx@us1-great-dolphin-12345.upstash.io:6379
   ```

---

## 3️⃣ OpenAI API

### Pourquoi OpenAI ?
- GPT-4 Turbo : Meilleur modèle conversationnel du marché
- Pay-as-you-go : Vous ne payez que ce que vous utilisez
- GPT-3.5 Turbo : Fallback moins cher

### Budget
- **Développement** : ~5-10€ pour tester (100-200 conversations)
- **Production (MVP)** : 20-50€/mois (100-250 conversations/mois)

### Étapes

1. **Créer un compte OpenAI**
   - Aller sur : https://platform.openai.com/signup
   - S'inscrire avec Email ou Google
   - **⚠️ Une carte bancaire est requise** (mais pas de frais fixe)

2. **Ajouter des crédits**
   - Aller dans "Settings" → "Billing"
   - Ajouter une méthode de paiement
   - Ajouter 10-20€ de crédits pour commencer
   - Configurer un plafond de dépense (ex : 50€/mois max)

3. **Créer une API Key**
   - Aller dans "API keys" : https://platform.openai.com/api-keys
   - Cliquer sur "Create new secret key"
   - Nom : `SynTech Backend`
   - Permissions : **All** (ou Read + Write sur Models)
   - **⚠️ IMPORTANT** : Copier la clé **immédiatement** (elle ne sera plus affichée)

4. **Copier dans .env**
   ```bash
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Optimisation des Coûts
- GPT-4 Turbo : ~$0.01/1K tokens input, ~$0.03/1K tokens output
- GPT-3.5 Turbo : ~$0.0005/1K tokens (20x moins cher)
- **Stratégie** : Utiliser GPT-4 pour questions complexes, GPT-3.5 pour simples

---

## 4️⃣ Cloudflare R2 (OPTIONNEL)

### Pourquoi Cloudflare R2 ?
- Stockage d'objets gratuit (10 GB)
- Compatible S3 (facile à utiliser)
- Pas de frais d'egress (bande passante gratuite)

### ⚠️ Note
Ce service est **optionnel** pour l'instant. Vous pouvez le configurer plus tard quand vous implémenterez l'upload de fichiers (Session 2.3).

### Étapes (Si vous voulez le faire maintenant)

1. **Créer un compte Cloudflare**
   - Aller sur : https://dash.cloudflare.com/sign-up
   - S'inscrire avec Email

2. **Activer R2**
   - Dans le dashboard, aller dans "R2"
   - Cliquer sur "Enable R2" (gratuit, pas de carte requise)

3. **Créer un bucket**
   - Cliquer sur "Create Bucket"
   - Nom : `syntech-uploads`
   - Région : Automatic (recommandé)
   - Cliquer sur "Create Bucket"

4. **Créer un API Token**
   - Aller dans "Manage R2 API Tokens"
   - Cliquer sur "Create API Token"
   - Nom : `SynTech Backend`
   - Permissions : **Object Read & Write**
   - Copier l'Account ID, Access Key ID et Secret Access Key

5. **Copier dans .env**
   ```bash
   R2_ACCOUNT_ID=your_account_id_here
   R2_ACCESS_KEY_ID=your_access_key_id_here
   R2_SECRET_ACCESS_KEY=your_secret_access_key_here
   R2_BUCKET_NAME=syntech-uploads
   R2_PUBLIC_URL=https://syntech-uploads.your-account.r2.cloudflarestorage.com
   ```

---

## 🔐 Génération de la Clé de Chiffrement

Pour chiffrer les données en mode NDA, vous devez générer une clé de chiffrement sécurisée (32 bytes = 64 caractères hexadécimaux).

### Sur Linux/Mac
```bash
openssl rand -hex 32
```

### Sur Windows (PowerShell)
```powershell
-join ((48..57) + (65..70) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### Alternative Simple
Aller sur : https://www.random.org/strings/ et générer une string de 64 caractères hexadécimaux.

**Copier dans .env** :
```bash
ENCRYPTION_KEY=your_64_character_hex_key_here
```

---

## 🔐 Génération du JWT Secret

Pour signer les tokens JWT (authentification future), générez un secret fort.

### Sur Linux/Mac/Windows
```bash
openssl rand -base64 32
```

**Copier dans .env** :
```bash
JWT_SECRET=your_base64_secret_here
```

---

## ✅ Checklist Finale

Avant de passer à l'étape suivante, vérifiez que vous avez :

- [ ] ✅ Compte Neon créé + `DATABASE_URL` copiée
- [ ] ✅ Compte Upstash créé + `REDIS_URL` copiée
- [ ] ✅ Compte OpenAI créé + `OPENAI_API_KEY` copiée
- [ ] ✅ Crédits OpenAI ajoutés (10-20€)
- [ ] ✅ `ENCRYPTION_KEY` générée (64 caractères hex)
- [ ] ✅ `JWT_SECRET` générée
- [ ] ⬜ (Optionnel) Cloudflare R2 configuré

---

## 📝 Création du fichier .env

Une fois toutes les clés obtenues, créez le fichier `.env` dans `apps/backend/` :

```bash
cd apps/backend
cp .env.example .env
```

Puis éditez `.env` et remplacez toutes les valeurs par vos vraies clés.

**⚠️ IMPORTANT** :
- **NE JAMAIS** commit le fichier `.env` dans Git (déjà dans `.gitignore`)
- Gardez vos clés secrètes et ne les partagez jamais

---

## 🚀 Prochaine Étape

Une fois toutes les clés configurées dans `.env`, vous pourrez :
1. Générer les migrations de base de données
2. Exécuter les migrations
3. Tester la connexion à PostgreSQL et Redis
4. Lancer le serveur backend

**Retour au DEVLOG** : Session 1.2 (suite)

---

**Dernière mise à jour** : 2025-12-16
**Temps estimé total** : 15-20 minutes
**Budget** : 10-20€ (OpenAI uniquement)
