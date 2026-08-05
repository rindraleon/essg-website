import React from 'react';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { Link as RouterLink } from 'react-router-dom';
import { GREEN } from '../../constants/colors';
import { getImageUrl } from '../../utils/image.utils';
import type { FormationCardProps } from '../../types/formations.types';

const FormationCard: React.FC<FormationCardProps> = (props: Readonly<FormationCardProps>) => {
  const { formation, detailLinkBase = '/formations', applyLink = '/admission' } = props;

  return (
    <Card
      sx={{
        borderRadius: '1.25rem',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 2px rgba(15, 33, 30, 0.04), 0 4px 16px -4px rgba(15, 33, 30, 0.08)',
      }}
    >
      <div className="flex flex-col sm:flex-row">
        {formation.image && (
          <div className="relative w-full shrink-0 overflow-hidden bg-ink-100 sm:w-[40%] sm:self-stretch">
            <div className="aspect-[16/9] w-full sm:h-full sm:aspect-auto">
              <CardMedia
                component="img"
                image={getImageUrl(formation.image)}
                alt={formation.titre}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-ink-950/25 to-transparent sm:hidden"
            />
          </div>
        )}

        {formation.image && (
          <div aria-hidden="true" className="hidden w-px shrink-0 bg-ink-100 sm:block" />
        )}
        <CardContent className="p-0" sx={{ width: { xs: '100%', sm: '66.67%' } }}>
          <div className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <Chip
                label={formation.niveau}
                variant="outlined"
                size="small"
                sx={{
                  color: GREEN[700],
                  borderColor: GREEN[200],
                  backgroundColor: GREEN[50],
                  fontWeight: 600,
                }}
              />

              <div className="flex items-center gap-1 text-xs text-ink-500">
                <AccessTimeRoundedIcon sx={{ fontSize: 14 }} />
                {formation.duree}
              </div>
            </div>

            <h3 className="mb-2 text-xl font-bold text-ink-900">{formation.titre}</h3>

            <p className="mb-4 text-sm font-medium" style={{ color: GREEN[600] }}>
              {formation.domaine.join(', ')}
            </p>

            <p className="mb-6 leading-relaxed text-ink-500">{formation.description}</p>

            <Divider className="mb-6" />

            {/* Objectifs */}
            <div className="mb-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-900">
                <SchoolRoundedIcon sx={{ fontSize: 18, color: GREEN[600] }} />
                Objectifs principaux
              </div>
              <ul className="space-y-2 text-sm text-ink-500">
                {formation.objectifs.slice(0, 3).map((obj) => (
                  <li key={obj} className="flex items-start gap-2">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{
                        backgroundColor: GREEN[500],
                      }}
                    >
                      ✓
                    </span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Débouchés */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-900">
                <WorkRoundedIcon sx={{ fontSize: 18, color: GREEN[600] }} />
                Débouchés
              </div>
              <div className="flex flex-wrap gap-2">
                {formation.debouches.slice(0, 3).map((debouche) => (
                  <Chip
                    key={debouche}
                    label={debouche}
                    size="small"
                    sx={{
                      backgroundColor: GREEN[50],
                      color: GREEN[800],
                      fontWeight: 500,
                      border: `1px solid ${GREEN[200]}`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Boutons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                component={RouterLink}
                to={`${detailLinkBase}/${formation.slug}`}
                variant="contained"
                fullWidth
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  borderRadius: '0.75rem',
                  py: 1.25,
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: GREEN[600],
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: GREEN[700],
                    boxShadow: 'none',
                  },
                }}
              >
                Voir le détail
              </Button>

              <Button
                component={RouterLink}
                to={applyLink}
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: '0.75rem',
                  py: 1.25,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: GREEN[600],
                  color: GREEN[600],
                  '&:hover': {
                    borderColor: GREEN[700],
                    backgroundColor: GREEN[50],
                  },
                }}
              >
                Postuler
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default FormationCard;
