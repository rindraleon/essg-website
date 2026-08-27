import { ArrowRight, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import React from 'react';
import Button from '../compat/button';
import { Link as RouterLink } from 'react-router-dom';
import useGsapReveal from '@/hooks/useGsapReveal';
import { useAdmissionsOuvertes } from '@/hooks';
import type { AdmissionCtaSectionProps } from '@/types';

const AdmissionSection: React.FC<AdmissionCtaSectionProps> = (
  props: Readonly<AdmissionCtaSectionProps>
) => {
  const {
    title = "Prêt à rejoindre l'ESSG ?",
    description = "Prenez part à la nouvelle génération d'experts en sciences géomatiques et technologies spatiales.",
    primaryButtonLabel = 'Déposer ma candidature',
    primaryButtonLink = '/admission',
    secondaryButtonLabel = 'Nous contacter',
    secondaryButtonLink = '/contact',
  } = props;

  const revealRef = useGsapReveal<HTMLElement>();
  const admissionsOuvertes = useAdmissionsOuvertes();

  if (!admissionsOuvertes) return null;

  return (
    <section
      ref={revealRef}
      data-surface="dark"
      className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 py-24 text-white"
    >
      <div className="absolute inset-0 -z-10 opacity-15 [background-image:radial-gradient(circle_at_50%_50%,#98c070_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute -left-20 top-1/2 -z-10 size-96 -translate-y-1/2 rounded-full bg-sage-400/10 blur-3xl" />
      <div className="absolute -right-20 top-1/2 -z-10 size-96 -translate-y-1/2 rounded-full bg-brand-500/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-4xl rounded-3xl border border-white/15 bg-white/[0.04] p-8 text-center shadow-elevated backdrop-blur-xl sm:p-12">
          <div data-gsap className="mb-4 inline-flex items-center gap-2 rounded-full border border-sage-300/30 bg-sage-400/10 px-4 py-1.5 text-caption font-bold uppercase tracking-[0.14em] text-sage-200">
            <Sparkles className="size-3.5 text-sage-300" />
            Session d'admission 2026-2027
          </div>

          <div data-gsap className="group mb-4">
            <h2 className="font-display text-[clamp(2.1rem,4.4vw,3.4rem)] font-bold tracking-tight text-white">
              {title}
            </h2>
            <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-sage-400 to-brand-400 transition-all duration-500 group-hover:w-32" />
          </div>

          <p data-gsap className="mx-auto mb-8 max-w-2xl text-body-lg text-white/80">
            {description}
          </p>

          <div data-gsap className="mb-10 flex flex-wrap items-center justify-center gap-6 text-small text-white/85">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4.5 text-sage-400" />
              <span>Dossier 100% en ligne</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4.5 text-sage-400" />
              <span>Réponse rapide du jury</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4.5 text-sage-400" />
              <span>Accompagnement personnalisé</span>
            </div>
          </div>

          <div data-gsap className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              component={RouterLink}
              to={primaryButtonLink}
              variant="contained"
              size="large"
              endIcon={<ArrowRight className="size-4" />}
              className="bg-sage-400 text-brand-950 hover:bg-sage-300 font-bold shadow-lg"
            >
              {primaryButtonLabel}
            </Button>

            <Button
              component={RouterLink}
              to={secondaryButtonLink}
              variant="outlined"
              size="large"
              startIcon={<FileText className="size-4 text-sage-300" />}
              className="border-white/30 text-white hover:bg-white/10"
            >
              {secondaryButtonLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionSection;
