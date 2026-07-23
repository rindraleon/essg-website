import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import LabelIcon from '@mui/icons-material/Label';
import StarIcon from '@mui/icons-material/Star';
import { getImageUrl } from '../../utils/image.utils';
import type { ActualiteItem } from '../../types/actualite.types';
import StatusBadge from '../common/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

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
                  Détail de l'actualité
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
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {actualite.titre}
          </h2>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 mb-4">
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
          </div>

          <hr className="my-4 border-gray-200" />

          {/* Resume */}
          {actualite.resume && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2 text-sm">
                Résumé
              </h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">
                {actualite.resume}
              </p>
            </div>
          )}

          {/* Featured Badge */}
          {actualite.enVedette && (
            <div className="mb-4">
              <Badge variant="default" className="font-medium">
                <StarIcon className="h-3 w-3 mr-1" />
                Actualité en vedette
              </Badge>
            </div>
          )}

          <hr className="my-4 border-gray-200" />

          {/* Content */}
          <div className="mb-2">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm">
              Contenu complet
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {actualite.contenu}
            </p>
          </div>

          {/* Image URL */}
          {actualite.image && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                <span className="font-semibold">URL de l'image:</span> {actualite.image}
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

export default ActualiteViewDialog;