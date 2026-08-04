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
          background: `linear-gradient(135deg, ${GREEN[950]}ee, ${GREEN[800]}cc, ${GREEN[600]}99)`,
        }}
      />

      <div
        className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8"
        style={{ minHeight }}
      >
        <div className="mx-auto max-w-3xl">
          {badgeLabel && (
            <div className="mb-6 flex justify-center">
              <Chip
                icon={badgeIcon}
                label={badgeLabel}
                variant="outlined"
                sx={{
                  color: GREEN[100],
                  borderColor: 'rgba(134, 239, 172, 0.4)',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  fontWeight: 500,
                  '& .MuiChip-icon': { color: GREEN[300] },
                }}
              />
            </div>
          )}

          <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{title}</h1>

          {description && (
            <p
              className="mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl"
              style={{ color: GREEN[100] }}
            >
              {description}
            </p>
          )}
        </div>

        {stats.length > 0 && (
          <div
            className="mt-12 grid w-full max-w-3xl gap-4 lg:gap-6"
            style={{
              gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))`,
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-4 text-center backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(134, 239, 172, 0.25)',
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
