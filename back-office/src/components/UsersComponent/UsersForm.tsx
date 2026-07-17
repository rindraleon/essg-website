import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { toast } from 'sonner';
import { getImageUrl } from '../../utils/image.utils';
import type { User, UserFormData } from '../../types';
import { uploadAvatar } from '../../services';

interface UsersFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData: User | null;
  mode: 'create' | 'edit';
}

const UsersForm: React.FC<UsersFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    motDePasse: '',
    prenom: '',
    nom: '',
    role: 'lecteur',
    estActif: true,
    avatar: undefined,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        email: initialData.email,
        prenom: initialData.prenom,
        nom: initialData.nom,
        role: initialData.role,
        estActif: initialData.estActif,
        avatar: initialData.avatar,
      });
      setAvatarPreview(initialData.avatar ? getImageUrl(initialData.avatar) : null);
    } else if (mode === 'create') {
      setFormData({
        email: '',
        motDePasse: '',
        prenom: '',
        nom: '',
        role: 'lecteur',
        estActif: true,
        avatar: undefined,
      });
      setAvatarPreview(null);
      setAvatarFile(null);
    }
  }, [initialData, mode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Upload avatar first if there's a new file
    if (avatarFile && initialData) {
      try {
        setUploading(true);
        const updatedUser = await uploadAvatar(initialData.id, avatarFile);
        setFormData(prev => ({ ...prev, avatar: updatedUser.avatar }));
        setAvatarPreview(updatedUser.avatar ? getImageUrl(updatedUser.avatar) : null);
        setAvatarFile(null);
      } catch (error) {
        toast.error('Erreur lors de l\'upload de l\'avatar');
        console.error('Error uploading avatar:', error);
        setUploading(false);
        return;
      }
    }

    onSubmit(formData);
    setUploading(false);
  };

  const handleChange = (field: keyof UserFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Format d\'image non supporté. Utilisez JPG, PNG, GIF ou WebP');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (mode === 'edit' && initialData) {
      setFormData(prev => ({ ...prev, avatar: undefined }));
    }
  };

  const getInitials = () => {
    const prenom = formData.prenom || '';
    const nom = formData.nom || '';
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          {mode === 'create' ? 'Nouvel utilisateur' : 'Modifier l\'utilisateur'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Avatar Upload Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={avatarPreview || undefined}
                  sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
                >
                  {!avatarPreview && getInitials()}
                </Avatar>
                {avatarPreview && (
                  <IconButton
                    onClick={handleDeleteAvatar}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: 'error.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'error.dark' },
                    }}
                    size="small"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                )}
              </Box>
              
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCamera />}
                disabled={uploading}
              >
                {avatarPreview ? 'Changer la photo' : 'Ajouter une photo'}
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                />
              </Button>
              {uploading && <CircularProgress size={24} />}
            </Box>

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
              fullWidth
              disabled={mode === 'edit'}
              helperText={mode === 'edit' ? 'L\'email ne peut pas être modifié' : ''}
            />
            
            {mode === 'create' && (
              <TextField
                label="Mot de passe"
                type="password"
                value={formData.motDePasse}
                onChange={handleChange('motDePasse')}
                required
                fullWidth
                helperText="Minimum 6 caractères"
              />
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Prénom"
                value={formData.prenom}
                onChange={handleChange('prenom')}
                required
                fullWidth
              />
              <TextField
                label="Nom"
                value={formData.nom}
                onChange={handleChange('nom')}
                required
                fullWidth
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={formData.role}
                onChange={handleChange('role')}
                label="Rôle"
              >
                <MenuItem value="admin">Administrateur</MenuItem>
                <MenuItem value="editeur">Éditeur</MenuItem>
                <MenuItem value="lecteur">Lecteur</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.estActif}
                  onChange={handleChange('estActif')}
                />
              }
              label="Utilisateur actif"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined" disabled={uploading}>
            Annuler
          </Button>
          <Button type="submit" variant="contained" disabled={uploading}>
            {uploading ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UsersForm;