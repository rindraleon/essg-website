import { ArrowDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SITE_HERO_ALT, SITE_HERO_IMAGE } from '../../constants/media';
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import type { HeroSectionProps } from '../../types';

/* ───────────────────────── CSS Styles ───────────────────────── */
const heroStyles = `
  @keyframes drift{0%{background-position:0 0}100%{background-position:-100px 100px}}
  @keyframes revealUp{to{opacity:1;transform:translateY(0)}}
  @keyframes pulseOpacity{0%,100%{opacity:.4}50%{opacity:1}}
  @keyframes twinkle{0%,100%{opacity:0;transform:scale(.5)}50%{opacity:1;transform:scale(1.2)}}
  @keyframes shootingStar{0%{transform:translate(0,0) rotate(-45deg);opacity:1}70%{opacity:1}100%{transform:translate(300px,300px) rotate(-45deg);opacity:0}}
  @keyframes floatParticle{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-100vh) translateX(50px);opacity:0}}
  @keyframes panBg{0%{transform:scale(1.1) translate(0,0)}25%{transform:scale(1.15) translate(-1%,-.5%)}50%{transform:scale(1.1) translate(-.5%,.5%)}75%{transform:scale(1.12) translate(.5%,-.3%)}100%{transform:scale(1.1) translate(0,0)}}
  @keyframes glowPulse{0%,100%{text-shadow:0 0 20px rgba(152,192,112,.3),0 0 40px rgba(152,192,112,.1)}50%{text-shadow:0 0 30px rgba(152,192,112,.5),0 0 60px rgba(152,192,112,.2)}}
  @keyframes scanLine{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
  @keyframes orbitRotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
  @keyframes ringSpin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
  @keyframes ringSpinReverse{0%{transform:rotate(360deg)}100%{transform:rotate(0)}}
  .hero-bg{animation:panBg 30s ease-in-out infinite;will-change:transform}
  .hero-grid{background-image:linear-gradient(to right,rgba(152,192,112,.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(152,192,112,.06) 1px,transparent 1px);background-size:40px 40px}
  .hero-topo{background-image:url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M0 50 Q25 25,50 50 T100 50" stroke="rgba(152,192,112,.15)" fill="none" stroke-width=".5"/></svg>');background-size:100px 100px;animation:drift 20s linear infinite}
  .hero-reveal{opacity:0;transform:translateY(24px);animation:revealUp .8s cubic-bezier(.16,1,.3,1) forwards}
  .hero-d1{animation-delay:.2s}.hero-d2{animation-delay:.4s}.hero-d3{animation-delay:.6s}.hero-d4{animation-delay:.8s}.hero-d5{animation-delay:1s}
  .hero-pulse{animation:pulseOpacity 2s ease-in-out infinite}
  .hero-plx{transition:transform .15s ease-out;will-change:transform}
  .hero-glass{background:rgba(15,33,30,.45);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(152,192,112,.15);border-top:1px solid rgba(152,192,112,.25)}
  .hero-star{position:absolute;background:#fff;border-radius:50%;animation:twinkle var(--d) ease-in-out infinite;animation-delay:var(--dl)}
  .hero-shoot{position:absolute;width:2px;height:2px;background:linear-gradient(to right,rgba(152,192,112,.9),transparent);border-radius:50%;animation:shootingStar var(--d) ease-in infinite;animation-delay:var(--dl)}
  .hero-shoot::after{content:'';position:absolute;top:0;left:0;width:40px;height:1px;background:linear-gradient(to left,rgba(152,192,112,.8),transparent)}
  .hero-fp{position:absolute;width:var(--s);height:var(--s);background:radial-gradient(circle,rgba(152,192,112,.6) 0%,transparent 70%);border-radius:50%;animation:floatParticle var(--d) linear infinite;animation-delay:var(--dl)}
  .hero-glow{animation:glowPulse 4s ease-in-out infinite}
  .hero-scan{position:absolute;width:100%;height:2px;background:linear-gradient(to right,transparent,rgba(152,192,112,.15),transparent);animation:scanLine 8s linear infinite}
  .hero-orb{animation:orbitRotate 20s linear infinite}
  .hero-orb-r{animation:orbitRotate 30s linear infinite reverse}
  .hero-ring{position:absolute;border-radius:50%;border:1px solid rgba(152,192,112,.3);animation:ringSpin var(--d) linear infinite;will-change:transform}
  .hero-ring-reverse{animation:ringSpinReverse var(--d) linear infinite}
`;

/* ───────────────────────── Particle Generators ───────────────────────── */
interface ParticleData {
  id: number;
  style: React.CSSProperties;
  className: string;
}

const mkRand = (min: number, max: number) => min + Math.random() * (max - min);

function buildParticles(): ParticleData[] {
  const items: ParticleData[] = [];

  for (let i = 0; i < 80; i++) {
    const s = `${1 + Math.random() * 2}px`;
    items.push({
      id: i,
      className: 'hero-star',
      style: { top: `${mkRand(0, 100)}%`, left: `${mkRand(0, 100)}%`, width: s, height: s, '--d': `${mkRand(2, 6)}s`, '--dl': `${mkRand(0, 5)}s` } as React.CSSProperties,
    });
  }

  for (let i = 0; i < 5; i++) {
    items.push({
      id: 100 + i,
      className: 'hero-shoot',
      style: { top: `${mkRand(0, 50)}%`, left: `${mkRand(0, 70)}%`, '--d': `${mkRand(1.5, 3.5)}s`, '--dl': `${i * 4 + mkRand(0, 3)}s` } as React.CSSProperties,
    });
  }

  for (let i = 0; i < 25; i++) {
    items.push({
      id: 200 + i,
      className: 'hero-fp',
      style: { left: `${mkRand(0, 100)}%`, bottom: '-10px', '--s': `${mkRand(2, 6)}px`, '--d': `${mkRand(8, 20)}s`, '--dl': `${mkRand(0, 10)}s` } as React.CSSProperties,
    });
  }

  return items;
}

const particles = buildParticles();

/* ───────────────────────── Sous-composants ───────────────────────── */
const ParticleField = React.memo(() => (
  <div className="absolute inset-0" aria-hidden="true">
    {particles.map((p) => (
      <div key={p.id} className={p.className} style={p.style} />
    ))}
  </div>
));
ParticleField.displayName = 'ParticleField';

const InfiniteRings: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="hero-ring" style={{ width: '500px', height: '500px', '--d': '25s' }} />
      <div className="hero-ring hero-ring-reverse" style={{ width: '400px', height: '400px', '--d': '18s', borderColor: 'rgba(152,192,112,.2)', borderStyle: 'dashed' }} />
      <div className="hero-ring" style={{ width: '300px', height: '300px', '--d': '30s', borderColor: 'rgba(152,192,112,.15)' }} />
      <div className="hero-ring hero-ring-reverse" style={{ width: '200px', height: '200px', '--d': '15s', borderColor: 'rgba(152,192,112,.4)', borderWidth: '2px' }} />
    </div>
  </div>
);

const HudCrosshair: React.FC = () => (
  <>
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="hero-orb absolute h-48 w-48 rounded-full border border-sage-400/10" />
      <div className="hero-orb-r absolute h-72 w-72 rounded-full border border-dashed border-sage-400/5" />
      <div className="absolute h-32 w-32 animate-ping rounded-full border border-sage-400/10" />
      <div className="absolute h-96 w-96 rounded-full border border-sage-400/[0.03]" />
    </div>
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
      <div className="absolute top-1/2 h-px w-full bg-sage-400" />
      <div className="absolute left-1/2 h-full w-px bg-sage-400" />
      <div className="absolute h-32 w-32 rounded-full border border-sage-400" />
    </div>
    <div className="relative z-10 text-center">
      <div className="font-mono text-xs uppercase tracking-widest text-sage-400/60">POSITION LOCK</div>
      <div className="mt-2 font-mono text-2xl font-bold text-sage-400">-21.4415° S</div>
      <div className="font-mono text-2xl font-bold text-white/80">47.0856° E</div>
    </div>
  </>
);

interface HudPanelProps {
  className?: string;
  children: React.ReactNode;
  depth: string;
  registerLayer: (el: HTMLDivElement | null) => void;
}

const HudPanel: React.FC<HudPanelProps> = ({ className, children, depth, registerLayer }) => (
  <div ref={registerLayer} data-depth={depth} className={cn('hero-glass hero-plx absolute rounded p-4', className)}>
    {children}
  </div>
);

/* ───────────────────────── Main Component ───────────────────────── */
const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'École Supérieure de Sciences Géomatiques',
  description = "Formez-vous à la géomatique, à la topographie et à l'aménagement du territoire. Une école d'excellence, au service des territoires de Madagascar.",
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);

  const registerLayer = useCallback((el: HTMLDivElement | null) => {
    if (el && !layersRef.current.includes(el)) layersRef.current.push(el);
  }, []);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      layersRef.current.forEach((l) => {
        const d = parseFloat(l.dataset.depth || '0');
        l.style.transform = `translate3d(${x * d}px,${y * d}px,0)`;
      });
    };

    const onLeave = () => {
      layersRef.current.forEach((l) => {
        l.style.transform = 'translate3d(0,0,0)';
      });
    };

    c.addEventListener('mousemove', onMove);
    c.addEventListener('mouseleave', onLeave);
    return () => {
      c.removeEventListener('mousemove', onMove);
      c.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <>
      <style>{heroStyles}</style>

      <section ref={containerRef} className="relative flex min-h-screen w-full items-center overflow-hidden bg-brand-650 pt-24">
        {/* ═══ Background ═══ */}
        <div className="absolute inset-0 z-0 bg-black">
          <div ref={registerLayer} data-depth="0.02" className="hero-bg hero-plx absolute inset-0 opacity-50">
            <img src={SITE_HERO_IMAGE} alt={SITE_HERO_ALT} className="h-full w-full object-cover object-center" loading="eager" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-brand-650 via-brand-650/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-650 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,rgba(15,33,30,0.4)_50%,rgba(15,33,30,0.9))]" />

          <div className="hero-scan" aria-hidden="true" />
          <div ref={registerLayer} data-depth="0.03" className="hero-grid hero-plx absolute inset-0 opacity-30" />
          <div ref={registerLayer} data-depth="0.05" className="hero-topo hero-plx absolute inset-0 opacity-40" />

          <ParticleField />
          <InfiniteRings />
        </div>

        {/* ═══ Content ═══ */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-16">
          <div className="grid grid-cols-4 gap-1 md:grid-cols-12 md:gap-6">
            {/* Left */}
            <div ref={registerLayer} data-depth="0.03" className="hero-plx col-span-4 flex flex-col justify-center md:col-span-7">
              <h1 className="hero-reveal hero-d1 mb-6 block text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-[3.2rem] lg:leading-[1.12] lg:tracking-[-0.02em] text-white">
                <span className="hero-glow text-sage-400">{title}</span>
              </h1>

              {description && (
                <div className="hero-reveal hero-d4 mb-8 max-w-xl">
                  <p className="text-base leading-relaxed text-white/80 md:text-lg">{description}</p>
                </div>
              )}
            </div>

            {/* Right — HUD */}
            <div className="relative col-span-5 hidden h-[600px] md:flex">
              <div ref={registerLayer} data-depth="0.14" className="hero-glass hero-plx absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl opacity-80 mix-blend-screen">
                <HudCrosshair />
              </div>

              <HudPanel depth="0.1" registerLayer={registerLayer} className="-left-12 top-8">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-white/60">ANALYSIS STATUS</span>
                  <span className="font-mono text-sm text-sage-400">98.7%</span>
                </div>
                <div className="mt-1 h-1 w-full bg-brand-800">
                  <div className="h-1 bg-sage-400" style={{ width: '98.7%' }} />
                </div>
              </HudPanel>

              <HudPanel depth="0.12" registerLayer={registerLayer} className="-left-8 bottom-16">
                <div className="flex items-center gap-3">
                  <div className="hero-pulse h-2 w-2 rounded-full bg-sage-400" />
                  <span className="font-mono text-xs uppercase tracking-widest text-white">SATELLITE DATA ACTIVE</span>
                </div>
                <div className="mt-2 flex flex-col gap-1 font-mono text-sm text-white/60">
                  <span>TERRITORY: 2,481 KM²</span>
                  <span>ELEVATION: 1,276 M</span>
                </div>
              </HudPanel>

              <div ref={registerLayer} data-depth="0.09" className="hero-plx absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-8 text-right">
                {[['LAT', '-21.4415'], ['LON', '47.0856']].map(([label, val]) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="font-mono text-xs uppercase tracking-widest text-white/40">{label}</span>
                    <span className="font-mono text-sm text-white">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 z-20 h-32 w-full bg-gradient-to-t from-brand-650 to-transparent" />

        {/* Scroll indicator */}
        <a href="#contenu" className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-white/60 transition-colors hover:text-white" aria-label="Défiler vers le contenu">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">Découvrir</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </a>
      </section>
    </>
  );
};

export default HeroSection;