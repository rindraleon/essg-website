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
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import { getImageUrl } from '../../utils/image.utils';
import type { RessourceHumaineItem } from '../../types/ressource-humaine.types';

interface RessourceHumaineViewDialogProps {
  open: boolean;
  onClose: () => void;
  ressource: RessourceHumaineItem | null;
}

const RessourceHumaineViewDialog: React.FC<RessourceHumaineViewDialogProps> = ({
  open,
  onClose,
  ressource,
}) => {
  if (!ressource) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <span className="text-xl font-bold">Détail de la ressource humaine</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Photo et nom */}
        <Box className="flex items-start gap-4 mb-4">
          <Avatar
            src={ressource.photo ? getImageUrl(ressource.photo) : undefined}
            alt={`${ressource.prenom} ${ressource.nom}`}
            sx={{ width: 80, height: 80 }}
          >
            {ressource.prenom[0]}{ressource.nom[0]}
          </Avatar>
          <Box className="flex-1">
            <Typography variant="h5" className="font-bold mb-1">
              {ressource.prenom} {ressource.nom}
            </Typography>
            <Chip
              icon={<WorkIcon />}
              label={ressource.poste}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>
        </Box>

        <Divider className="my-4" />

        {/* Contact Information */}
        <Box className="space-y-3 mb-4">
          <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
            Informations de contact
          </Typography>
          
          {ressource.email && (
            <Box className="flex items-center gap-2 text-gray-600">
              <EmailIcon fontSize="small" className="text-gray-400" />
              <span className="text-sm">{ressource.email}</span>
            </Box>
          )}
          
          {ressource.telephone && (
            <Box className="flex items-center gap-2 text-gray-600">
              <PhoneIcon fontSize="small" className="text-gray-400" />
              <span className="text-sm">{ressource.telephone}</span>
            </Box>
          )}
        </Box>

        <Divider className="my-4" />

        {/* Description */}
        {ressource.description && (
          <Box className="mb-4">
            <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
              Description
            </Typography>
            <Typography variant="body2" className="text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
              {ressource.description}
            </Typography>
          </Box>
        )}

        <Divider className="my-4" />

        {/* Metadata */}
        <Box className="flex flex-wrap gap-4">
          <Chip
            label={ressource.actif ? 'Actif' : 'Inactif'}
            color={ressource.actif ? 'success' : 'default'}
            size="small"
          />
          <Chip
            label={`Ordre: ${ressource.ordre}`}
            size="small"
            variant="outlined"
          />
        </Box>

        {/* Photo URL */}
        {ressource.photo && (
          <Box className="mt-4 pt-4 border-t border-gray-200">
            <Typography variant="caption" className="text-gray-500">
              <span className="font-semibold">URL de la photo:</span> {ressource.photo}
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

export default RessourceHumaineViewDialog;