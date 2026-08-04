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
          background: `linear-gradient(135deg, ${GREEN[950]}, ${GREEN[900]}, ${GREEN[800]})`,
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {icon && <div className="mb-4 flex justify-center">{icon}</div>}

        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{title}</h2>

        {description && (
          <p className="mx-auto mb-8 max-w-2xl text-lg sm:text-xl" style={{ color: GREEN[100] }}>
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
                borderRadius: '0.75rem',
                px: 4,
                py: 1.5,
                backgroundColor: '#ffffff',
                color: GREEN[900],
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: GREEN[50],
                  boxShadow: 'none',
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
                borderRadius: '0.75rem',
                px: 4,
                py: 1.5,
                backgroundColor: '#ffffff',
                color: GREEN[900],
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: GREEN[50],
                  boxShadow: 'none',
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
                borderRadius: '0.75rem',
                px: 4,
                py: 1.5,
                borderColor: 'rgba(255,255,255,0.6)',
                color: '#ffffff',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255,255,255,0.08)',
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
