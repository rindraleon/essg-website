import React from 'react';

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
  maxWidth = 'max-w-2xl',
}) => {
  return (
    <div className={`mb-12 flex flex-col ${center ? 'items-center text-center' : 'items-start'}`}>
      <div className={center ? `text-center ${maxWidth}` : 'max-w-2xl'}>
        {eyebrow && (
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
            {eyebrow}
          </span>
        )}

        <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{title}</h2>

        <p className="mt-3 text-base leading-7 text-ink-500 sm:text-lg">{description}</p>
      </div>
    </div>
  );
};

export default SectionHeader;
