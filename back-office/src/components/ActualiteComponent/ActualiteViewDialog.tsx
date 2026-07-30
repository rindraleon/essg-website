import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import LabelIcon from '@mui/icons-material/Label';
import StarIcon from '@mui/icons-material/Star';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
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
        <div className="grid h-full min-h-0 lg:grid-cols-[360px_minmax(0,1fr)]">
          {/* Colonne gauche desktop */}
          <aside className="hidden min-h-0 flex-col border-r border-slate-200 bg-slate-950 p-5 text-white lg:flex">
            {/* Image 16/9 en haut gauche */}
            <div className="w-full self-start">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                <div className="aspect-[16/9] w-full bg-slate-800">
                  {actualite.image ? (
                    <img
                      src={getImageUrl(actualite.image)}
                      alt={actualite.titre}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                      <div className="text-center">
                        <ImageOutlinedIcon className="mx-auto mb-2 h-12 w-12 text-slate-500" />
                        <p className="text-sm text-slate-400">Aucune image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Texte séparé de l'image pour meilleure lisibilité */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Badge className="rounded-full bg-white/10 px-3 py-1 text-white">
                  Actualité
                </Badge>

                {actualite.enVedette && (
                  <Badge className="rounded-full bg-amber-500 px-3 py-1 text-white">
                    <StarIcon className="mr-1 h-3.5 w-3.5" />
                    En vedette
                  </Badge>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold leading-tight text-white">
                  {actualite.titre}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-white text-slate-900">
                    <LabelIcon className="mr-1 h-3.5 w-3.5" />
                    {actualite.categorie}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-white/80">
                    <PersonIcon className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wide">
                      Auteur
                    </span>
                  </div>
                  <p className="text-base font-semibold text-white">
                    {actualite.auteur}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-white/80">
                    <CalendarTodayIcon className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wide">
                      Date
                    </span>
                  </div>
                  <p className="text-base font-semibold text-white">
                    {new Date(actualite.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-2 text-xs uppercase tracking-wide text-white/70">
                  Statut
                </p>
                <div className="mt-1">
                  <StatusBadge status={actualite.statut} />
                </div>
              </div>
            </div>
          </aside>

          {/* Colonne droite */}
          <section className="flex min-h-0 flex-col">
            {/* Header */}
            <DialogHeader className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 lg:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    Détail de l'actualité
                  </DialogTitle>
                  <p className="mt-1 text-sm text-slate-500">
                    Présentation complète de l'actualité
                  </p>
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

            {/* Body scrollable */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 lg:px-6">
              {/* Version mobile */}
              <div className="mb-5 lg:hidden">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="aspect-[16/9] w-full bg-slate-100">
                    {actualite.image ? (
                      <img
                        src={getImageUrl(actualite.image)}
                        alt={actualite.titre}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <ImageOutlinedIcon className="h-14 w-14 text-slate-400" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="mb-3 text-2xl font-bold text-slate-900">
                      {actualite.titre}
                    </h2>

                    <div className="mb-4 flex flex-wrap gap-2">
                      <Badge className="gap-1 rounded-full">
                        <LabelIcon className="h-3.5 w-3.5" />
                        {actualite.categorie}
                      </Badge>

                      {actualite.enVedette && (
                        <Badge className="gap-1 rounded-full bg-amber-500 text-white">
                          <StarIcon className="h-3.5 w-3.5" />
                          En vedette
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Auteur</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {actualite.auteur}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Date</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {new Date(actualite.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-slate-500">Statut</p>
                      <div className="mt-1">
                        <StatusBadge status={actualite.statut} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                {/* Colonne principale */}
                <div className="space-y-5">
                  {actualite.resume && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        Résumé
                      </h3>
                      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                        {actualite.resume}
                      </p>
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                      Contenu complet
                    </h3>
                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                      {actualite.contenu}
                    </p>
                  </div>
                </div>

                {/* Colonne secondaire */}
                <div className="grid content-start gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                      Informations
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500">Auteur</p>
                        <p className="text-sm font-medium text-slate-900">
                          {actualite.auteur}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Date de publication</p>
                        <p className="text-sm font-medium text-slate-900">
                          {new Date(actualite.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Catégorie</p>
                        <p className="text-sm font-medium text-slate-900">
                          {actualite.categorie}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Statut</p>
                        <div className="mt-1">
                          <StatusBadge status={actualite.statut} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
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
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActualiteViewDialog;