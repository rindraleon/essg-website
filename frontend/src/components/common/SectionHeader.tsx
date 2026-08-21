import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description: string;
  eyebrow?: string;
  center?: boolean;
  maxWidth?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  eyebrow,
  center = true,
  maxWidth = 'max-w-[65ch]',
}) => {
  return (
    <div
      data-gsap="up"
      className={cn('mb-12 flex flex-col', center ? 'items-center text-center' : 'items-start')}
    >
      <div className={cn(maxWidth, center && 'text-center')}>
        {eyebrow && (
          <span className="mb-3 block text-caption font-semibold uppercase tracking-wider text-brand-700">
            {eyebrow}
          </span>
        )}

        <h2 className="text-h2 text-ink-900">{title}</h2>

        <p className="mt-3 text-body-lg text-ink-500">{description}</p>
      </div>
    </div>
  );
};

export default SectionHeader;
