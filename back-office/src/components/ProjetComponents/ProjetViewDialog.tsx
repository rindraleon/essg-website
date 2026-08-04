import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LabelIcon from '@mui/icons-material/Label';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MapPicker from '../common/MapPicker';
import { getImageUrl } from '../../utils/image.utils';
import type { Projet } from '../../types/projet.types';
import { getTypeColor, formatDateLong } from '../../utils/projet.utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ProjetViewDialogProps {
  open: boolean;
  onClose: () => void;
  projet: Projet | null;
}

const getTypeBadgeDarkClass = (typeColor: string) => {
  switch (typeColor) {
    case 'primary':
      return 'bg-blue-500 text-white';
    case 'success':
      return 'bg-emerald-500 text-white';
    case 'secondary':
      return 'bg-violet-500 text-white';
    case 'warning':
      return 'bg-amber-500 text-white';
    default:
      return 'border border-white/20 bg-white/10 text-white';
  }
};

const getTypeBadgeLightClass = (typeColor: string) => {
  switch (typeColor) {
    case 'primary':
      return 'border-0 bg-blue-100 text-blue-700 hover:bg-blue-100';
    case 'success':
      return 'border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
    case 'secondary':
      return 'border-0 bg-violet-100 text-violet-700 hover:bg-violet-100';
    case 'warning':
      return 'border-0 bg-amber-100 text-amber-700 hover:bg-amber-100';
    default:
      return 'border-0 bg-slate-100 text-slate-700 hover:bg-slate-100';
  }
};

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
    <div className="mb-3 flex items-center gap-2">
      {icon}
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h3>
    </div>
    {children}
  </div>
);

interface ProjectImageCardProps {
  image?: string | null;
  title: string;
  dark?: boolean;
}

const ProjectImageCard: React.FC<ProjectImageCardProps> = ({ image, title, dark = false }) => {
  const [hasError, setHasError] = React.useState(false);
  const showImage = Boolean(image) && !hasError;

  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-[0_12px_30px_rgba(0,0,0,0.12)] ${
        dark ? 'border-white/10 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'
      }`}
    >
      <div className={`aspect-[16/9] w-full ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        {showImage ? (
          <img
            src={getImageUrl(image!)}
            alt={title}
            className="h-full w-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center ${
              dark
                ? 'bg-gradient-to-br from-slate-800 to-slate-900'
                : 'bg-gradient-to-br from-slate-100 to-slate-200'
            }`}
          >
            <div className="text-center">
              <ImageOutlinedIcon
                className={`mx-auto mb-2 h-12 w-12 ${dark ? 'text-slate-500' : 'text-slate-400'}`}
              />
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                Aucune image
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProjetViewDialog: React.FC<ProjetViewDialogProps> = ({ open, onClose, projet }) => {
  if (!projet) return null;

  const typeColor = getTypeColor(projet.type);

  // ✅ Condition corrigée : accepte 0 comme valeur valide
  const hasLocation =
    projet.latitude !== null &&
    projet.latitude !== undefined &&
    projet.longitude !== null &&
    projet.longitude !== undefined;

  const locationText = [projet.ville, projet.pays].filter(Boolean).join(', ');
  const hasAddressBlock = Boolean(projet.adresse || locationText);

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
          border border-slate-200
          bg-gradient-to-br from-white via-slate-50 to-slate-100
          p-0
          shadow-[0_24px_80px_rgba(15,23,42,0.35)]
          [&>button]:hidden
        "
      >
        <div className="grid h-full min-h-0 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="hidden min-h-0 flex-col border-r border-slate-200 bg-slate-950 p-5 text-white lg:flex">
            <ProjectImageCard image={projet.image} title={projet.titre} dark />

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Badge className="rounded-full bg-white/10 px-3 py-1 text-white">
                  Fiche projet
                </Badge>

                <Badge className={`rounded-full px-3 py-1 ${getTypeBadgeDarkClass(typeColor)}`}>
                  <LabelIcon className="mr-1 h-3.5 w-3.5" />
                  {projet.type}
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl font-bold leading-tight text-white">{projet.titre}</h2>

                <div className="mt-3 space-y-2 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <CalendarTodayIcon className="h-4 w-4" />
                    <span>{formatDateLong(projet.date)}</span>
                  </div>

                  {locationText && (
                    <div className="flex items-center gap-2">
                      <LocationOnIcon className="h-4 w-4" />
                      <span>{locationText}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          <section className="flex min-h-0 flex-col">
            <DialogHeader className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 lg:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    Détails du projet
                  </DialogTitle>
                  <p className="mt-1 text-sm text-slate-500">Présentation complète du projet</p>
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
              <div className="mb-5 lg:hidden">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <ProjectImageCard image={projet.image} title={projet.titre} />

                  <div className="p-4">
                    <h2 className="mb-3 text-2xl font-bold text-slate-900">{projet.titre}</h2>

                    <div className="mb-3 flex flex-wrap gap-2">
                      <Badge className={`rounded-full ${getTypeBadgeLightClass(typeColor)}`}>
                        <LabelIcon className="mr-1 h-3.5 w-3.5" />
                        {projet.type}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarTodayIcon className="h-4 w-4" />
                        <span>{formatDateLong(projet.date)}</span>
                      </div>

                      {locationText && (
                        <div className="flex items-center gap-2">
                          <LocationOnIcon className="h-4 w-4" />
                          <span>{locationText}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Contenu principal ── */}
              <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                {/* Colonne principale */}
                <div className="space-y-5">
                  <SectionCard title="Description">
                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                      {projet.description}
                    </p>
                  </SectionCard>

                  {projet.partenaires && projet.partenaires.length > 0 && (
                    <SectionCard title="Partenaires">
                      <div className="flex flex-wrap gap-2">
                        {projet.partenaires.map((partenaire) => (
                          <Badge key={partenaire} variant="outline" className="rounded-full">
                            {partenaire}
                          </Badge>
                        ))}
                      </div>
                    </SectionCard>
                  )}
                </div>

                {/* Colonne secondaire */}
                <div className="space-y-4">
                  {hasAddressBlock && (
                    <SectionCard
                      title="Adresse"
                      icon={<LocationOnIcon className="h-4 w-4 text-slate-500" />}
                    >
                      <div className="space-y-1 text-sm text-slate-600">
                        {projet.adresse && <p className="break-words">{projet.adresse}</p>}
                        {locationText && <p>{locationText}</p>}
                      </div>
                    </SectionCard>
                  )}

                  {hasLocation && (
                    <SectionCard
                      title="Localisation"
                      icon={<LocationOnIcon className="h-4 w-4 text-slate-500" />}
                    >
                      <div className="w-full overflow-hidden rounded-xl border border-slate-200 aspect-[16/9]">
                        <MapPicker
                          latitude={Number(projet.latitude)}
                          longitude={Number(projet.longitude)}
                          onLocationChange={() => {}}
                          label=""
                        />
                      </div>
                    </SectionCard>
                  )}
                </div>
              </div>
            </div>

            {/* Footer fixe */}
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

export default ProjetViewDialog;
