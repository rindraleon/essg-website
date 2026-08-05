import React from 'react';
import Chip from '@mui/material/Chip';
import { GREEN } from '../../constants/colors';
import type { PageHeroProps } from '../../types/common.types';

const PageHero: React.FC<PageHeroProps> = (props: Readonly<PageHeroProps>) => {
  const {
    image,
    imageAlt = 'Illustration',
    badgeIcon,
    badgeLabel,
    title,
    description,
    stats = [],
    minHeight = '60vh',
  } = props;

  return (
    <section className="relative overflow-hidden text-white">
      <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${GREEN[950]}f2, ${GREEN[900]}dd, ${GREEN[700]}b3)`,
        }}
      />

      {/* Halo sauge décoratif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, #98c070, transparent)' }}
      />

      <div
        className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8"
        style={{ minHeight }}
      >
        <div className="mx-auto max-w-3xl">
          {badgeLabel && (
            <div className="mb-6 flex justify-center animate-fade-in-up">
              <Chip
                icon={badgeIcon}
                label={badgeLabel}
                variant="outlined"
                sx={{
                  color: GREEN[100],
                  borderColor: 'rgba(152, 192, 112, 0.45)',
                  backgroundColor: 'rgba(152, 192, 112, 0.12)',
                  fontWeight: 500,
                  backdropFilter: 'blur(4px)',
                  '& .MuiChip-icon': { color: '#c2d799' },
                }}
              />
            </div>
          )}

          <h1 className="mb-4 text-4xl font-bold leading-tight drop-shadow-md sm:text-5xl lg:text-6xl animate-fade-in-up [animation-delay:80ms]">
            {title}
          </h1>

          {description && (
            <p
              className="mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl animate-fade-in-up [animation-delay:160ms]"
              style={{ color: GREEN[100] }}
            >
              {description}
            </p>
          )}
        </div>

        {stats.length > 0 && (
          <div
            className="mt-12 grid w-full max-w-3xl gap-4 lg:gap-6 animate-fade-in-up [animation-delay:240ms]"
            style={{
              gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))`,
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-4 text-center backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  boxShadow: '0 8px 24px -12px rgba(0,0,0,0.35)',
                }}
              >
                {stat.icon && <div className="mb-2 flex justify-center">{stat.icon}</div>}
                <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                <div className="text-sm" style={{ color: GREEN[200] }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
