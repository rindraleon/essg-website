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
import PersonIcon from '@mui/icons-material/Person';
import LabelIcon from '@mui/icons-material/Label';
import StarIcon from '@mui/icons-material/Star';
import { getImageUrl } from '../../utils/image.utils';
import type { ActualiteItem } from '../../types/actualite.types';
import StatusBadge from '../common/StatusBadge';

interface ActualiteViewDialogProps {
  open: boolean;
  onClose: () => void;
  actualite: ActualiteItem | null;
}

const ActualiteViewDialog: React.FC<ActualiteViewDialogProps> = ({
  open,
  onClose,
  actualite,
}) => {
  if (!actualite) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <span className="text-xl font-bold">Détail de l&apos;actualité</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Image */}
        {actualite.image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={getImageUrl(actualite.image)}
              alt={actualite.titre}
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        {/* Title */}
        <Typography variant="h5" className="font-bold mb-3">
          {actualite.titre}
        </Typography>

        {/* Metadata */}
        <Box className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <PersonIcon fontSize="small" />
            <span>{actualite.auteur}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <CalendarTodayIcon fontSize="small" />
            <span>
              {new Date(actualite.date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <LabelIcon fontSize="small" />
            <span>{actualite.categorie}</span>
          </div>
          <StatusBadge status={actualite.statut} />
        </Box>

        <Divider className="my-4" />

        {/* Resume */}
        {actualite.resume && (
          <Box className="mb-4">
            <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
              Résumé
            </Typography>
            <Typography variant="body2" className="text-gray-600 bg-gray-50 p-3 rounded-lg">
              {actualite.resume}
            </Typography>
          </Box>
        )}

        {/* Featured Badge */}
        {actualite.enVedette && (
          <Box className="mb-4">
            <Chip
              icon={<StarIcon />}
              label="Actualité en vedette"
              color="warning"
              size="small"
              className="font-medium"
            />
          </Box>
        )}

        <Divider className="my-4" />

        {/* Content */}
        <Box className="mb-2">
          <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
            Contenu complet
          </Typography>
          <Typography variant="body1" className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {actualite.contenu}
          </Typography>
        </Box>

        {/* Image URL */}
        {actualite.image && (
          <Box className="mt-4 pt-4 border-t border-gray-200">
            <Typography variant="caption" className="text-gray-500">
              <span className="font-semibold">URL de l'image:</span> {actualite.image}
            </Typography>
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

export default ActualiteViewDialog;