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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LabelIcon from '@mui/icons-material/Label';
import LanguageIcon from '@mui/icons-material/Language';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { getImageUrl } from '../../utils/image.utils';
import type { Partenaire } from '../../types/partenaire.types';
import { formatDate } from '../../utils/partenaire.utils';
import { PARTENAIRE_TYPE_COLORS } from '../../constants/partenaire.constants';

interface PartenaireViewDialogProps {
  open: boolean;
  onClose: () => void;
  partenaire: Partenaire | null;
}

const PartenaireViewDialog: React.FC<PartenaireViewDialogProps> = ({
  open,
  onClose,
  partenaire,
}) => {
  if (!partenaire) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <span className="text-xl font-bold">Détail du partenaire</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Logo and Title */}
        <Box className="flex items-center gap-4 mb-4">
          <Avatar
            src={partenaire.logo && (partenaire.logo.startsWith('/uploads/') || partenaire.logo.startsWith('http')) ? getImageUrl(partenaire.logo) : undefined}
            sx={{ width: 80, height: 80, fontSize: '3rem', backgroundColor: '#f3f4f6' }}
            variant="rounded"
          >
            {partenaire.logo}
          </Avatar>
          <Box>
            <Typography variant="h5" className="font-bold mb-1">
              {partenaire.nom}
            </Typography>
            <Chip
              label={partenaire.type}
              size="small"
              color={PARTENAIRE_TYPE_COLORS[partenaire.type] || 'default'}
              sx={{ borderRadius: '6px', fontWeight: 500 }}
            />
          </Box>
        </Box>

        <Divider className="my-4" />

        {/* Metadata */}
        <Box className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <LabelIcon fontSize="small" />
            <span className="font-medium">Secteur:</span>
            <span>{partenaire.secteur}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <CalendarTodayIcon fontSize="small" />
            <span className="font-medium">Depuis:</span>
            <span>{formatDate(partenaire.dateDebut)}</span>
          </div>
        </Box>

        <Divider className="my-4" />

        {/* Description */}
        <Box className="mb-4">
          <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
            Description
          </Typography>
          <Typography variant="body1" className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {partenaire.description}
          </Typography>
        </Box>

        <Divider className="my-4" />

        {/* Contact Information */}
        <Box className="space-y-3">
          {partenaire.siteWeb && (
            <Box className="flex items-center gap-2">
              <LanguageIcon fontSize="small" className="text-gray-600" />
              <Typography variant="body2" className="text-gray-700">
                <span className="font-semibold">Site web:</span>{' '}
                <a
                  href={partenaire.siteWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {partenaire.siteWeb}
                </a>
              </Typography>
            </Box>
          )}

          {partenaire.contact && (
            <Box className="flex items-center gap-2">
              <ContactMailIcon fontSize="small" className="text-gray-600" />
              <Typography variant="body2" className="text-gray-700">
                <span className="font-semibold">Contact:</span> {partenaire.contact}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Logo Info */}
        <Box className="mt-4 pt-4 border-t border-gray-200">
          <Box className="flex items-center gap-2">
            <Typography variant="subtitle2" className="font-semibold text-gray-700">
              Logo
            </Typography>
          </Box>
          <Box className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
            {partenaire.logo && (partenaire.logo.startsWith('/uploads/') || partenaire.logo.startsWith('http')) ? (
              <Box>
                <Typography variant="caption" className="text-gray-600 block mb-2">
                  <span className="font-semibold">Image:</span> {partenaire.logo}
                </Typography>
                <img
                  src={getImageUrl(partenaire.logo)}
                  alt={`Logo de ${partenaire.nom}`}
                  style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                />
              </Box>
            ) : (
              <Typography variant="caption" className="text-gray-600">
                <span className="font-semibold">Emoji:</span> {partenaire.logo || 'Aucun'}
              </Typography>
            )}
          </Box>
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

export default PartenaireViewDialog;