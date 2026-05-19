import { z } from 'zod'
import * as dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

/**
 * Schéma de validation des variables d'environnement
 * Utilise Zod pour s'assurer que toutes les variables nécessaires sont définies
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Server Configuration
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('3001'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  // Database (PostgreSQL)
  DATABASE_URL: z.string().url().startsWith('postgresql://'),

  // Redis (Upstash REST API)
  UPSTASH_REDIS_REST_URL: z.string().url().startsWith('https://'),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // Anthropic Claude
  ANTHROPIC_API_KEY: z.string().min(1),
  ANTHROPIC_MODEL: z.string().default('claude-opus-4-7'),

  // Cloudflare R2 (optionnel pour le moment)
  R2_ACCOUNT_ID: z.string().optional().or(z.literal('')),
  R2_ACCESS_KEY_ID: z.string().optional().or(z.literal('')),
  R2_SECRET_ACCESS_KEY: z.string().optional().or(z.literal('')),
  R2_BUCKET_NAME: z.string().optional().or(z.literal('')),
  R2_PUBLIC_URL: z.string().url().optional().or(z.literal('')),

  // Encryption & Security
  ENCRYPTION_KEY: z.string().length(64, 'ENCRYPTION_KEY must be 32 bytes (64 hex chars)'),
  JWT_SECRET: z.string().min(32),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().positive()).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().positive()).default('50'),

  // CORS
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:5173'),

  // Monitoring (optionnel)
  SENTRY_DSN: z.string().url().optional().or(z.literal('')),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
})

/**
 * Valide et parse les variables d'environnement
 * Lance une erreur si une variable requise est manquante ou invalide
 */
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`)
      throw new Error(
        `❌ Invalid environment variables:\n${missingVars.join('\n')}\n\n` +
          `Please check your .env file and ensure all required variables are set.\n` +
          `See .env.example for reference.`
      )
    }
    throw error
  }
}

// Valider au chargement du module
export const env = validateEnv()

// Helper pour vérifier si on est en production
export const isProduction = env.NODE_ENV === 'production'
export const isDevelopment = env.NODE_ENV === 'development'
export const isTest = env.NODE_ENV === 'test'

// Export du type pour utilisation dans le code
export type Env = z.infer<typeof envSchema>
