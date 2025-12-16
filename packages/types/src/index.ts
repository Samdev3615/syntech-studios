import { z } from 'zod';

// ==================== USER TYPES ====================

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// ==================== PROJECT TYPES ====================

export const ProjectStatusSchema = z.enum([
  'draft',
  'in_progress',
  'completed',
  'archived',
]);

export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

export const ConfidentialityModeSchema = z.enum([
  'public',
  'private',
  'anonymous',
]);

export type ConfidentialityMode = z.infer<typeof ConfidentialityModeSchema>;

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: ProjectStatusSchema,
  confidentialityMode: ConfidentialityModeSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Project = z.infer<typeof ProjectSchema>;

// ==================== MESSAGE TYPES ====================

export const MessageRoleSchema = z.enum(['user', 'assistant', 'system']);

export type MessageRole = z.infer<typeof MessageRoleSchema>;

export const MessageSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  role: MessageRoleSchema,
  content: z.string(),
  createdAt: z.date(),
});

export type Message = z.infer<typeof MessageSchema>;

// ==================== API TYPES ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== WIDGET CONFIG ====================

export interface WidgetConfig {
  apiUrl: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left';
  language?: 'fr' | 'en';
}
