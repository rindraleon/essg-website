import { Avatar, Card, CardContent, Typography, Box, Grid, Divider } from '@/components/compat/mui';
import { IdCard, Mail, Shield, User } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getImageUrl } from '../../utils/image.utils';
import { useTitle } from '@/hooks/useTitle';
import useScrollToTop from '@/hooks/useScrollToTop';

const Profil: React.FC = () => {
  useScrollToTop();
  useTitle('Profil');
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const [avatarError, setAvatarError] = useState(false);

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
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-ink-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête du profil */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar
                src={!avatarError && user.avatar ? getImageUrl(user.avatar) : undefined}
                onError={() => setAvatarError(true)}
              >
                {(avatarError || !user.avatar) && `${user.prenom[0]}${user.nom[0]}`.toUpperCase()}
              </Avatar>
              <div className="text-center sm:text-left flex-1">
                <Typography variant="h4" className="font-bold text-ink-900 mb-2">
                  {user.prenom} {user.nom}
                </Typography>
                <Box
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-3"
                >
                  {getRoleLabel(user.role)}
                </Box>
                <Typography variant="body2" className="text-ink-600">
                  Membre depuis le {formatDate(user.creeLe)}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-6">
            <Typography
              variant="h6"
              className="font-semibold text-ink-900 mb-4 flex items-center gap-2"
            >
              <User className="text-brand-600" />
              Informations personnelles
            </Typography>
            <Divider className="mb-4" />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="flex items-start gap-3 p-3 bg-ink-50 rounded-lg">
                  <IdCard className="text-ink-500 mt-1 size-4" />
                  <Box className="flex-1">
                    <Typography variant="caption" className="text-ink-500 block mb-1">
                      Nom
                    </Typography>
                    <Typography variant="body1" className="font-medium text-ink-900">
                      {user.nom}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="flex items-start gap-3 p-3 bg-ink-50 rounded-lg">
                  <User className="text-ink-500 mt-1 size-4" />
                  <Box className="flex-1">
                    <Typography variant="caption" className="text-ink-500 block mb-1">
                      Prénom
                    </Typography>
                    <Typography variant="body1" className="font-medium text-ink-900">
                      {user.prenom}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="flex items-start gap-3 p-3 bg-ink-50 rounded-lg">
                  <Mail className="text-ink-500 mt-1 size-4" />
                  <Box className="flex-1">
                    <Typography variant="caption" className="text-ink-500 block mb-1">
                      Email
                    </Typography>
                    <Typography variant="body1" className="font-medium text-ink-900">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="flex items-start gap-3 p-3 bg-ink-50 rounded-lg">
                  <Shield className="text-ink-500 mt-1 size-4" />
                  <Box className="flex-1">
                    <Typography variant="caption" className="text-ink-500 block mb-1">
                      Rôle
                    </Typography>
                    <Typography variant="body1" className="font-medium text-ink-900">
                      {getRoleLabel(user.role)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profil;
