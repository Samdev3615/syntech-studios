import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { ClaudeService as OpenAIService } from './openai.service.js';
import { PromptLibrary } from './prompt.library.js';
import { logger } from '../middleware/logger.middleware.js';
import { AppError } from '../middleware/error.middleware.js';

export interface DocumentAnalysis {
  filename: string;
  extractedText: string;
  wordCount: number;
  analysis: string;
  gaps: string[];
  questions: string[];
}

export class RAGService {
  private openai = new OpenAIService();

  // ─── Extraction de texte depuis le buffer ─────────────────────────────────
  async extractText(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
    try {
      if (mimeType === 'application/pdf') {
        const data = await pdfParse(buffer);
        logger.info(`[RAG] PDF extracted: ${data.numpages} pages — ${filename}`);
        return data.text;
      }

      if (
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'application/msword'
      ) {
        const result = await mammoth.extractRawText({ buffer });
        logger.info(`[RAG] DOCX extracted — ${filename}`);
        return result.value;
      }

      throw new AppError(400, 'Unsupported file type for text extraction', 'UNSUPPORTED_TYPE');
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error(`[RAG] Extraction failed for ${filename}`, { error: String(err) });
      throw new AppError(500, 'Failed to extract text from document', 'EXTRACTION_ERROR');
    }
  }

  // ─── Analyse complète : extraction + IA ──────────────────────────────────
  async analyze(
    buffer: Buffer,
    mimeType: string,
    filename: string
  ): Promise<DocumentAnalysis> {
    // 1. Extraction texte
    const extractedText = await this.extractText(buffer, mimeType, filename);

    if (extractedText.trim().length < 50) {
      throw new AppError(400, 'Document is too short or empty', 'DOCUMENT_TOO_SHORT');
    }

    const wordCount = extractedText.split(/\s+/).length;

    // 2. Analyse IA (tronque à 8000 chars pour rester dans les limites de tokens)
    const truncatedText = extractedText.slice(0, 8000);

    const analysisRaw = await this.openai.complete(
      [
        { role: 'system', content: PromptLibrary.SYSTEM_DOCUMENT_ANALYSIS },
        {
          role: 'user',
          content: `Document "${filename}" :\n\n${truncatedText}`,
        },
      ],
      { temperature: 0.4, maxTokens: 1200 }
    );

    // 3. Extraction structurée des gaps et questions (second appel IA ciblé)
    const structuredRaw = await this.openai.complete(
      [
        {
          role: 'system',
          content: `À partir de cette analyse de document, extrait en JSON strict :
{
  "gaps": ["Zone floue ou manquante 1", "Zone floue 2"],
  "questions": ["Question prioritaire 1", "Question 2"]
}
Réponds UNIQUEMENT avec le JSON.`,
        },
        { role: 'user', content: analysisRaw },
      ],
      { temperature: 0.2, maxTokens: 400 }
    );

    let gaps: string[] = [];
    let questions: string[] = [];

    try {
      const parsed = JSON.parse(structuredRaw) as { gaps: string[]; questions: string[] };
      gaps = parsed.gaps ?? [];
      questions = parsed.questions ?? [];
    } catch {
      logger.warn('[RAG] Could not parse structured output, using raw analysis');
    }

    logger.info(`[RAG] Analysis complete — ${filename} (${wordCount} words)`);

    return {
      filename,
      extractedText,
      wordCount,
      analysis: analysisRaw,
      gaps,
      questions,
    };
  }
}
