import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '../config/env'

// Configuration de la connexion PostgreSQL
const connectionString = env.DATABASE_URL

// Créer le client PostgreSQL
const queryClient = postgres(connectionString, {
  max: 10, // Pool de connexions
  idle_timeout: 20,
  connect_timeout: 10,
})

// Créer l'instance Drizzle
export const db = drizzle(queryClient, { schema })

// Export du client pour fermer la connexion si nécessaire
export { queryClient }

// Types
export type Database = typeof db
