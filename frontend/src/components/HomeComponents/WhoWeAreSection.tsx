import { ArrowRight, Database, Layers, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { CAMPUS_GALLERY, SITE_HERO_IMAGE } from '@/constants';
import ParticlesBackground from '../animations/ParticlesBackground';

const MISSION_PILLARS = [
  {
    icon: Database,
    title: 'Collecter & Structurer',
    text: 'Acquérir la donnée spatiale de terrain, GNSS et satellite avec une rigueur scientifique absolue.',
  },
  {
    icon: Layers,
    title: 'Analyser & Modéliser',
    text: 'Exploiter les Systèmes d’Information Géographique, le traitement d’images et la télédétection.',
  },
  {
    icon: Target,
    title: 'Valoriser & Décider',
    text: 'Fournir des solutions concrètes pour l’aménagement, l’environnement et le développement territorial.',
  },
] as const;

const WhoWeAreSection = () => {
  const backgroundImage = CAMPUS_GALLERY[0]?.src ?? SITE_HERO_IMAGE;

  return (
    <section className="relative isolate overflow-hidden bg-brand-950 py-12 text-white sm:py-14">
      <ParticlesBackground particleCount={85} />
      {/* <img
        src={backgroundImage}
        alt="Campus de l'ESSG à Andrainjato"
        loading="lazy"
        decoding="async"
        className="who-we-are-image absolute inset-0 -z-30 size-full object-cover object-center"
      /> */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(37, 82, 74, 0.98)_0%,rgba(15,33,30,.92)_48%,rgba(15,33,30,.65)_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_40%,rgba(152,192,112,.2),transparent_36%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
          <RevealOnScroll variant="fade-left" className="max-w-3xl">
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-sage-300/30 bg-sage-300/10 px-4 py-2 text-caption font-bold uppercase tracking-[0.14em] text-sage-200 backdrop-blur-md shadow-sm transition-transform duration-300 hover:scale-105">
              <Sparkles className="size-4 text-sage-300" />
              Une école spécialisée dans les sciences géomatiques
            </div> */}

            <div className="group mt-6">
              <h2 className="font-display text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.04em] text-white">
                Qui sommes-nous ?
              </h2>
              <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-sage-400 to-brand-400 transition-all duration-500 group-hover:w-32" />
            </div>

            <div className="mt-7 space-y-4 text-body-lg leading-relaxed text-white/85">
              <p className="text-justify">
                L’<strong className="text-white font-semibold">École Supérieure des Sciences Géomatiques (ESSG)</strong> est une école supérieure implantée au cœur de l’<strong className="text-sage-200 font-semibold">Université de Fianarantsoa</strong> et spécialisée dans le domaine de la géomatique.
              </p>
              <p className="text-justify text-white/75">
                Notre mission est de former des professionnels compétents, capables de <strong className="text-white font-semibold">collecter, analyser, exploiter et valoriser les données géographiques et spatiales</strong> afin de répondre aux enjeux actuels de développement, d’aménagement et de gestion des territoires.
              </p>
              
            </div>

            <div className="mt-8">
              <Link
                to="/about"
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-sage-400 px-7 text-small font-bold text-brand-950 shadow-[0_14px_34px_-16px_rgba(152,192,112,.8)] transition-all duration-(--duration-hover) hover:-translate-y-1 hover:bg-sage-300 hover:shadow-[0_20px_42px_-14px_rgba(152,192,112,.95)] motion-reduce:transform-none"
              >
                Découvrir l’ESSG et son histoire
                <ArrowRight className="size-4 transition-transform duration-(--duration-quick) group-hover:translate-x-1 motion-reduce:transform-none" />
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll variant="fade-right" delay={120} className="relative lg:pl-6">
            <div className="rounded-[2.25rem] border border-white/20 bg-brand-950/60 p-6 shadow-[0_24px_70px_-20px_rgba(0,0,0,.75)] backdrop-blur-2xl sm:p-7">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="font-tech text-[0.65rem] uppercase tracking-[0.2em] text-sage-300 font-bold">
                    Mission Fondamentale
                  </span>
                  <strong className="mt-1 block font-display text-h5 text-white">Observer · Mesurer · Transformer</strong>
                </div>
                <div className="rounded-full bg-sage-400/20 px-3 py-1 text-caption font-tech font-bold text-sage-200">
                  ESSG
                </div>
              </div>
              <div className="space-y-3.5">
                {MISSION_PILLARS.map(({ icon: Icon, title, text }, index) => (
                  <article
                    key={title}
                    className="group flex items-start gap-4 rounded-2xl border border-white/[0.09] bg-white/[0.05] p-4.5 transition-all duration-300 ease-out hover:translate-x-2 hover:border-sage-300/40 hover:bg-white/[0.1] hover:shadow-lg motion-reduce:transform-none"
                  >
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-sage-300/15 text-sage-300 ring-1 ring-sage-300/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-sage-400 group-hover:text-brand-950 motion-reduce:transform-none">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-tech text-[0.65rem] text-sage-300/70 font-semibold">0{index + 1}</span>
                        <h3 className="text-small font-bold text-white group-hover:text-sage-200 transition-colors">{title}</h3>
                      </div>
                      <p className="mt-1.5 text-justify text-caption leading-relaxed text-white/70">{text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
