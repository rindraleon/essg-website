import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Sparkles } from 'lucide-react';


import Reveal from '../common/Reveal';
import useTyped from '@/hooks/useTyped';
import { SITE_HERO_ALT, SITE_HERO_IMAGE, TYPEWRITER_WORDS } from '@/constants';
import type { HeroSectionProps } from '@/types';

import ParticlesBackground from '../animations/ParticlesBackground';

const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'École Supérieure des Sciences Géomatiques',
  primaryButton = { text: 'Explorer les formations', link: '/formations' },
  secondaryButton = { text: 'Déposer ma candidature', link: '/admission' },
}) => {
  const { text, showCursor } = useTyped(TYPEWRITER_WORDS, {
    typeSpeed: 75,
    deleteSpeed: 35,
    pauseDuration: 1900,
  });

  return (
    <section
      data-surface="dark"
      className="relative isolate flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-brand-950 py-16 text-white sm:py-28"
    >
      <img
        src={SITE_HERO_IMAGE}
        alt={SITE_HERO_ALT}
        className="hero-home-image absolute inset-0 -z-40 size-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      {/* Dynamic Animated Particles & Constellation Background */}
      <ParticlesBackground particleCount={85} />

      {/* Subtle geospatial grid mask */}
      <div className="hero-home-grid pointer-events-none absolute inset-0 -z-10 opacity-20" />

      {/* Hero Content Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        
        {/* Institutional Pill Badge */}
        <Reveal animation="fade-down" duration={700} delay={80}>
          <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-caption font-semibold backdrop-blur-md shadow-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-sage-300 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-sage-300" />
            </span>
            <span className="font-tech text-[0.72rem] tracking-wider text-sage-200">
              Université de Fianarantsoa · Madagascar
            </span>
          </div>
        </Reveal>

        {/* Main School Title */}
        <Reveal animation="fade-down" duration={800} delay={180}>
          <h1 className="font-display text-[clamp(2.3rem,5.2vw,4.5rem)] font-bold leading-[1.04] tracking-[-0.04em] text-white">
            {title}
          </h1>
        </Reveal>

        {/* Dynamic Typewriter Slogan */}
        <Reveal animation="fade-right" duration={700} delay={320} className="w-full">
          <h2 className="mt-6 flex flex-wrap items-center justify-center gap-x-2 text-[clamp(1.2rem,2.8vw,2rem)] font-bold tracking-tight text-white">
            <span className="text-white/90">Formez les experts de demain en</span>
            <span className="bg-gradient-to-r from-sage-300 via-sage-200 to-brand-300 bg-clip-text text-transparent">
              {text}
            </span>
            <span
              aria-hidden="true"
              className={`font-tech font-bold text-sage-300 transition-opacity duration-150 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            >
              |
            </span>
          </h2>
        </Reveal>

        {/* CTA Buttons */}
        <Reveal animation="fade-up" duration={600} delay={800} className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to={primaryButton.link}
            className="group relative inline-flex h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-sage-400 px-8 text-small font-bold text-brand-950 shadow-[0_14px_35px_-16px_rgba(152,192,112,.85)] transition-all duration-(--duration-hover) hover:-translate-y-1 hover:bg-sage-300 hover:shadow-[0_20px_45px_-14px_rgba(152,192,112,.95)] motion-reduce:transform-none"
          >
            <GraduationCap className="size-4.5" />
            <span>{primaryButton.text}</span>
            <ArrowRight className="size-4 transition-transform duration-(--duration-quick) group-hover:translate-x-1 motion-reduce:transform-none" />
          </Link>

          <Link
            to={secondaryButton.link}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-8 text-small font-semibold text-white backdrop-blur-md transition-all duration-(--duration-hover) hover:-translate-y-1 hover:border-white/40 hover:bg-white/[0.16] motion-reduce:transform-none"
          >
            <Sparkles className="size-4 text-sage-300" />
            <span>{secondaryButton.text}</span>
          </Link>
        </Reveal>

      </div>
    </section>
  );
};

export default HeroSection;
