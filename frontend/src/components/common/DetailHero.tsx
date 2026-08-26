import { ArrowLeft, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib';
import RevealOnScroll from './RevealOnScroll';

export interface DetailHeroMeta {
  icon?: LucideIcon;
  label: string;
}

interface DetailHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  backTo: string;
  backLabel: string;
  image?: string;
  imageAlt?: string;
  meta?: DetailHeroMeta[];
  visual?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

const DetailHero = ({
  eyebrow,
  title,
  description,
  backTo,
  backLabel,
  image,
  imageAlt,
  meta = [],
  visual,
  actions,
  className,
}: DetailHeroProps) => (
  <header className={cn('relative isolate overflow-hidden bg-brand-650 text-white', className)}>
    {image && (
      <img
        src={image}
        alt={imageAlt ?? title}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-30 size-full object-cover object-center animate-[hero-home-image_18s_var(--ease-out-soft)_both]"
      />
    )}
    <div
      className={cn(
        'absolute inset-0 -z-20',
        image
          ? 'bg-[linear-gradient(90deg,rgba(15,33,30,.97)_0%,rgba(15,33,30,.84)_52%,rgba(15,33,30,.52)_100%)]'
          : 'bg-[radial-gradient(circle_at_82%_30%,rgba(152,192,112,.18),transparent_30%),linear-gradient(135deg,#0f211e,#1e3a35)]'
      )}
    />
    <div className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:56px_56px]" />

    <div className="mx-auto grid min-h-[34rem] max-w-7xl items-center gap-10 px-5 pb-16 pt-20 sm:px-6 sm:pt-24 lg:grid-cols-[1fr_auto] lg:px-8">
      <RevealOnScroll variant="fade-left" className="max-w-4xl">
        <Link
          to={backTo}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-caption font-semibold text-white/75 backdrop-blur-md transition-colors hover:bg-white/[0.13] hover:text-white"
        >
          <ArrowLeft className="size-3.5" />
          {backLabel}
        </Link>
        <p className="font-tech text-caption uppercase tracking-[0.16em] text-sage-300">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-3xl text-body-lg leading-8 text-white/70">{description}</p>
        )}
        {meta.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {meta.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-small text-white/80 backdrop-blur-md"
              >
                {Icon && <Icon className="size-4 text-sage-300" />}
                {label}
              </li>
            ))}
          </ul>
        )}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </RevealOnScroll>

      {visual && (
        <RevealOnScroll variant="scale-in" delay={120} className="mx-auto shrink-0 lg:mx-0">
          {visual}
        </RevealOnScroll>
      )}
    </div>
  </header>
);

export default DetailHero;
