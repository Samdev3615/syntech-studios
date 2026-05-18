import { Router, type Router as ExpressRouter } from 'express';
import { uploadMiddleware } from '../services/file.service.js';
import { uploadFile, getSessionFiles, deleteFile } from '../controllers/file.controller.js';

export const fileRouter: ExpressRouter = Router();

// POST /api/v1/files/:sessionId/upload  — upload + analyse IA
fileRouter.post('/:sessionId/upload', uploadMiddleware, uploadFile);

// GET  /api/v1/files/:sessionId         — liste les fichiers d'une session
fileRouter.get('/:sessionId', getSessionFiles);

// DELETE /api/v1/files/:sessionId/:fileId — supprime un fichier
fileRouter.delete('/:sessionId/:fileId', deleteFile);
