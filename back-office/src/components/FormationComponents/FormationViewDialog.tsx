import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarsIcon from '@mui/icons-material/Stars';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { getImageUrl } from '../../utils/image.utils';
import type { Formation } from '../../types/formation.types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface FormationViewDialogProps {
  open: boolean;
  onClose: () => void;
  formation: Formation | null;
}

const FormationViewDialog: React.FC<FormationViewDialogProps> = ({ open, onClose, formation }) => {
  if (!formation) return null;

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
                  {formation.image ? (
                    <img
                      src={getImageUrl(formation.image)}
                      alt={formation.titre}
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
                  Fiche formation
                </Badge>

                {formation.enVedette && (
                  <Badge className="rounded-full bg-amber-500 px-3 py-1 text-white">
                    <StarsIcon className="mr-1 h-3.5 w-3.5" />
                    En vedette
                  </Badge>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold leading-tight text-white">{formation.titre}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-white text-slate-900">
                    <SchoolIcon className="mr-1 h-3.5 w-3.5" />
                    {formation.niveau}
                  </Badge>

                  <Badge
                    variant="outline"
                    className="rounded-full border-white/20 bg-white/5 text-white"
                  >
                    {formation.domaine}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-white/80">
                    <AccessTimeIcon className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wide">Durée</span>
                  </div>
                  <p className="text-base font-semibold text-white">{formation.duree}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-white/80">
                    <StarsIcon className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wide">Crédits</span>
                  </div>
                  <p className="text-base font-semibold text-white">{formation.credits} crédits</p>
                </div>
              </div>

              {(formation.responsable || formation.email) && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-3 text-xs uppercase tracking-wide text-white/70">Contact</p>

                  {formation.responsable && (
                    <div className="mb-2 flex items-center gap-2">
                      <PersonOutlineOutlinedIcon className="h-4 w-4 text-white/80" />
                      <span className="text-sm text-white">{formation.responsable}</span>
                    </div>
                  )}

                  {formation.email && (
                    <div className="flex items-center gap-2">
                      <EmailOutlinedIcon className="h-4 w-4 text-white/80" />
                      <a
                        href={`mailto:${formation.email}`}
                        className="break-all text-sm text-white underline-offset-4 hover:underline"
                      >
                        {formation.email}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* Colonne droite */}
          <section className="flex min-h-0 flex-col">
            {/* Header */}
            <DialogHeader className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 lg:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    Détails de la formation
                  </DialogTitle>
                  <p className="mt-1 text-sm text-slate-500">
                    Présentation complète de la formation
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
                    {formation.image ? (
                      <img
                        src={getImageUrl(formation.image)}
                        alt={formation.titre}
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
                    <h2 className="mb-3 text-2xl font-bold text-slate-900">{formation.titre}</h2>

                    <div className="mb-4 flex flex-wrap gap-2">
                      <Badge className="gap-1 rounded-full">
                        <SchoolIcon className="h-3.5 w-3.5" />
                        {formation.niveau}
                      </Badge>

                      <Badge variant="outline" className="rounded-full">
                        {formation.domaine}
                      </Badge>

                      {formation.enVedette && (
                        <Badge className="gap-1 rounded-full bg-amber-500 text-white">
                          <StarsIcon className="h-3.5 w-3.5" />
                          En vedette
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Durée</p>
                        <p className="text-sm font-semibold text-slate-900">{formation.duree}</p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Crédits</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {formation.credits} crédits
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                {/* Colonne principale */}
                <div className="space-y-5">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                      Description
                    </h3>
                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                      {formation.description}
                    </p>
                  </div>

                  {formation.conditionsAcces && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        Conditions d&apos;accès
                      </h3>
                      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                        {formation.conditionsAcces}
                      </p>
                    </div>
                  )}
                </div>

                {/* Colonne secondaire */}
                <div className="grid content-start gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  {formation.objectifs && formation.objectifs.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        Objectifs
                      </h3>
                      <ul className="space-y-2">
                        {formation.objectifs.map((objectif) => (
                          <li key={objectif} className="text-sm leading-6 text-slate-600">
                            • {objectif}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {formation.debouches && formation.debouches.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        Débouchés
                      </h3>
                      <ul className="space-y-2">
                        {formation.debouches.map((debouche) => (
                          <li key={debouche} className="text-sm leading-6 text-slate-600">
                            • {debouche}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {formation.programme && formation.programme.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2 xl:col-span-1">
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        Programme
                      </h3>
                      <ul className="space-y-2">
                        {formation.programme.map((module) => (
                          <li key={module} className="text-sm leading-6 text-slate-600">
                            • {module}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(formation.responsable || formation.email) && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden sm:col-span-2 xl:col-span-1">
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        Contact
                      </h3>

                      {formation.responsable && (
                        <div className="mb-3">
                          <p className="text-xs text-slate-500">Responsable</p>
                          <p className="text-sm font-medium text-slate-900">
                            {formation.responsable}
                          </p>
                        </div>
                      )}

                      {formation.email && (
                        <div>
                          <p className="text-xs text-slate-500">Email</p>
                          <a
                            href={`mailto:${formation.email}`}
                            className="break-all text-sm font-medium text-slate-900 hover:underline"
                          >
                            {formation.email}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-end border-t border-slate-200 bg-white px-5 py-4 lg:px-6">
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

export default FormationViewDialog;
