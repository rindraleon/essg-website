import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Grid as MuiGrid,
  Avatar,
  Divider,
} from '@mui/material';
import { getImageUrl } from '../../utils/image.utils';
import type { User } from '../../types';

interface UsersViewDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UsersViewDialog: React.FC<UsersViewDialogProps> = ({ open, onClose, user }) => {
  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'editeur':
        return 'primary';
      case 'lecteur':
        return 'default';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'editeur':
        return 'Éditeur';
      case 'lecteur':
        return 'Lecteur';
      default:
        return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getInitials = () => {
    const prenom = user.prenom || '';
    const nom = user.nom || '';
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const avatarUrl = user.avatar ? getImageUrl(user.avatar) : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          Détails de l'utilisateur
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {/* Avatar and basic info */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, pb: 2 }}>
            <Avatar
              src={avatarUrl || undefined}
              sx={{ width: 120, height: 120, bgcolor: 'primary.main', fontSize: '3rem' }}
            >
              {getInitials()}
            </Avatar>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={600}>
                {user.prenom} {user.nom}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Details Grid */}
          <MuiGrid container spacing={2}>
            <MuiGrid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Prénom
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {user.prenom}
                </Typography>
              </Box>
            </MuiGrid>
            <MuiGrid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Nom
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {user.nom}
                </Typography>
              </Box>
            </MuiGrid>
          </MuiGrid>

          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Email
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {user.email}
            </Typography>
          </Box>

          <MuiGrid container spacing={2}>
            <MuiGrid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Rôle
                </Typography>
                <Chip
                  label={getRoleLabel(user.role)}
                  color={getRoleColor(user.role)}
                  size="small"
                  sx={{ fontWeight: 500, mt: 0.5 }}
                />
              </Box>
            </MuiGrid>
            <MuiGrid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Statut
                </Typography>
                <Chip
                  label={user.estActif ? 'Actif' : 'Inactif'}
                  color={user.estActif ? 'success' : 'default'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </MuiGrid>
          </MuiGrid>

          <Divider />

          <MuiGrid container spacing={2}>
            <MuiGrid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Créé le
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatDate(user.creeLe)}
                </Typography>
              </Box>
            </MuiGrid>
            <MuiGrid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Mis à jour le
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatDate(user.misAJourLe)}
                </Typography>
              </Box>
            </MuiGrid>
          </MuiGrid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsersViewDialog;