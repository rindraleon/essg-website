import { Calendar, Image, Star, Tag, User, X } from 'lucide-react';
import React from 'react';
import { getImageUrl } from '../../utils/image.utils';
import type { ActualiteItem } from '../../types/actualite.types';
import StatusBadge from '../common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ActualiteViewDialogProps {
  open: boolean;
  onClose: () => void;
  actualite: ActualiteItem | null;
}

const ActualiteViewDialog: React.FC<ActualiteViewDialogProps> = ({ open, onClose, actualite }) => {
  if (!actualite) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="
          !w-[96vw]
          !max-w-[calc(100%-1rem)]
          sm:!max-w-6xl
          !h-[90vh]
          !max-h-[90vh]
          gap-0
          overflow-hidden
          rounded-[30px]
          border-2 border-ink-100
          bg-white
          p-0
          shadow-[0_24px_80px_rgba(15,23,42,0.35)]
          [&>button]:hidden
        "
      >
        <div className="grid h-full min-h-0 lg:grid-cols-[360px_minmax(0,1fr)]">
          {/* Colonne gauche desktop */}
          <aside className="hidden min-h-0 flex-col border-r border-ink-100 bg-ink-950 p-5 text-white lg:flex">
            {/* Image 16/9 en haut gauche */}
            <div className="w-full self-start">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                <div className="aspect-[16/9] w-full bg-ink-800">
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
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900">
                      <div className="text-center">
                        <Image className="mx-auto mb-2 h-12 w-12 text-ink-500" />
                        <p className="text-sm text-ink-400">Aucune image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Texte séparé de l'image pour meilleure lisibilité */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Badge className="rounded-full bg-white/10 px-3 py-1 text-white">Actualité</Badge>

                {actualite.enVedette && (
                  <Badge className="rounded-full bg-sage-500 px-3 py-1 text-white">
                    <Star className="mr-1 h-3.5 w-3.5" />
                    En vedette
                  </Badge>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold leading-tight text-white">{actualite.titre}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-white text-ink-900">
                    <Tag className="mr-1 h-3.5 w-3.5" />
                    {actualite.categorie}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-white/80">
                    <User className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wide">Auteur</span>
                  </div>
                  <p className="text-base font-semibold text-white">{actualite.auteur}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-white/80">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wide">Date</span>
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
                <p className="mb-2 text-xs uppercase tracking-wide text-white/70">Statut</p>
                <div className="mt-1">
                  <StatusBadge status={actualite.statut} />
                </div>
              </div>
            </div>
          </aside>

          {/* Colonne droite */}
          <section className="flex min-h-0 flex-col">
            {/* Header */}
            <DialogHeader className="shrink-0 border-b border-ink-100 bg-white px-5 py-4 lg:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <DialogTitle className="text-xl font-bold text-ink-900">
                    Détail de l'actualité
                  </DialogTitle>
                  <p className="mt-1 text-sm text-ink-500">Présentation complète de l'actualité</p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-10 w-10 shrink-0 rounded-full border border-ink-100 bg-white hover:bg-ink-100"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            {/* Body scrollable */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 lg:px-6">
              {/* Version mobile */}
              <div className="mb-5 lg:hidden">
                <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
                  <div className="aspect-[16/9] w-full bg-ink-100">
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
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-100 to-ink-100">
                        <Image className="h-14 w-14 text-ink-400" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="mb-3 text-2xl font-bold text-ink-900">{actualite.titre}</h2>

                    <div className="mb-4 flex flex-wrap gap-2">
                      <Badge className="gap-1 rounded-full">
                        <Tag className="h-3.5 w-3.5" />
                        {actualite.categorie}
                      </Badge>

                      {actualite.enVedette && (
                        <Badge className="gap-1 rounded-full bg-sage-500 text-white">
                          <Star className="h-3.5 w-3.5" />
                          En vedette
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-ink-50 p-3">
                        <p className="text-xs text-ink-500">Auteur</p>
                        <p className="text-sm font-semibold text-ink-900">{actualite.auteur}</p>
                      </div>

                      <div className="rounded-xl bg-ink-50 p-3">
                        <p className="text-xs text-ink-500">Date</p>
                        <p className="text-sm font-semibold text-ink-900">
                          {new Date(actualite.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-ink-500">Statut</p>
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
                    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-700">
                        Résumé
                      </h3>
                      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-ink-600">
                        {actualite.resume}
                      </p>
                    </div>
                  )}

                  <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-700">
                      Contenu complet
                    </h3>
                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-ink-600">
                      {actualite.contenu}
                    </p>
                  </div>
                </div>

                {/* Colonne secondaire */}
                <div className="grid content-start gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-700">
                      Informations
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-ink-500">Auteur</p>
                        <p className="text-sm font-medium text-ink-900">{actualite.auteur}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-500">Date de publication</p>
                        <p className="text-sm font-medium text-ink-900">
                          {new Date(actualite.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-500">Catégorie</p>
                        <p className="text-sm font-medium text-ink-900">{actualite.categorie}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-500">Statut</p>
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
            <div className="flex shrink-0 items-center justify-end border-t border-ink-100 bg-white px-5 py-4 lg:px-6">
              <Button type="button" onClick={onClose} variant="outline" className="rounded-xl">
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
