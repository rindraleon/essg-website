import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { getImageUrl } from '../../utils/image.utils';
import type { User } from '../../types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UsersViewDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UsersViewDialog: React.FC<UsersViewDialogProps> = ({ open, onClose, user }) => {
  if (!user) return null;


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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'editeur':
        return 'secondary';
      default:
        return 'outline';
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
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="
          !w-[96vw]
          !max-w-6xl
          !h-[90vh]
          !max-h-[90vh]
          gap-0
          overflow-hidden
          rounded-[30px]
          border-2 border-slate-200
          bg-white
          p-0
          shadow-[0_24px_80px_rgba(15,23,42,0.35)]
          [&>button]:hidden
        "
      >
        <div className="flex min-h-0 flex-col">
          <DialogHeader className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 lg:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <DialogTitle className="text-xl font-bold text-slate-900">
                  Détails de l'utilisateur
                </DialogTitle>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 shrink-0 rounded-full border border-slate-200 bg-white hover:bg-slate-100"
                aria-label="Fermer"
              >
                <CloseIcon className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 lg:px-6">
          {/* Avatar and basic info */}
          <div className="flex flex-col items-center gap-3 pb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl || undefined} alt="Avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.prenom} {user.nom}
              </h3>
              <p className="text-sm text-gray-500">
                {user.email}
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Prénom</p>
              <p className="text-sm font-medium text-gray-900">
                {user.prenom}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Nom</p>
              <p className="text-sm font-medium text-gray-900">
                {user.nom}
              </p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm font-medium text-gray-900">
              {user.email}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Rôle</p>
              <Badge 
                variant={getRoleBadgeVariant(user.role)}
                className="mt-1"
              >
                {getRoleLabel(user.role)}
              </Badge>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Statut</p>
              <Badge 
                variant={user.estActif ? 'default' : 'outline'}
                className="mt-1"
              >
                {user.estActif ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Créé le</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(user.creeLe)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Mis à jour le</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(user.misAJourLe)}
              </p>
            </div>
          </div>
          </div>

          <div className="flex shrink-0 items-center justify-end border-t border-slate-200 bg-white px-5 py-4 lg:px-6">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="rounded-xl"
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsersViewDialog;