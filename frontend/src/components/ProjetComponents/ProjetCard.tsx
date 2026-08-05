import React from 'react';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import RoomRoundedIcon from '@mui/icons-material/RoomRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { GREEN } from '../../constants/colors';
import MapEmbed from './MapEmbed';
import { getImageUrl } from '../../utils/image.utils';
import type { ProjetCardProps } from '../../types/projets.types';

const PROJECT_IMAGES: Record<string, string> = {
  '1': '1594935975218-a3596da034a3',
  '2': '1460186136353-977e9d6085a1',
  '3': '1602052577122-f73b9710adba',
  '4': '1451187580459-43490279c0fa',
  '5': '1531482615713-2afd69097998',
};

const getUnsplashUrl = (id: string): string => {
  const hash = PROJECT_IMAGES[id] ?? '1531482615713-2afd69097998';
  return `https://images.unsplash.com/photo-${hash}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800`;
};

const getStatutColor = (statut: string): string => {
  switch (statut) {
    case 'En cours':
      return GREEN[500];
    default:
      return '#6b7280';
  }
};

const ProjetCard: React.FC<ProjetCardProps> = (props: Readonly<ProjetCardProps>) => {
  const { projet, onViewDetail } = props;

  return (
    <Card
      sx={{
        borderRadius: '1.25rem',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 2px rgba(15, 33, 30, 0.04), 0 4px 16px -4px rgba(15, 33, 30, 0.08)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 2px 4px rgba(15, 33, 30, 0.05), 0 16px 40px -12px rgba(15, 33, 30, 0.16)',
          transform: 'translateY(-3px)',
        },
        '&:hover .projet-overlay': {
          opacity: 1,
        },
      }}
    >
      {/* Image */}
      <div className="relative aspect-video bg-gradient-to-br from-brand-600 to-brand-950">
        <img
          src={projet.image ? getImageUrl(projet.image) : getUnsplashUrl(projet.id)}
          alt={projet.titre}
          loading="lazy"
          className="h-full w-full object-cover opacity-80"
        />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
          <Chip
            label={projet.type}
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.92)',
              color: '#111827',
              fontWeight: 600,
            }}
          />

          <Chip
            label={projet.statut}
            size="small"
            sx={{
              backgroundColor: getStatutColor(projet.statut),
              color: '#ffffff',
              fontWeight: 600,
            }}
          />
        </div>

        {/* Overlay hover */}
        <div className="projet-overlay absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity">
          <Button
            variant="contained"
            startIcon={<VisibilityRoundedIcon />}
            onClick={() => onViewDetail(projet)}
            sx={{
              borderRadius: '0.75rem',
              backgroundColor: '#ffffff',
              color: GREEN[900],
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: GREEN[50],
              },
            }}
          >
            Voir le détail
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Meta */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-ink-500">
            <CalendarTodayRoundedIcon sx={{ fontSize: 14 }} />
            {projet.annee}
          </div>

          <Tooltip title="Voir le détail">
            <IconButton
              size="small"
              onClick={() => onViewDetail(projet)}
              sx={{
                color: 'gray',
                '&:hover': {
                  color: GREEN[600],
                  backgroundColor: GREEN[50],
                },
              }}
            >
              <VisibilityRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </div>

        <h3 className="mb-3 text-xl font-bold text-ink-900">{projet.titre}</h3>

        <p className="mb-4 line-clamp-3 text-ink-500 leading-6">{projet.description}</p>

        {projet.location && (
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-1.5 text-sm text-ink-500">
              <RoomRoundedIcon sx={{ fontSize: 16, color: '#2e6a5f' }} />
              <span>
                {projet.location.ville}, {projet.location.pays}
              </span>
            </div>
            <MapEmbed
              lat={projet.location.lat}
              lng={projet.location.lng}
              label={`${projet.location.ville}, ${projet.location.pays}`}
              adresse={projet.location.adresse}
              zoom="city"
              height={280}
            />
          </div>
        )}

        {/* Partenaires */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-900">
            <GroupsRoundedIcon sx={{ fontSize: 18, color: GREEN[600] }} />
            Partenaires
          </div>
          <div className="flex flex-wrap gap-2">
            {projet.partenaires.map((partenaire) => (
              <Chip
                key={partenaire}
                label={partenaire}
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
      </CardContent>
    </Card>
  );
};

export default ProjetCard;
