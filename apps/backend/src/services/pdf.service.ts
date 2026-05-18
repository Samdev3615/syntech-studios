import PDFDocument from 'pdfkit';
import type { BriefData } from './brief.service.js';

export interface NDADocumentData {
  clientName: string;
  clientEmail: string;
  companyName?: string | null;
  sessionId: string;
  generatedAt: Date;
  acceptedAt?: Date | null;
  ipAddress?: string | null;
}

// ─── Couleurs SynTech ──────────────────────────────────────────────────────────
const COLORS = {
  oceanBlue:  '#0ea5e9',
  darkBg:     '#0a0a1a',
  textMain:   '#1e293b',
  textMuted:  '#64748b',
  textLight:  '#94a3b8',
  separator:  '#e2e8f0',
  high:       '#ef4444',
  medium:     '#f59e0b',
  low:        '#22c55e',
  warning:    '#f59e0b',
} as const;

const MARGIN = 50;

export class PDFService {

  generate(briefData: Record<string, unknown>): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: MARGIN, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const brief = briefData as BriefData;

      this.renderHeader(doc, brief);
      this.renderSummary(doc, brief);
      this.renderTargetAudience(doc, brief);
      this.renderObjectives(doc, brief);
      this.renderMVPFeatures(doc, brief);
      this.renderV2Features(doc, brief);
      this.renderTechStack(doc, brief);
      this.renderConstraints(doc, brief);
      this.renderSuccessCriteria(doc, brief);
      this.renderOpenQuestions(doc, brief);
      this.renderFooter(doc);

      doc.end();
    });
  }

  // ─── Header ───────────────────────────────────────────────────────────────
  private renderHeader(doc: PDFKit.PDFDocument, brief: BriefData): void {
    // Bande sombre en haut
    doc.rect(0, 0, doc.page.width, 90).fill(COLORS.darkBg);

    doc.font('Helvetica-Bold').fontSize(22).fillColor('#ffffff')
       .text('SynTech Studios', MARGIN, 20);
    doc.font('Helvetica').fontSize(11).fillColor(COLORS.textLight)
       .text('Cahier des charges — Généré par IA', MARGIN, 48);

    const dateStr = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    doc.fontSize(9).fillColor(COLORS.textMuted).text(dateStr, MARGIN, 68);

    // Titre du projet
    doc.moveDown(2.5);
    doc.font('Helvetica-Bold').fontSize(20).fillColor(COLORS.oceanBlue)
       .text(brief.projectName ?? 'Projet sans nom');

    // Score de complétude
    if (brief.confidenceScore !== undefined) {
      const score = Math.round(brief.confidenceScore * 100);
      doc.font('Helvetica').fontSize(10).fillColor(COLORS.textMuted)
         .text(`Score de complétude : ${score}%`);
    }

    // Séparateur
    doc.moveDown(0.5);
    doc.moveTo(MARGIN, doc.y)
       .lineTo(doc.page.width - MARGIN, doc.y)
       .strokeColor(COLORS.separator).lineWidth(1).stroke();
    doc.moveDown();
  }

  // ─── Résumé ───────────────────────────────────────────────────────────────
  private renderSummary(doc: PDFKit.PDFDocument, brief: BriefData): void {
    if (!brief.summary) return;
    this.sectionTitle(doc, 'Résumé du projet');
    doc.font('Helvetica').fontSize(11).fillColor(COLORS.textMain)
       .text(brief.summary, { align: 'justify' });
    doc.moveDown();
  }

  // ─── Cible utilisateurs ───────────────────────────────────────────────────
  private renderTargetAudience(doc: PDFKit.PDFDocument, brief: BriefData): void {
    if (!brief.targetAudience) return;
    this.sectionTitle(doc, 'Cible utilisateurs');
    const { description, estimatedUsers } = brief.targetAudience;
    if (description) {
      doc.font('Helvetica').fontSize(11).fillColor(COLORS.textMain).text(description);
    }
    if (estimatedUsers) {
      doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.textMuted)
         .text(`Utilisateurs estimés : ${estimatedUsers}`);
    }
    doc.moveDown();
  }

  // ─── Objectifs ────────────────────────────────────────────────────────────
  private renderObjectives(doc: PDFKit.PDFDocument, brief: BriefData): void {
    if (!brief.objectives?.length) return;
    this.sectionTitle(doc, 'Objectifs');
    for (const obj of brief.objectives) {
      doc.font('Helvetica').fontSize(11).fillColor(COLORS.textMain)
         .text(`• ${obj}`, { indent: 12 });
    }
    doc.moveDown();
  }

  // ─── Fonctionnalités MVP ──────────────────────────────────────────────────
  private renderMVPFeatures(doc: PDFKit.PDFDocument, brief: BriefData): void {
    if (!brief.mvpFeatures?.length) return;
    this.sectionTitle(doc, 'Fonctionnalités MVP');

    for (const feature of brief.mvpFeatures) {
      const priorityColor = feature.priority === 'high'
        ? COLORS.high : feature.priority === 'low'
        ? COLORS.low : COLORS.medium;

      // Nom + badge priorité
      doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.textMain)
         .text(`${feature.name ?? ''}  `, { continued: true });
      doc.font('Helvetica').fontSize(9).fillColor(priorityColor)
         .text(`[${(feature.priority ?? 'medium').toUpperCase()}]`);

      if (feature.description) {
        doc.font('Helvetica').fontSize(10).fillColor(COLORS.textMuted)
           .text(feature.description, { indent: 12 });
      }
      doc.moveDown(0.4);
    }
    doc.moveDown(0.5);
  }

  // ─── Évolutions V2 ────────────────────────────────────────────────────────
  private renderV2Features(doc: PDFKit.PDFDocument, brief: BriefData): void {
    if (!brief.v2Features?.length) return;
    this.sectionTitle(doc, 'Évolutions futures (V2)');
    for (const f of brief.v2Features) {
      doc.font('Helvetica').fontSize(10).fillColor(COLORS.textMuted)
         .text(`• ${f}`, { indent: 12 });
    }
    doc.moveDown();
  }

  // ─── Stack technique ──────────────────────────────────────────────────────
  private renderTechStack(doc: PDFKit.PDFDocument, brief: BriefData): void {
    if (!brief.technicalStack) return;
    const stack = brief.technicalStack;
    const items: [string, string | undefined][] = [
      ['Frontend',      stack.frontend],
      ['Backend',       stack.backend],
      ['Base de données', stack.database],
      ['Hébergement',   stack.hosting],
    ];
    const valid = items.filter(([, v]) => v && v !== 'null' && v !== 'undefined');
    if (!valid.length) return;

    this.sectionTitle(doc, 'Stack technique');
    for (const [key, value] of valid) {
      doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.textMain)
         .text(`${key} : `, { continued: true });
      doc.font('Helvetica').fillColor(COLORS.textMuted).text(value as string);
    }
    doc.moveDown();
  }

  // ─── Contraintes ──────────────────────────────────────────────────────────
  private renderConstraints(doc: PDFKit.PDFDocument, brief: BriefData): void {
    if (!brief.constraints) return;
    const { budget, deadline, technical } = brief.constraints;
    const hasContent = (budget && budget !== 'null') || (deadline && deadline !== 'null') || technical?.length;
    if (!hasContent) return;

    this.sectionTitle(doc, 'Contraintes');

    if (budget && budget !== 'null') {
      doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.textMain)
         .text('Budget : ', { continued: true });
      doc.font('Helvetica').fillColor(COLORS.textMuted).text(budget);
    }
    if (deadline && deadline !== 'null') {
      doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.textMain)
         .text('Délai : ', { continued: true });
      doc.font('Helvetica').fillColor(COLORS.textMuted).text(deadline);
    }
    if (technical?.length) {
      doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.textMain)
         .text('Contraintes techniques :');
      for (const t of technical) {
        doc.font('Helvetica').fontSize(10).fillColor(COLORS.textMuted)
           .text(`• ${t}`, { indent: 12 });
      }
    }
    doc.moveDown();
  }

  // ─── Critères de succès ───────────────────────────────────────────────────
  private renderSuccessCriteria(doc: PDFKit.PDFDocument, brief: BriefData): void {
    if (!brief.successCriteria?.length) return;
    this.sectionTitle(doc, 'Critères de succès');
    for (const c of brief.successCriteria) {
      doc.font('Helvetica').fontSize(11).fillColor(COLORS.textMain)
         .text(`✓  ${c}`, { indent: 12 });
    }
    doc.moveDown();
  }

  // ─── Questions ouvertes ───────────────────────────────────────────────────
  private renderOpenQuestions(doc: PDFKit.PDFDocument, brief: BriefData): void {
    if (!brief.openQuestions?.length) return;
    this.sectionTitle(doc, 'Questions ouvertes');
    for (const q of brief.openQuestions) {
      doc.font('Helvetica').fontSize(10).fillColor(COLORS.warning)
         .text(`?  ${q}`, { indent: 12 });
    }
    doc.moveDown();
  }

  // ─── Footer ───────────────────────────────────────────────────────────────
  private renderFooter(doc: PDFKit.PDFDocument): void {
    const footerY = doc.page.height - 55;
    doc.moveTo(MARGIN, footerY)
       .lineTo(doc.page.width - MARGIN, footerY)
       .strokeColor(COLORS.separator).lineWidth(1).stroke();

    doc.font('Helvetica').fontSize(9).fillColor(COLORS.textMuted)
       .text(
         'Document généré automatiquement par SynTech Studios AI Assistant — Confidentiel',
         MARGIN, footerY + 12, { align: 'center', width: doc.page.width - MARGIN * 2 }
       );
  }

  // ─── NDA Document ─────────────────────────────────────────────────────────
  generateNDA(data: NDADocumentData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: MARGIN, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const dateStr = data.generatedAt.toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
      const client = data.companyName
        ? `${data.clientName} (${data.companyName})`
        : data.clientName;

      // ── Header ─────────────────────────────────────────────────────────────
      doc.rect(0, 0, doc.page.width, 90).fill(COLORS.darkBg);
      doc.font('Helvetica-Bold').fontSize(20).fillColor('#ffffff')
         .text('SynTech Studios', MARGIN, 20);
      doc.font('Helvetica').fontSize(11).fillColor(COLORS.textLight)
         .text('Accord de Non-Divulgation (NDA)', MARGIN, 48);
      doc.fontSize(9).fillColor(COLORS.textMuted)
         .text(`Généré le ${dateStr}`, MARGIN, 68);

      doc.moveDown(2.5);

      // ── Titre principal ────────────────────────────────────────────────────
      doc.font('Helvetica-Bold').fontSize(17).fillColor(COLORS.oceanBlue)
         .text('ACCORD DE CONFIDENTIALITÉ', { align: 'center' });
      doc.font('Helvetica').fontSize(10).fillColor(COLORS.textMuted)
         .text('Non-Disclosure Agreement (NDA)', { align: 'center' });
      doc.moveDown();

      doc.moveTo(MARGIN, doc.y).lineTo(doc.page.width - MARGIN, doc.y)
         .strokeColor(COLORS.separator).lineWidth(1).stroke();
      doc.moveDown();

      // ── Parties ────────────────────────────────────────────────────────────
      this.ndaSection(doc, 'ARTICLE 1 — PARTIES');
      doc.font('Helvetica').fontSize(11).fillColor(COLORS.textMain)
         .text('Le présent accord est conclu entre :');
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.textMain)
         .text('SynTech Studios', { continued: true });
      doc.font('Helvetica').fillColor(COLORS.textMuted)
         .text(', société de développement web et digital (ci-après « SynTech »)');
      doc.moveDown(0.3);
      doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.textMain)
         .text(`${client}`, { continued: true });
      doc.font('Helvetica').fillColor(COLORS.textMuted)
         .text(` — ${data.clientEmail} (ci-après « le Client »)`);
      doc.moveDown();

      // ── Objet ──────────────────────────────────────────────────────────────
      this.ndaSection(doc, 'ARTICLE 2 — OBJET');
      doc.font('Helvetica').fontSize(11).fillColor(COLORS.textMain).text(
        'Le présent accord a pour objet de définir les conditions dans lesquelles le Client ' +
        'communique à SynTech Studios des informations relatives à son projet digital, ' +
        'dans le cadre d\'une session de cadrage assistée par intelligence artificielle.',
        { align: 'justify' }
      );
      doc.moveDown();

      // ── Informations confidentielles ───────────────────────────────────────
      this.ndaSection(doc, 'ARTICLE 3 — INFORMATIONS CONFIDENTIELLES');
      doc.font('Helvetica').fontSize(11).fillColor(COLORS.textMain).text(
        'Sont considérées comme confidentielles toutes les informations divulguées par le Client, ' +
        'notamment : la description du projet, les objectifs commerciaux, les données techniques, ' +
        'les budgets, les délais, et toute information identifiée comme sensible par le Client.',
        { align: 'justify' }
      );
      doc.moveDown();

      // ── Obligations ────────────────────────────────────────────────────────
      this.ndaSection(doc, 'ARTICLE 4 — OBLIGATIONS DE SYNTECH STUDIOS');
      const obligations = [
        'Ne pas divulguer les informations confidentielles à des tiers sans autorisation écrite préalable du Client.',
        'Utiliser les informations uniquement dans le cadre de l\'analyse et du cadrage du projet.',
        'Protéger les données par des mesures de sécurité techniques appropriées (chiffrement, accès restreint).',
        'Supprimer les données sur demande du Client ou à l\'expiration de la session.',
      ];
      for (const ob of obligations) {
        doc.font('Helvetica').fontSize(11).fillColor(COLORS.textMain)
           .text(`•  ${ob}`, { indent: 12, align: 'justify' });
        doc.moveDown(0.3);
      }
      doc.moveDown(0.5);

      // ── Durée ──────────────────────────────────────────────────────────────
      this.ndaSection(doc, 'ARTICLE 5 — DURÉE');
      doc.font('Helvetica').fontSize(11).fillColor(COLORS.textMain).text(
        'Le présent accord entre en vigueur à la date d\'acceptation électronique et demeure ' +
        'valable pour une durée de 3 (trois) ans à compter de cette date.',
        { align: 'justify' }
      );
      doc.moveDown();

      // ── Loi applicable ─────────────────────────────────────────────────────
      this.ndaSection(doc, 'ARTICLE 6 — LOI APPLICABLE');
      doc.font('Helvetica').fontSize(11).fillColor(COLORS.textMain).text(
        'Le présent accord est régi par le droit français. Tout litige sera soumis à la ' +
        'juridiction compétente du ressort du siège social de SynTech Studios.',
        { align: 'justify' }
      );
      doc.moveDown();

      // ── Signature électronique ─────────────────────────────────────────────
      this.ndaSection(doc, 'ARTICLE 7 — SIGNATURE ÉLECTRONIQUE');
      doc.font('Helvetica').fontSize(11).fillColor(COLORS.textMain).text(
        'En acceptant cet accord via l\'interface numérique, le Client reconnaît avoir lu, ' +
        'compris et accepté l\'intégralité des termes du présent accord. ' +
        'Cette acceptation électronique a la même valeur juridique qu\'une signature manuscrite ' +
        'conformément à la loi n°2000-230 du 13 mars 2000.',
        { align: 'justify' }
      );
      doc.moveDown();

      // ── Bloc de signature ──────────────────────────────────────────────────
      doc.moveDown();
      doc.rect(MARGIN, doc.y, doc.page.width - MARGIN * 2, data.acceptedAt ? 90 : 70)
         .strokeColor(COLORS.separator).lineWidth(1).stroke();

      const boxY = doc.y + 10;
      doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.textMain)
         .text('Signature électronique du Client', MARGIN + 10, boxY);
      doc.font('Helvetica').fontSize(10).fillColor(COLORS.textMuted)
         .text(`Nom : ${data.clientName}`, MARGIN + 10, boxY + 18);
      doc.text(`Email : ${data.clientEmail}`, MARGIN + 10, boxY + 32);

      if (data.acceptedAt) {
        const signedDate = data.acceptedAt.toLocaleString('fr-FR');
        doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.low)
           .text(`✓  Signé le ${signedDate}`, MARGIN + 10, boxY + 50);
        if (data.ipAddress) {
          doc.font('Helvetica').fontSize(9).fillColor(COLORS.textMuted)
             .text(`IP : ${data.ipAddress}`, MARGIN + 10, boxY + 65);
        }
      } else {
        doc.font('Helvetica').fontSize(10).fillColor(COLORS.warning)
           .text('En attente d\'acceptation', MARGIN + 10, boxY + 50);
      }

      // ── Footer ─────────────────────────────────────────────────────────────
      this.renderFooter(doc);
      doc.end();
    });
  }

  // ─── Titre de section NDA ─────────────────────────────────────────────────
  private ndaSection(doc: PDFKit.PDFDocument, title: string): void {
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.oceanBlue).text(title);
    doc.moveDown(0.4);
  }

  // ─── Titre de section ─────────────────────────────────────────────────────
  private sectionTitle(doc: PDFKit.PDFDocument, title: string): void {
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(13).fillColor(COLORS.oceanBlue).text(title);
    doc.moveTo(MARGIN, doc.y)
       .lineTo(MARGIN + 80, doc.y)
       .strokeColor(COLORS.oceanBlue).lineWidth(1.5).stroke();
    doc.moveDown(0.6);
  }
}
