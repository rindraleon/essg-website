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
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarsIcon from '@mui/icons-material/Stars';
import { getImageUrl } from '../../utils/image.utils';
import type { Formation } from '../../types/formation.types';

interface FormationViewDialogProps {
  open: boolean;
  onClose: () => void;
  formation: Formation | null;
}

const FormationViewDialog: React.FC<FormationViewDialogProps> = ({
  open,
  onClose,
  formation,
}) => {
  if (!formation) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <span className="text-xl font-bold">Détails de la formation</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box className="space-y-4">
          {/* Header */}
          <Box>
            <Typography variant="h5" className="font-bold text-gray-900 mb-2">
              {formation.titre}
            </Typography>
            <Box className="flex flex-wrap gap-2">
              <Chip
                icon={<SchoolIcon />}
                label={formation.niveau}
                color="primary"
                size="small"
              />
              <Chip
                label={formation.domaine}
                variant="outlined"
                size="small"
              />
              {formation.enVedette && (
                <Chip
                  icon={<StarsIcon />}
                  label="En vedette"
                  color="warning"
                  size="small"
                />
              )}
            </Box>
          </Box>

          <Divider />

          {/* Image de la formation */}
          {formation.image && (
            <Box className="mb-4">
              <img
                src={getImageUrl(formation.image)}
                alt={formation.titre}
                className="w-full h-64 object-cover rounded-lg border border-gray-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </Box>
          )}

          {/* Informations générales */}
          <Box className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <AccessTimeIcon sx={{ color: '#6b7280' }} />
              <div>
                <Typography variant="caption" className="text-gray-500 block">
                  Durée
                </Typography>
                <Typography variant="body2" className="font-medium">
                  {formation.duree}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <StarsIcon sx={{ color: '#6b7280' }} />
              <div>
                <Typography variant="caption" className="text-gray-500 block">
                  Crédits
                </Typography>
                <Typography variant="body2" className="font-medium">
                  {formation.credits} crédits
                </Typography>
              </div>
            </div>
          </Box>

          <Divider />

          {/* Description */}
          <Box>
            <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
              Description
            </Typography>
            <Typography variant="body2" className="text-gray-600 whitespace-pre-wrap">
              {formation.description}
            </Typography>
          </Box>

          {/* Conditions d'accès */}
          {formation.conditionsAcces && (
            <Box>
              <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
                Conditions d'accès
              </Typography>
              <Typography variant="body2" className="text-gray-600 whitespace-pre-wrap">
                {formation.conditionsAcces}
              </Typography>
            </Box>
          )}

          {/* Objectifs */}
          {formation.objectifs && formation.objectifs.length > 0 && (
            <Box>
              <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
                Objectifs
              </Typography>
              <Box className="list-disc list-inside space-y-1">
                {formation.objectifs.map((objectif) => (
                  <Typography key={objectif} 
                  variant="body2" 
                    className="text-gray-600">
                    {objectif}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {/* Débouchés */}
          {formation.debouches && formation.debouches.length > 0 && (
            <Box>
              <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
                Débouchés
              </Typography>
              <Box className="list-disc list-inside space-y-1">
                {formation.debouches.map((debouche) => (
                  <Typography key={debouche} variant="body2" className="text-gray-600">
                    {debouche}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {/* Programme */}
          {formation.programme && formation.programme.length > 0 && (
            <Box>
              <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
                Programme
              </Typography>
              <Box className="space-y-1">
                {formation.programme.map((module) => (
                  <Typography key={module} variant="body2" className="text-gray-600">
                    • {module}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {/* Informations supplémentaires */}
          {(formation.responsable || formation.email) && (
            <Box>
              <Divider className="my-3" />
              <Box className="flex flex-wrap gap-4">
                {formation.responsable && (
                  <div>
                    <Typography variant="caption" className="text-gray-500">
                      Responsable
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {formation.responsable}
                    </Typography>
                  </div>
                )}
                {formation.email && (
                  <div>
                    <Typography variant="caption" className="text-gray-500">
                      Email
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {formation.email}
                    </Typography>
                  </div>
                )}
              </Box>
            </Box>
          )}
        </Box>
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

export default FormationViewDialog;