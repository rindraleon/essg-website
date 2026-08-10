import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import type { Admission } from '../../types/admission.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AdmissionDetailDialogProps {
  admission: Admission;
  open: boolean;
  onClose: () => void;
  onEditStatus: () => void;
}

const getStatusColor = (statut: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (statut) {
    case 'accepte':
      return 'default';
    case 'en_attente':
      return 'secondary';
    case 'en_cours_etude':
      return 'outline';
    case 'refuse':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getStatusLabel = (statut: string): string => {
  switch (statut) {
    case 'accepte':
      return 'Accepté';
    case 'en_attente':
      return 'En attente';
    case 'en_cours_etude':
      return "En cours d'étude";
    case 'refuse':
      return 'Refusé';
    default:
      return statut;
  }
};

const AdmissionDetailDialog: React.FC<AdmissionDetailDialogProps> = ({
  admission,
  open,
  onClose,
  onEditStatus,
}) => {
  if (!open) return null;

  const handleOpenCV = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (admission.cvPath) {
      window.open(admission.cvPath, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenLettre = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (admission.lettreMotivationPath) {
      window.open(admission.lettreMotivationPath, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 bg-ink-900 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-ink-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink-900">Détails de la candidature</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600" type="button">
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-ink-900 mb-4 pb-2 border-b border-ink-100">
              Informations personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="block text-sm font-medium text-ink-700 mb-1">Nom complet</p>
                <p className="text-sm text-ink-900">
                  {admission.prenom} {admission.nom}
                </p>
              </div>
              <div>
                <p className="block text-sm font-medium text-ink-700 mb-1">Email</p>
                <p className="text-sm text-ink-900">{admission.email}</p>
              </div>
              <div>
                <p className="block text-sm font-medium text-ink-700 mb-1">Téléphone</p>
                <p className="text-sm text-ink-900">{admission.telephone || 'N/A'}</p>
              </div>
              <div>
                <p className="block text-sm font-medium text-ink-700 mb-1">Date de naissance</p>
                <p className="text-sm text-ink-900">
                  {new Date(admission.dateNaissance).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          {/* Informations académiques */}
          <div>
            <h3 className="text-lg font-semibold text-ink-900 mb-4 pb-2 border-b border-ink-100">
              Informations académiques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="block text-sm font-medium text-ink-700 mb-1">Formation souhaitée</p>
                <p className="text-sm text-ink-900">{admission.formation}</p>
              </div>
              <div>
                <p className="block text-sm font-medium text-ink-700 mb-1">Niveau</p>
                <p className="text-sm text-ink-900 capitalize">{admission.niveau}</p>
              </div>
              <div className="md:col-span-2">
                <p className="block text-sm font-medium text-ink-700 mb-1">
                  Dernier diplôme obtenu
                </p>
                <p className="text-sm text-ink-900">{admission.diplomePrecedent}</p>
              </div>
            </div>
          </div>

          {/* Statut et documents */}
          <div>
            <h3 className="text-lg font-semibold text-ink-900 mb-4 pb-2 border-b border-ink-100">
              Statut et documents
            </h3>
            <div className="space-y-4">
              <div>
                <p className="block text-sm font-medium text-ink-700 mb-2">
                  Statut de la candidature
                </p>
                <Badge variant={getStatusColor(admission.statut)} className="text-xs">
                  {getStatusLabel(admission.statut)}
                </Badge>
              </div>

              {admission.commentaire && (
                <div>
                  <p className="block text-sm font-medium text-ink-700 mb-1">Commentaire</p>
                  <div className="bg-ink-50 rounded-lg p-3">
                    <p className="text-sm text-ink-900 whitespace-pre-wrap">
                      {admission.commentaire}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="block text-sm font-medium text-ink-700 mb-2">CV</p>
                  {admission.cvPath ? (
                    <Button
                      onClick={handleOpenCV}
                      variant="outline"
                      className="w-full"
                      type="button"
                    >
                      <PictureAsPdfIcon className="mr-2 h-4 w-4 text-red-600" />
                      Voir le CV
                      <DownloadIcon className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <p className="text-sm text-ink-500">Aucun CV joint</p>
                  )}
                </div>
                <div>
                  <p className="block text-sm font-medium text-ink-700 mb-2">
                    Lettre de motivation
                  </p>
                  {admission.lettreMotivationPath ? (
                    <Button
                      onClick={handleOpenLettre}
                      variant="outline"
                      className="w-full"
                      type="button"
                    >
                      <PictureAsPdfIcon className="mr-2 h-4 w-4 text-brand-600" />
                      Voir la lettre
                      <DownloadIcon className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <p className="text-sm text-ink-500">Aucune lettre jointe</p>
                  )}
                </div>
              </div>

              <div>
                <p className="block text-sm font-medium text-ink-700 mb-1">Date de candidature</p>
                <p className="text-sm text-ink-900">
                  {new Date(admission.creeLe).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-ink-100">
            <Button onClick={onEditStatus} className="flex-1 bg-brand-600 hover:bg-brand-700">
              Modifier le statut
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionDetailDialog;
