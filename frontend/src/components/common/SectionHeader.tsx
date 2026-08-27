import React from 'react';

import { Sparkles } from 'lucide-react';

import { cn } from '@/lib';

import { RevealOnScroll } from './RevealOnScroll';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  dark?: boolean;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  eyebrow,
  dark = false,
  className,
}) => {
  return (
    <RevealOnScroll
      variant="fade-up"
      className={cn(
        'mb-12 flex w-full flex-col sm:mb-16',
        className
      )}
    >
      <div className="w-full">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {eyebrow && (
            <div
              className={cn(
                'inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-caption font-bold uppercase tracking-[0.15em] backdrop-blur-md transition-all duration-300 hover:scale-105',
                dark
                  ? 'border border-sage-300/30 bg-sage-400/10 text-sage-200'
                  : 'border border-brand-200 bg-brand-50/90 text-brand-800 shadow-xs'
              )}
            >
              <Sparkles
                className={cn(
                  'size-3.5',
                  dark ? 'text-sage-300' : 'text-brand-600'
                )}
              />

              <span>{eyebrow}</span>
            </div>
          )}

          <div className="group relative text-left sm:text-right">
            <h2
              className={cn(
                'font-display text-[clamp(1.9rem,3.8vw,2.85rem)] font-bold leading-[1.12] tracking-tight',
                dark ? 'text-white' : 'text-ink-900'
              )}
            >
              {title}
            </h2>

            <div
              className={cn(
                'mt-3 h-1 w-16 rounded-full transition-all duration-500 group-hover:w-28 sm:ml-auto',
                dark
                  ? 'bg-gradient-to-r from-sage-400 to-brand-400'
                  : 'bg-gradient-to-r from-brand-600 via-sage-500 to-brand-400'
              )}
            />
          </div>
        </div>

        {description && (
          <p
            className={cn(
              'mt-4 max-w-2xl text-justify text-body-lg leading-relaxed',
              dark ? 'text-white/75' : 'text-ink-600'
            )}
          >
            {description}
          </p>
        )}
      </div>
    </RevealOnScroll>
  );
};

export default SectionHeader;