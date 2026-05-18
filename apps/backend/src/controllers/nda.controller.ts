import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { NDAService } from '../services/nda.service.js';
import { PDFService } from '../services/pdf.service.js';
import { AppError } from '../middleware/error.middleware.js';

const ndaService = new NDAService();
const pdfService = new PDFService();

const createNDASchema = z.object({
  sessionId: z.string().uuid(),
  clientName: z.string().min(2).max(255),
  clientEmail: z.string().email(),
  companyName: z.string().max(255).optional(),
});

// POST /api/v1/nda — Créer un NDA pour une session
export async function createNDA(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createNDASchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, 'Invalid NDA data', 'VALIDATION_ERROR');
    }

    const { id } = await ndaService.create(parsed.data);

    res.status(201).json({
      success: true,
      data: {
        ndaId: id,
        pdfUrl: `/api/v1/nda/${id}/pdf`,
        acceptUrl: `/api/v1/nda/${id}/accept`,
        message: 'NDA created. Please review the document and accept to continue.',
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/nda/:ndaId/pdf — Visualiser le PDF du NDA
export async function getNDAPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ndaId } = req.params;
    const nda = await ndaService.getById(ndaId);

    if (!nda) throw new AppError(404, 'NDA not found', 'NDA_NOT_FOUND');

    const pdfBuffer = await pdfService.generateNDA({
      clientName:  nda.clientName,
      clientEmail: nda.clientEmail,
      companyName: nda.companyName,
      sessionId:   nda.sessionId,
      generatedAt: nda.generatedAt,
      acceptedAt:  nda.acceptedAt,
      ipAddress:   nda.ipAddress,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="nda-syntech-${nda.clientName.toLowerCase().replace(/\s+/g, '-')}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/nda/:ndaId/accept — Accepter le NDA (signature électronique)
export async function acceptNDA(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ndaId } = req.params;

    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.socket.remoteAddress ??
      'unknown';
    const userAgent = req.headers['user-agent'] ?? 'unknown';

    await ndaService.accept(ndaId, ipAddress, userAgent);

    res.json({
      success: true,
      data: {
        ndaId,
        accepted: true,
        acceptedAt: new Date().toISOString(),
        message: 'NDA accepted. You can now start the confidential session.',
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/nda/session/:sessionId — Statut du NDA d'une session
export async function getNDAStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId } = req.params;
    const nda = await ndaService.getBySession(sessionId);

    res.json({
      success: true,
      data: nda
        ? { ndaId: nda.id, status: nda.status, acceptedAt: nda.acceptedAt }
        : { ndaId: null, status: 'none' },
    });
  } catch (err) {
    next(err);
  }
}
