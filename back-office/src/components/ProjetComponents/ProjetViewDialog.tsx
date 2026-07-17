import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Divider,
  Box,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LabelIcon from '@mui/icons-material/Label';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapPicker from '../common/MapPicker';
import { getImageUrl } from '../../utils/image.utils';
import type { Projet } from '../../types/projet.types';
import { getTypeColor, formatDateLong } from '../../utils/projet.utils';

interface ProjetViewDialogProps {
  open: boolean;
  onClose: () => void;
  projet: Projet | null;
}

const ProjetViewDialog: React.FC<ProjetViewDialogProps> = ({
  open,
  onClose,
  projet,
}) => {
  if (!projet) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <span className="text-xl font-bold">Détail du projet</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
      {/* Image */}
        {projet.image && (
          <div className="mb-4 rounded-lg overflow-hidden shadow-md">
            <img
              src={getImageUrl(projet.image)}
              alt={projet.titre}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Title */}
        <Typography variant="h5" className="font-bold mb-3">
          {projet.titre}
        </Typography>

        {/* Metadata */}
        <Box className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <LabelIcon fontSize="small" />
            <Chip
              label={projet.type}
              size="small"
              color={getTypeColor(projet.type)}
              sx={{ borderRadius: '6px', fontWeight: 500 }}
            />
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <CalendarTodayIcon fontSize="small" />
            <span>
              {formatDateLong(projet.date)}
            </span>
          </div>
        </Box>

        <Divider className="my-4" />

        {/* Description */}
        <Box className="mb-2">
          <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
            Description
          </Typography>
          <Typography variant="body1" className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {projet.description}
          </Typography>
        </Box>

        <Divider className="my-4" />

        {/* Partenaires */}
        {projet.partenaires && projet.partenaires.length > 0 && (
          <Box className="mb-4">
            <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
              Partenaires
            </Typography>
            <Box className="flex flex-wrap gap-2">
              {projet.partenaires.map((partenaire, index) => (
                <Chip
                  key={index}
                  label={partenaire}
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: '6px' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Image Info */}
        {projet.image && (
          <Box className="mt-4 pt-4 border-t border-gray-200">
            <Box className="flex items-center gap-2 mb-2">
              <Typography variant="subtitle2" className="font-semibold text-gray-700">
                Image du projet
              </Typography>
            </Box>
            <Box className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <Typography variant="caption" className="text-gray-600 break-all">
                <span className="font-semibold">Chemin:</span> {projet.image}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Map */}
        {projet.latitude && projet.longitude && (
          <Box className="mt-4">
            <Divider className="my-4" />
            <Box className="flex items-center gap-1 mb-3">
              <LocationOnIcon fontSize="small" className="text-gray-600" />
              <Typography variant="subtitle2" className="font-semibold text-gray-700">
                Localisation du projet
              </Typography>
            </Box>
            <MapPicker
              latitude={projet.latitude}
              longitude={projet.longitude}
              onLocationChange={() => {}}
              label=""
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions className="p-4">
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjetViewDialog;