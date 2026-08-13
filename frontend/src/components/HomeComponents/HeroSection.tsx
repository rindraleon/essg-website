import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { SITE_HERO_ALT, SITE_HERO_IMAGE } from '../../constants/media';
import useGsapHero from '../../hooks/useGsapHero';
import AnimatedBackground from '../animations/AnimatedBackground';
import SplitTitle from '../animations/SplitTitle';
import type { HeroSectionProps } from '../../types';

const HeroSection = ({
  badge = 'Université de Fianarantsoa',
  title = 'École Supérieure de Sciences Géomatiques',
  description = "Formez-vous à la géomatique, à la topographie et à l'aménagement du territoire. Une école d'excellence, au service des territoires de Madagascar.",
  primaryButton = { text: 'Découvrir les formations', link: '/formations' },
  secondaryButton = { text: 'Candidater', link: '/admission' },
}: HeroSectionProps) => {
  const heroRef = useGsapHero<HTMLElement>();

  return (
    <section
      ref={heroRef}
      className="relative m-0 h-screen w-full overflow-hidden bg-brand-950 text-white"
    >
      <img
        data-hero="media"
        src={SITE_HERO_IMAGE}
        alt={SITE_HERO_ALT}
        className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-brand-950/35 via-brand-950/20 to-brand-950/78"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,33,30,0.15)_0%,rgba(15,33,30,0.45)_78%)]"
      />
      <div
        data-hero="shine"
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/18 to-transparent blur-2xl will-change-transform"
      />
      <AnimatedBackground variant="hero" />

      <div className="relative flex h-full w-full flex-col items-center justify-center px-4 py-28 text-center sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          {badge && (
            <div data-hero="badge" className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sage-300/50 bg-white/10 px-3.5 py-1 text-sm font-medium text-sage-100 shadow-[0_0_24px_rgba(152,192,112,0.18)] backdrop-blur-md">
                <Sparkles className="size-3.5 text-sage-300" />
                {badge}
              </span>
            </div>
          )}

          <SplitTitle
            data-hero="title"
            text={title}
            className="mb-4 text-4xl font-bold leading-tight drop-shadow-[0_2px_16px_rgba(15,33,30,0.45)] sm:text-5xl lg:text-6xl"
          />
          <div
            data-hero="accent"
            aria-hidden="true"
            className="mx-auto mb-6 h-1 w-24 origin-center rounded-full bg-sage-400 shadow-[0_0_18px_rgba(152,192,112,0.65)]"
          />

          {description && (
            <p
              data-hero="description"
              className="mx-auto mb-9 max-w-2xl text-lg leading-relaxed text-white/92 drop-shadow-md sm:text-xl"
            >
              {description}
            </p>
          )}

          {(primaryButton || secondaryButton) && (
            <div
              data-hero="actions"
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              {primaryButton && (
                <Link
                  to={primaryButton.link}
                  className={cn(buttonVariants({ variant: 'inverted', size: 'lg' }), 'shadow-lg shadow-brand-950/30')}
                >
                  {primaryButton.text}
                  <ArrowRight className="size-4" />
                </Link>
              )}
              {secondaryButton && (
                <Link
                  to={secondaryButton.link}
                  className={cn(buttonVariants({ variant: 'invertedOutline', size: 'lg' }))}
                >
                  {secondaryButton.text}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <a
        href="#contenu"
        data-hero="scroll"
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/80 transition-colors hover:text-white"
        aria-label="Défiler vers le contenu"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Découvrir</span>
        <ArrowDown className="size-4" />
      </a>
    </section>
  );
};

export default HeroSection;
