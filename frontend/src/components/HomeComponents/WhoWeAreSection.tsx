import { ArrowRight, Compass, GraduationCap, MapPinned, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { CAMPUS_GALLERY, SITE_HERO_IMAGE } from '@/constants';

const PILLARS = [
  {
    icon: GraduationCap,
    title: 'Former',
    text: 'Des compétences scientifiques et professionnelles solides.',
  },
  {
    icon: Compass,
    title: 'Explorer',
    text: 'Le terrain, la donnée et les technologies spatiales.',
  },
  { icon: MapPinned, title: 'Transformer', text: 'Des solutions concrètes pour les territoires.' },
] as const;

const WhoWeAreSection = () => {
  const backgroundImage = CAMPUS_GALLERY[0]?.src ?? SITE_HERO_IMAGE;

  return (
    <section className="relative isolate overflow-hidden bg-brand-950 py-20 text-white sm:py-24">
      <img
        src={backgroundImage}
        alt="Campus de l'ESSG à Andrainjato"
        loading="lazy"
        decoding="async"
        className="who-we-are-image absolute inset-0 -z-30 size-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(15,33,30,.97)_0%,rgba(15,33,30,.9)_48%,rgba(15,33,30,.6)_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_40%,rgba(152,192,112,.18),transparent_34%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:54px_54px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-end gap-14 lg:grid-cols-[1.08fr_.92fr]">
          <RevealOnScroll variant="fade-left" className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-sage-300/25 bg-sage-300/10 px-3.5 py-2 text-caption font-bold uppercase tracking-[0.14em] text-sage-200 backdrop-blur-md">
              <Sparkles className="size-4" />
              L’ESSG en quelques mots
            </span>
            <h2 className="mt-6 text-[clamp(2.4rem,5vw,4.7rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
              Qui sommes-nous ?
            </h2>
            <p className="mt-6 max-w-2xl text-body-lg leading-8 text-white/72">
              L’École Supérieure de Sciences Géomatiques de l’Université de Fianarantsoa forme des
              professionnels capables de lire le territoire, maîtriser la donnée spatiale et
              éclairer les décisions de demain.
            </p>
            <Link
              to="/about"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-sage-400 px-6 text-small font-bold text-brand-950 shadow-[0_14px_34px_-16px_rgba(152,192,112,.75)] transition-[transform,background-color,box-shadow] duration-(--duration-hover) hover:-translate-y-1 hover:bg-sage-300 hover:shadow-[0_20px_40px_-16px_rgba(152,192,112,.9)] motion-reduce:transform-none"
            >
              Découvrir notre histoire
              <ArrowRight className="size-4 transition-transform duration-(--duration-quick) group-hover:translate-x-1 motion-reduce:transform-none" />
            </Link>
          </RevealOnScroll>

          <RevealOnScroll variant="fade-right" delay={120} className="relative lg:pl-8">
            <div className="rounded-[2rem] border border-white/15 bg-brand-950/45 p-5 shadow-[0_24px_70px_-30px_rgba(0,0,0,.65)] backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="font-tech text-[0.62rem] uppercase tracking-[0.18em] text-sage-300">
                    Point d’ancrage
                  </span>
                  <strong className="mt-1 block text-small text-white">Campus d’Andrainjato</strong>
                </div>
                <span className="font-tech text-caption text-white/45">2026</span>
              </div>
              <div className="space-y-3">
                {PILLARS.map(({ icon: Icon, title, text }, index) => (
                  <article
                    key={title}
                    className="group flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 transition-[transform,background-color,border-color] duration-(--duration-hover) hover:translate-x-1 hover:border-sage-300/25 hover:bg-white/[0.09] motion-reduce:transform-none"
                  >
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-sage-300/10 text-sage-300 ring-1 ring-sage-300/20 transition-transform duration-(--duration-hover) group-hover:rotate-3 group-hover:scale-105 motion-reduce:transform-none">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-tech text-[0.6rem] text-white/30">0{index + 1}</span>
                        <h3 className="text-small font-bold text-white">{title}</h3>
                      </div>
                      <p className="mt-1 text-caption leading-5 text-white/55">{text}</p>
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
