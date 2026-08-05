import React from 'react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import type { AdmissionCtaSectionProps } from '../../types/admission.types';

const AdmissionSection: React.FC<AdmissionCtaSectionProps> = (
  props: Readonly<AdmissionCtaSectionProps>
) => {
  const {
    title = "Prêt à rejoindre l'ESSG ?",
    description = "Commencez votre parcours vers l'excellence en sciences géomatiques",
    primaryButtonLabel = 'Postuler maintenant',
    primaryButtonLink = '/admission',
    secondaryButtonLabel = 'Demander des informations',
    secondaryButtonLink = '/contact',
  } = props;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>

        <p className="mx-auto mb-8 max-w-2xl text-xl text-sage-100/90">{description}</p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            component={RouterLink}
            to={primaryButtonLink}
            variant="contained"
            size="large"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              borderRadius: '0.75rem',
              px: 3,
              py: 1.5,
              backgroundColor: '#ffffff',
              color: '#1e3a35',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 10px 24px -10px rgba(0,0,0,0.35)',
              transition: 'all 0.25s ease',
              '&:hover': {
                backgroundColor: '#eff7f4',
                boxShadow: '0 14px 32px -12px rgba(0,0,0,0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            {primaryButtonLabel}
          </Button>

          <Button
            component={RouterLink}
            to={secondaryButtonLink}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: '0.75rem',
              px: 3,
              py: 1.5,
              borderColor: 'rgba(255,255,255,0.75)',
              color: '#ffffff',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#ffffff',
                backgroundColor: 'rgba(255,255,255,0.10)',
              },
            }}
          >
            {secondaryButtonLabel}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdmissionSection;
