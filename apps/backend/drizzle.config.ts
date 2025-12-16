import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

export default {
  schema: './src/database/schema/index.ts',
  out: './src/database/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
} satisfies Config
