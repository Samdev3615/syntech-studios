/**
 * Page de démonstration du Design System — DEV ONLY
 * Accessible sur http://localhost:3000/design
 * Permet de valider visuellement tous les composants avant usage
 */

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  H1, H2, H3, H4, P, Lead, Muted, Code, Blockquote, GradientHeading,
} from '@/components/ui/typography'
import {
  Zap, Shield, Bot, FileText, Lock, Sparkles, ArrowRight, Download,
} from 'lucide-react'

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-16 max-w-5xl mx-auto">

      {/* Header */}
      <div className="space-y-2">
        <Badge variant="ocean">Design System v1.3</Badge>
        <GradientHeading>SynTech Studios — UI Kit</GradientHeading>
        <Lead>Validation visuelle de tous les composants du design system.</Lead>
        <Muted>Page de développement uniquement — ne pas exposer en production.</Muted>
      </div>

      <Separator />

      {/* TYPOGRAPHIE */}
      <section className="space-y-6">
        <H2>Typographie</H2>
        <div className="space-y-4 p-6 border border-border rounded-xl">
          <H1>Heading 1 — Bold 4xl</H1>
          <H2>Heading 2 — Semibold 3xl</H2>
          <H3>Heading 3 — Semibold 2xl</H3>
          <H4>Heading 4 — Semibold xl</H4>
          <P>Paragraphe standard. SynTech Studios crée des solutions digitales premium adaptées aux besoins de chaque client.</P>
          <Lead>Lead text — sous-titre accrocheur pour la landing page et les sections importantes.</Lead>
          <Muted>Texte discret — utilisé pour les métadonnées, dates, labels secondaires.</Muted>
          <div>
            <Code>const hello = &apos;world&apos;</Code>
            {' '}— code inline avec police Fira Code
          </div>
          <Blockquote>
            &ldquo;L&apos;excellence n&apos;est pas une compétence, c&apos;est une habitude.&rdquo; — SynTech Studios
          </Blockquote>
          <GradientHeading className="text-3xl">Gradient Heading — Palette Ocean Blue</GradientHeading>
        </div>
      </section>

      <Separator />

      {/* BOUTONS */}
      <section className="space-y-6">
        <H2>Boutons</H2>

        <div className="space-y-4">
          <H4>Variants</H4>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="gradient">
              <Sparkles className="mr-2 h-4 w-4" />
              Gradient (CTA)
            </Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div className="space-y-4">
          <H4>Sizes</H4>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl" variant="gradient">
              Lancer l&apos;assistant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="icon" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <H4>États</H4>
          <div className="flex flex-wrap gap-3">
            <Button disabled>Désactivé</Button>
            <Button variant="gradient" disabled>Gradient désactivé</Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* BADGES */}
      <section className="space-y-6">
        <H2>Badges</H2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="ocean">
            <Bot className="mr-1 h-3 w-3" />
            Mode IA
          </Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">✅ Complété</Badge>
          <Badge variant="warning">⚠️ En cours</Badge>
          <Badge variant="destructive">❌ Erreur</Badge>
        </div>

        <div className="flex gap-3">
          <Badge variant="ocean">
            <Lock className="mr-1 h-3 w-3" />
            Mode Privé
          </Badge>
          <Badge variant="ocean">
            <Shield className="mr-1 h-3 w-3" />
            NDA Signé
          </Badge>
          <Badge variant="ocean">
            <Zap className="mr-1 h-3 w-3" />
            Mode Demo
          </Badge>
        </div>
      </section>

      <Separator />

      {/* INPUTS */}
      <section className="space-y-6">
        <H2>Formulaires</H2>
        <div className="grid gap-4 max-w-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nom du projet</label>
            <Input placeholder="Ex : Application mobile e-commerce" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input type="email" placeholder="contact@syntechstudios.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description du projet</label>
            <Textarea
              placeholder="Décrivez votre projet, vos objectifs, votre cible..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Champ désactivé</label>
            <Input value="Valeur non modifiable" disabled />
          </div>
        </div>
      </section>

      <Separator />

      {/* CARDS */}
      <section className="space-y-6">
        <H2>Cards</H2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Card className="glow-ocean-hover">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-ocean/10 flex items-center justify-center mb-2">
                <Bot className="h-5 w-5 text-ocean" />
              </div>
              <CardTitle>Interview Guidée</CardTitle>
              <CardDescription>L&apos;IA pose les bonnes questions pour cadrer votre projet</CardDescription>
            </CardHeader>
            <CardContent>
              <P className="text-sm text-muted-foreground">
                Mode A : conversation guidée étape par étape.
              </P>
            </CardContent>
            <CardFooter>
              <Badge variant="ocean">IA Conversationnelle</Badge>
            </CardFooter>
          </Card>

          <Card className="glow-ocean-hover border-ocean/20">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-ocean/10 flex items-center justify-center mb-2">
                <FileText className="h-5 w-5 text-ocean" />
              </div>
              <CardTitle>Analyse de Documents</CardTitle>
              <CardDescription>Upload PDF/DOCX — l&apos;IA identifie les gaps</CardDescription>
            </CardHeader>
            <CardContent>
              <P className="text-sm text-muted-foreground">
                Mode B : analysez vos documents existants.
              </P>
            </CardContent>
            <CardFooter>
              <Badge variant="success">PDF & DOCX</Badge>
            </CardFooter>
          </Card>

          <Card className="glow-ocean-hover">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-ocean/10 flex items-center justify-center mb-2">
                <Shield className="h-5 w-5 text-ocean" />
              </div>
              <CardTitle>3 Modes Privacy</CardTitle>
              <CardDescription>Demo, Privé (Redis TTL 2h), ou NDA signé</CardDescription>
            </CardHeader>
            <CardContent>
              <P className="text-sm text-muted-foreground">
                Choisissez votre niveau de confidentialité.
              </P>
            </CardContent>
            <CardFooter>
              <Badge variant="warning">Configurable</Badge>
            </CardFooter>
          </Card>

        </div>
      </section>

      <Separator />

      {/* COULEURS */}
      <section className="space-y-6">
        <H2>Palette Ocean Blue</H2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Background', color: 'bg-background', hex: '#0a0a0f', border: true },
            { name: 'Secondary', color: 'bg-secondary', hex: 'HSL muted dark', border: false },
            { name: 'Ocean Light', color: 'bg-ocean-light', hex: '#7dd3fc', border: false },
            { name: 'Ocean', color: 'bg-ocean', hex: '#0ea5e9', border: false },
            { name: 'Ocean Dark', color: 'bg-ocean-dark', hex: '#0369a1', border: false },
            { name: 'Marine Light', color: 'bg-marine-light', hex: '#1e3a8a', border: false },
            { name: 'Marine', color: 'bg-marine', hex: '#1e40af', border: false },
            { name: 'Marine Dark', color: 'bg-marine-dark', hex: '#172554', border: false },
          ].map((item) => (
            <div key={item.name} className="space-y-2">
              <div
                className={`h-16 rounded-lg ${item.color} ${item.border ? 'border border-border' : ''}`}
              />
              <div>
                <P className="text-xs font-medium">{item.name}</P>
                <Muted className="text-xs">{item.hex}</Muted>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Separator />
      <div className="text-center pb-8">
        <Muted>SynTech Studios Design System — Session 1.3</Muted>
        <Code className="text-xs mt-2 block">apps/web/src/components/ui/</Code>
      </div>

    </div>
  )
}
