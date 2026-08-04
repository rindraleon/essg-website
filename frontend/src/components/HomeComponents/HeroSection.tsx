import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { Link as RouterLink } from 'react-router-dom';
import type { HeroSectionProps } from '../../types';

const HERO_BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1664273891579-22f28332f3c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

const CHIP_STYLES = {
  color: '#eff6ff',
  borderColor: 'rgba(255, 255, 255, 0.35)',
  backgroundColor: 'rgba(255, 255, 255, 0.10)',
  fontWeight: 500,
  '& .MuiChip-icon': { color: '#dbeafe' },
} as const;

const PRIMARY_BUTTON_STYLES = {
  px: 3,
  py: 1.5,
  borderRadius: '0.75rem',
  backgroundColor: '#ffffff',
  color: '#1e3a8a',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': { backgroundColor: '#eff6ff', boxShadow: 'none' },
} as const;

const OUTLINED_BUTTON_STYLES = {
  px: 3,
  py: 1.5,
  borderRadius: '0.75rem',
  borderColor: 'rgba(255,255,255,0.75)',
  color: '#ffffff',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': { borderColor: '#ffffff', backgroundColor: 'rgba(255,255,255,0.10)' },
} as const;

const HeroSection = ({
  badge = 'Excellence académique',
  title = 'Ecole Supérieure des Sciences Géomatiques',
  description = 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  primaryButton,
  secondaryButton,
}: HeroSectionProps) => {
  return (
    <section className="relative m-0 w-full h-screen overflow-hidden bg-gradient-to-br from-black via-black-700 to-sky-900 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url("${HERO_BACKGROUND_IMAGE}")` }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-green-900/20 to-slate-950/40"
      />

      <div className="relative flex h-full w-full flex-col items-center justify-between p-0">
        <div className="w-full max-w-4xl text-center text-green-700 px-4 py-32 sm:px-6 lg:px-8 lg:py-48">
          {badge && (
            <div className="mb-6 flex justify-center">
              <Chip
                icon={<AutoAwesomeRoundedIcon />}
                label={badge}
                variant="outlined"
                sx={CHIP_STYLES}
              />
            </div>
          )}

          <h1 className="mb-4 text-4xl font-bold leading-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {description && (
            <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-blue-50 drop-shadow-sm sm:text-xl">
              {description}
            </p>
          )}

          {(primaryButton || secondaryButton) && (
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
