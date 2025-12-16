import { pgTable, uuid, varchar, timestamp, text, jsonb, integer } from 'drizzle-orm/pg-core'

/**
 * Sessions Table
 * Stocke les sessions de conversation avec les différents modes de confidentialité
 */
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  privacyMode: varchar('privacy_mode', { length: 10 }).notNull(), // 'demo' | 'private' | 'nda'
  status: varchar('status', { length: 20 }).default('active'), // 'active' | 'completed' | 'archived'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
  metadata: jsonb('metadata'), // Données chiffrées en mode NDA
})

/**
 * Messages Table
 * Stocke les messages de conversation (utilisateur, assistant, system)
 */
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .references(() => sessions.id, { onDelete: 'cascade' })
    .notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'user' | 'assistant' | 'system'
  content: text('content').notNull(), // Chiffré en mode NDA
  timestamp: timestamp('timestamp').defaultNow().notNull(),
})

/**
 * NDAs Table
 * Stocke les accords de confidentialité signés électroniquement
 */
export const ndas = pgTable('ndas', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .references(() => sessions.id, { onDelete: 'cascade' })
    .notNull(),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  clientEmail: varchar('client_email', { length: 255 }).notNull(),
  companyName: varchar('company_name', { length: 255 }),
  documentUrl: text('document_url').notNull(), // URL R2/S3
  status: varchar('status', { length: 20 }).default('pending'), // 'pending' | 'accepted'
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
  acceptedAt: timestamp('accepted_at'),
  ipAddress: varchar('ip_address', { length: 45 }), // IPv6 support
  userAgent: text('user_agent'),
})

/**
 * Briefs Table
 * Stocke les briefs de projet générés
 */
export const briefs = pgTable('briefs', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .references(() => sessions.id, { onDelete: 'cascade' })
    .notNull(),
  data: jsonb('data').notNull(), // Structure JSON complète du brief
  status: varchar('status', { length: 20 }).default('draft'), // 'draft' | 'complete'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/**
 * Uploaded Files Table
 * Stocke les métadonnées des fichiers uploadés (PDF/DOCX)
 */
export const uploadedFiles = pgTable('uploaded_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .references(() => sessions.id, { onDelete: 'cascade' })
    .notNull(),
  filename: varchar('filename', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(), // URL R2
  fileType: varchar('file_type', { length: 50 }), // 'application/pdf', 'application/docx'
  fileSize: integer('file_size'), // En bytes
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
})

// Export des types TypeScript pour utilisation dans le code
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert

export type NDA = typeof ndas.$inferSelect
export type NewNDA = typeof ndas.$inferInsert

export type Brief = typeof briefs.$inferSelect
export type NewBrief = typeof briefs.$inferInsert

export type UploadedFile = typeof uploadedFiles.$inferSelect
export type NewUploadedFile = typeof uploadedFiles.$inferInsert
