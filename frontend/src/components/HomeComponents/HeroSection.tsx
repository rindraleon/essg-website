import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { Link as RouterLink } from 'react-router-dom';
import type { HeroSectionProps } from '../../types';

const HERO_BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1664273891579-22f28332f3c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

const CHIP_STYLES = {
  color: '#f0fdf4',
  borderColor: 'rgba(255, 255, 255, 0.35)',
  backgroundColor: 'rgba(255, 255, 255, 0.10)',
  fontWeight: 500,
  backdropFilter: 'blur(4px)',
  '& .MuiChip-icon': { color: '#d9f0c5' },
} as const;

const PRIMARY_BUTTON_STYLES = {
  px: 3.5,
  py: 1.5,
  borderRadius: '0.9rem',
  backgroundColor: '#ffffff',
  color: '#1e3a35',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 8px 24px -8px rgba(0,0,0,0.35)',
  transition: 'all 0.25s ease',
  '&:hover': {
    backgroundColor: '#eff7f4',
    boxShadow: '0 12px 32px -10px rgba(0,0,0,0.4)',
    transform: 'translateY(-2px)',
  },
} as const;

const OUTLINED_BUTTON_STYLES = {
  px: 3.5,
  py: 1.5,
  borderRadius: '0.9rem',
  borderColor: 'rgba(255,255,255,0.75)',
  color: '#ffffff',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.25s ease',
  '&:hover': {
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.12)',
    transform: 'translateY(-2px)',
  },
} as const;

const HeroSection = ({
  badge = 'Excellence académique',
  title = 'Ecole Supérieure des Sciences Géomatiques',
  description = 'L\'École Supérieure de Sciences Géomatiques (ESSG) de l\'Université de Fianarantsoa, Madagascar, est un établissement d\'enseignement supérieur spécialisé dans la formation, la recherche et l\'innovation en géomatique, cartographie, télédétection et systèmes d\'information géographique (SIG).',
  primaryButton,
  secondaryButton,
}: HeroSectionProps) => {
  return (
    <section className="relative m-0 w-full h-screen overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url("${HERO_BACKGROUND_IMAGE}")` }}
      />

      
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-brand-950/70 via-brand-900/40 to-brand-950/70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, #98c070, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, #5ba092, transparent)' }}
      />

      <div className="relative flex h-full w-full flex-col items-center justify-between p-0">
        <div className="w-full max-w-4xl text-center px-4 py-32 sm:px-6 lg:px-8 lg:py-44">
          {badge && (
            <div className="mb-7 flex justify-center animate-fade-in-up">
              <Chip
                icon={<AutoAwesomeRoundedIcon />}
                label={badge}
                variant="outlined"
                sx={CHIP_STYLES}
              />
            </div>
          )}

          <h1 className="mb-5 text-4xl font-bold leading-tight drop-shadow-md sm:text-5xl lg:text-6xl animate-fade-in-up [animation-delay:80ms]">
            {title}
          </h1>

          {description && (
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-sage-100/90 drop-shadow-md sm:text-xl animate-fade-in-up [animation-delay:160ms]">
              {description}
            </p>
          )}

          {(primaryButton || secondaryButton) && (
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up [animation-delay:240ms]">
              {primaryButton && (
                <Button
                  component={RouterLink}
                  to={primaryButton.link}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={PRIMARY_BUTTON_STYLES}
                >
                  {primaryButton.text}
                </Button>
              )}

              {secondaryButton && (
                <Button
                  component={RouterLink}
                  to={secondaryButton.link}
                  variant="outlined"
                  size="large"
                  sx={OUTLINED_BUTTON_STYLES}
                >
                  {secondaryButton.text}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
