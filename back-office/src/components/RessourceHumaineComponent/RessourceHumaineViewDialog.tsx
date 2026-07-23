import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { getImageUrl } from '../../utils/image.utils';
import type { RessourceHumaineItem } from '../../types/ressource-humaine.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
                  Détail de la ressource humaine
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
        {/* Photo et nom */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-20 w-20">
            {ressource.photo ? (
              <AvatarImage src={getImageUrl(ressource.photo)} alt={`${ressource.prenom} ${ressource.nom}`} />
            ) : (
              <AvatarFallback className="bg-gray-100 text-gray-700 text-2xl">
                {ressource.prenom[0]}{ressource.nom[0]}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{ressource.prenom} {ressource.nom}</h3>
            <Badge variant="default">
              {ressource.poste}
            </Badge>
          </div>
        </div>

        <hr className="my-4" />

        {/* Contact Information */}
        <div className="space-y-3 mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Informations de contact</h4>
          
          {ressource.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <EmailIcon fontSize="small" className="text-gray-400" />
              <span className="text-sm">{ressource.email}</span>
            </div>
          )}
          
          {ressource.telephone && (
            <div className="flex items-center gap-2 text-gray-600">
              <PhoneIcon fontSize="small" className="text-gray-400" />
              <span className="text-sm">{ressource.telephone}</span>
            </div>
          )}
        </div>

        <hr className="my-4" />

        {/* Description */}
        {ressource.description && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
              {ressource.description}
            </p>
          </div>
        )}

        <hr className="my-4" />

        {/* Metadata */}
        <div className="flex flex-wrap gap-4">
          <Badge variant={ressource.actif ? 'default' : 'secondary'}>
            {ressource.actif ? 'Actif' : 'Inactif'}
          </Badge>
          <Badge variant="outline">
            Ordre: {ressource.ordre}
          </Badge>
        </div>

        {/* Photo URL */}
        {ressource.photo && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <span className="font-semibold">URL de la photo:</span> {ressource.photo}
            </p>
          </div>
        )}
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

export default RessourceHumaineViewDialog;