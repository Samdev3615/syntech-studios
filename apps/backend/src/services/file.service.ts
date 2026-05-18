import { randomUUID } from 'crypto';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import multer, { type FileFilterCallback } from 'multer';
import type { Request, RequestHandler } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../database/client.js';
import { uploadedFiles } from '../database/schema/index.js';
import { env } from '../config/env.js';
import { logger } from '../middleware/logger.middleware.js';
import { AppError } from '../middleware/error.middleware.js';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UploadedFileData {
  id: string;
  sessionId: string;
  filename: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

// ─── Config Cloudflare R2 (S3-compatible) ─────────────────────────────────────
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: env.R2_SECRET_ACCESS_KEY ?? '',
  },
});

const BUCKET = env.R2_BUCKET_NAME ?? 'syntech-uploads';
const PUBLIC_URL = env.R2_PUBLIC_URL ?? '';

// ─── Multer (stockage mémoire — on upload vers R2 ensuite) ────────────────────
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const uploadMiddleware: RequestHandler = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, 'Only PDF and DOCX files are accepted', 'INVALID_FILE_TYPE'));
    }
  },
}).single('file');

// ─── FileService ──────────────────────────────────────────────────────────────
export class FileService {

  async upload(
    sessionId: string,
    file: Express.Multer.File
  ): Promise<UploadedFileData> {
    const fileId = randomUUID();
    const ext = file.originalname.split('.').pop() ?? 'bin';
    const key = `sessions/${sessionId}/${fileId}.${ext}`;

    // Upload vers R2
    const upload = new Upload({
      client: r2Client,
      params: {
        Bucket: BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });

    await upload.done();
    logger.info(`[File] Uploaded to R2: ${key}`);

    const fileUrl = PUBLIC_URL ? `${PUBLIC_URL}/${key}` : key;

    // Sauvegarde en DB
    const [row] = await db.insert(uploadedFiles).values({
      id: fileId,
      sessionId,
      filename: file.originalname,
      fileUrl,
      fileType: file.mimetype,
      fileSize: file.size,
    }).returning();

    return {
      id: row.id,
      sessionId: row.sessionId,
      filename: row.filename,
      fileUrl: row.fileUrl,
      fileType: row.fileType ?? file.mimetype,
      fileSize: row.fileSize ?? file.size,
      uploadedAt: row.uploadedAt.toISOString(),
    };
  }

  async getBySession(sessionId: string): Promise<UploadedFileData[]> {
    const rows = await db
      .select()
      .from(uploadedFiles)
      .where(eq(uploadedFiles.sessionId, sessionId));

    return rows.map((row) => ({
      id: row.id,
      sessionId: row.sessionId,
      filename: row.filename,
      fileUrl: row.fileUrl,
      fileType: row.fileType ?? '',
      fileSize: row.fileSize ?? 0,
      uploadedAt: row.uploadedAt.toISOString(),
    }));
  }

  async delete(fileId: string): Promise<void> {
    const [row] = await db
      .select()
      .from(uploadedFiles)
      .where(eq(uploadedFiles.id, fileId))
      .limit(1);

    if (!row) throw new AppError(404, 'File not found', 'FILE_NOT_FOUND');

    // Supprime de R2
    const key = row.fileUrl.replace(`${PUBLIC_URL}/`, '');
    await r2Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));

    // Supprime de DB
    await db.delete(uploadedFiles).where(eq(uploadedFiles.id, fileId));
    logger.info(`[File] Deleted: ${fileId}`);
  }
}
