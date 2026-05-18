import type { Request, Response, NextFunction } from 'express';
import { FileService } from '../services/file.service.js';
import { RAGService } from '../services/rag.service.js';
import { SessionService } from '../services/session.service.js';
import { ConversationEngine } from '../services/conversation.engine.js';
import { AppError } from '../middleware/error.middleware.js';

const fileService = new FileService();
const ragService = new RAGService();
const sessionService = new SessionService();
const engine = new ConversationEngine();

// POST /api/v1/files/:sessionId/upload
export async function uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId } = req.params;

    // Vérifie que la session existe et est active
    const session = await sessionService.getById(sessionId);
    if (!session) throw new AppError(404, 'Session not found', 'SESSION_NOT_FOUND');
    if (session.status !== 'active') throw new AppError(409, 'Session is not active', 'SESSION_NOT_ACTIVE');

    if (!req.file) throw new AppError(400, 'No file provided', 'NO_FILE');

    // 1. Upload vers R2
    const uploaded = await fileService.upload(sessionId, req.file);

    // 2. Analyse IA du document
    const analysis = await ragService.analyze(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    // 3. Injecte l'analyse dans la conversation
    const analysisMessage = `J'ai analysé votre document "${uploaded.filename}".\n\n${analysis.analysis}`;
    await engine.analyzeDocument(sessionId, analysis.extractedText, uploaded.filename);

    res.status(201).json({
      file: uploaded,
      analysis: {
        wordCount: analysis.wordCount,
        summary: analysisMessage,
        gaps: analysis.gaps,
        questions: analysis.questions,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/files/:sessionId
export async function getSessionFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId } = req.params;
    const files = await fileService.getBySession(sessionId);
    res.json({ files, count: files.length });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/v1/files/:sessionId/:fileId
export async function deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { fileId } = req.params;
    await fileService.delete(fileId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
