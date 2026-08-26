import { ArrowDown, ArrowRight, Crosshair, Database, MapPin, Satellite } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useRef } from 'react';
import { SITE_HERO_ALT, SITE_HERO_IMAGE } from '@/constants';
import type { HeroSectionProps } from '@/types';

const SIGNALS = [
  { icon: Satellite, value: 'SIG', label: 'Données spatiales' },
  { icon: Crosshair, value: 'GNSS', label: 'Mesure de précision' },
  { icon: Database, value: 'GEO', label: 'Décision territoriale' },
] as const;

const HeroSection: React.FC<HeroSectionProps> = ({
  //badge = 'Université de Fianarantsoa · Madagascar',
  title = 'École Supérieure de Sciences Géomatiques',
  description = 'Apprenez à observer, mesurer et transformer les territoires grâce aux sciences géomatiques et aux technologies spatiales.',
  primaryButton = { text: 'Explorer les formations', link: '/formations' },
  secondaryButton = { text: "Découvrir l'ESSG", link: '/about' },
}) => {
  const visualRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const visual = visualRef.current;
    if (!visual || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = visual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    visual.style.setProperty('--hero-tilt-x', `${y * -4}deg`);
    visual.style.setProperty('--hero-tilt-y', `${x * 5}deg`);
  };

  const resetTilt = () => {
    visualRef.current?.style.setProperty('--hero-tilt-x', '0deg');
    visualRef.current?.style.setProperty('--hero-tilt-y', '0deg');
  };

  return (
    <section
      data-surface="dark"
      className="relative isolate flex min-h-[calc(100svh-4rem)] overflow-hidden bg-brand-950 text-white"
    >
      <img
        src={SITE_HERO_IMAGE}
        alt={SITE_HERO_ALT}
        className="hero-home-image absolute inset-0 -z-30 size-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(15,33,30,.97)_0%,rgba(15,33,30,.88)_8%,rgba(15,33,30,.42)_76%,rgba(15,33,30,.66)_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_74%_46%,rgba(152,192,112,.18),transparent_12%)]" />
      <div className="hero-home-grid absolute inset-0 -z-10 opacity-35" />
      <div className="hero-home-glow absolute -right-36 top-1/2 -z-10 size-[36rem] -translate-y-1/2 rounded-full bg-sage-400/15 blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-24 pt-20 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:pb-20 lg:pt-16">
        <div className="max-w-3xl">
          {/* <div className="hero-home-enter mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-caption font-semibold uppercase tracking-[0.13em] text-sage-200 backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-sage-300 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-sage-300" />
            </span>
            {badge}
          </div> */}

          <p className="hero-home-enter mb-4 text-small font-semibold uppercase tracking-[0.14em] text-white/55 [animation-delay:50ms]">
            {title}
          </p>
          <h1 className="hero-home-enter text-[clamp(1.8rem,4.2vw,3.8rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white [animation-delay:100ms]">
            Ecole Supérieure des
            <span className="mt-2 block bg-gradient-to-r from-sage-300 via-sage-400 to-brand-300 bg-clip-text text-transparent">
              Sciences Géomatiques
            </span>
          </h1>

          <p className="hero-home-enter mt-7 max-w-2xl text-body-lg leading-8 text-white/72 [animation-delay:200ms]">
            {description}
          </p>

          <div className="hero-home-enter mt-9 flex flex-col gap-3 sm:flex-row [animation-delay:300ms]">
            <Link
              to={primaryButton.link}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sage-400 px-6 text-small font-bold text-brand-950 shadow-[0_14px_35px_-16px_rgba(152,192,112,.8)] transition-[transform,background-color,box-shadow] duration-(--duration-hover) hover:-translate-y-1 hover:bg-sage-300 hover:shadow-[0_20px_40px_-16px_rgba(152,192,112,.9)] motion-reduce:transform-none"
            >
              {primaryButton.text}
              <ArrowRight className="size-4 transition-transform duration-(--duration-quick) group-hover:translate-x-1 motion-reduce:transform-none" />
            </Link>
            <Link
              to={secondaryButton.link}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-6 text-small font-semibold text-white backdrop-blur-md transition-[transform,background-color,border-color] duration-(--duration-hover) hover:-translate-y-1 hover:border-white/35 hover:bg-white/[0.12] motion-reduce:transform-none"
            >
              {secondaryButton.text}
            </Link>
          </div>

          <div className="hero-home-enter mt-11 grid max-w-2xl grid-cols-3 border-y border-white/10 [animation-delay:400ms]">
            {SIGNALS.map(({ icon: Icon, value, label }) => (
              <div
                key={value}
                className="group border-r border-white/10 px-3 py-4 first:pl-0 last:border-r-0 sm:px-5"
              >
                <div className="mb-1.5 flex items-center gap-2 text-sage-300">
                  <Icon className="size-4 transition-transform duration-(--duration-hover) group-hover:rotate-6 group-hover:scale-110 motion-reduce:transform-none" />
                  <span className="font-tech text-small font-bold">{value}</span>
                </div>
                <p className="text-caption text-white/55">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <div
            ref={visualRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
            className="hero-home-visual relative mx-auto aspect-square w-full max-w-[31rem]"
          >
            <div className="absolute inset-[4%] rounded-full border border-white/10 bg-brand-950/25 shadow-[inset_0_0_80px_rgba(15,33,30,.5)] backdrop-blur-[2px]" />
            <div className="hero-home-orbit absolute inset-[10%] rounded-full border border-dashed border-sage-300/25" />
            <div className="hero-home-orbit-reverse absolute inset-[21%] rounded-full border border-white/15" />
            <div className="absolute inset-[32%] rounded-full border border-sage-300/35 bg-sage-400/[0.07]" />
            <div className="hero-home-scan absolute inset-[10%] rounded-full" />
            <div className="absolute left-1/2 top-[10%] h-[80%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-sage-300/35 to-transparent" />
            <div className="absolute left-[10%] top-1/2 h-px w-[80%] -translate-y-1/2 bg-gradient-to-r from-transparent via-sage-300/35 to-transparent" />

            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <MapPin className="hero-home-pin mx-auto size-8 text-sage-300" />
                <strong className="mt-3 block font-tech text-small tracking-[0.18em] text-white">
                  ANDRAINJATO
                </strong>
                <span className="mt-1 block font-tech text-[0.65rem] text-sage-200/70">
                  21.4415° S · 47.0856° E
                </span>
              </div>
            </div>

            <div className="absolute left-[4%] top-[18%] rounded-xl border border-white/12 bg-brand-950/65 px-3 py-2 backdrop-blur-xl">
              <span className="block font-tech text-[0.62rem] text-sage-300">SIGNAL</span>
              <strong className="text-small text-white">98.7%</strong>
            </div>
            <div className="absolute bottom-[12%] right-0 rounded-xl border border-white/12 bg-brand-950/65 px-3 py-2 backdrop-blur-xl">
              <span className="block font-tech text-[0.62rem] text-sage-300">ALTITUDE</span>
              <strong className="text-small text-white">1 200 m</strong>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#contenu"
        aria-label="Défiler vers le contenu"
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-white/45 transition-colors hover:text-white"
      >
        <span className="font-tech text-[0.62rem] uppercase tracking-[0.16em]">Explorer</span>
        <ArrowDown className="hero-home-scroll size-4" />
      </a>
    </section>
  );
};

export default HeroSection;
