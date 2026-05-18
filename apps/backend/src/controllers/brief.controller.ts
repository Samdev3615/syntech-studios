import type { Request, Response, NextFunction } from 'express';
import { BriefService } from '../services/brief.service.js';
import { PDFService } from '../services/pdf.service.js';
import { AppError } from '../middleware/error.middleware.js';

const briefService = new BriefService();
const pdfService = new PDFService();

// GET /api/v1/briefs/:sessionId — Récupérer le brief JSON
export async function getBrief(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId } = req.params;
    const brief = await briefService.getBySession(sessionId);

    if (!brief) {
      throw new AppError(404, 'No brief found for this session', 'BRIEF_NOT_FOUND');
    }

    res.json({ success: true, data: brief });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/briefs/:sessionId/pdf — Télécharger le brief en PDF
export async function downloadPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId } = req.params;
    const brief = await briefService.getBySession(sessionId);

    if (!brief) {
      throw new AppError(404, 'No brief found for this session', 'BRIEF_NOT_FOUND');
    }

    const pdfBuffer = await pdfService.generate(brief.data as Record<string, unknown>);

    const briefData = brief.data as { projectName?: string };
    const filename = `brief-${briefData.projectName?.toLowerCase().replace(/\s+/g, '-') ?? sessionId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}
