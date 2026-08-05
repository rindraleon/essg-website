import React from 'react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { GREEN } from '../../constants/colors';
import type { CtaSectionProps } from '../../types/common.types';

const CtaSection: React.FC<CtaSectionProps> = (props: Readonly<CtaSectionProps>) => {
  const {
    icon,
    title,
    description,
    primaryLabel,
    primaryLink,
    primaryIsMailto = false,
    secondaryLabel,
    secondaryLink,
  } = props;

  return (
    <section className="relative overflow-hidden py-20 text-white">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${GREEN[950]}, ${GREEN[900]}, ${GREEN[700]})`,
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 45%, rgba(152,192,112,0.55) 0%, transparent 45%), radial-gradient(circle at 82% 55%, rgba(91,160,146,0.5) 0%, transparent 45%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 lg:px-8">
        {icon && <div className="mb-5 flex justify-center animate-float">{icon}</div>}

        <h2 className="mb-4 text-3xl font-bold drop-shadow-sm sm:text-4xl text-balance">{title}</h2>

        {description && (
          <p className="mx-auto mb-9 max-w-2xl text-lg sm:text-xl" style={{ color: GREEN[100] }}>
            {description}
          </p>
        )}

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          {primaryIsMailto ? (
            <Button
              component="a"
              href={`mailto:${primaryLink}`}
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                borderRadius: '0.9rem',
                px: 4,
                py: 1.5,
                backgroundColor: '#ffffff',
                color: GREEN[900],
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 24px -8px rgba(0,0,0,0.4)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: GREEN[50],
                  boxShadow: '0 12px 32px -10px rgba(0,0,0,0.45)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {primaryLabel}
            </Button>
          ) : (
            <Button
              component={RouterLink}
              to={primaryLink}
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                borderRadius: '0.9rem',
                px: 4,
                py: 1.5,
                backgroundColor: '#ffffff',
                color: GREEN[900],
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 24px -8px rgba(0,0,0,0.4)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: GREEN[50],
                  boxShadow: '0 12px 32px -10px rgba(0,0,0,0.45)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {primaryLabel}
            </Button>
          )}

          {secondaryLabel && secondaryLink && (
            <Button
              component={RouterLink}
              to={secondaryLink}
              variant="outlined"
              size="large"
              sx={{
                borderRadius: '0.9rem',
                px: 4,
                py: 1.5,
                borderColor: 'rgba(255,255,255,0.6)',
                color: '#ffffff',
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 0.25s ease',
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
