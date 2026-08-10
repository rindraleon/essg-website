// src/components/AdmissionComponents/AdmissionTable.tsx
import React, { useMemo } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import type { Admission } from '../../types/admission.types';
import DataTable from '../common/DataTable';
import type { Column } from '../common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AdmissionTableProps {
  data: Admission[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onView: (admission: Admission) => void;
  onEdit: (admission: Admission) => void;
  onDelete: (id: number) => void;
  onDownloadCV?: (admission: Admission) => void;
  onDownloadLettre?: (admission: Admission) => void;
  loading?: boolean;
  emptyMessage?: string;
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

const AdmissionTable: React.FC<AdmissionTableProps> = ({
  data,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onEdit,
  onDelete,
  onDownloadCV,
  onDownloadLettre,
  loading = false,
  emptyMessage = 'Aucune admission trouvée',
}) => {
  const columns = useMemo<Column<Admission>[]>(
    () => [
      {
        id: 'candidat',
        label: 'Candidat',
        minWidth: 250,
        render: (row) => (
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-brand-600">
                  {row.nom
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-ink-900 block">
                  {row.nom} {row.prenom}
                </span>
                <p className="text-xs text-ink-500 truncate">{row.email}</p>
                <p className="text-xs text-ink-500">{row.telephone}</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'formation',
        label: 'Formation',
        minWidth: 200,
        render: (row) => (
          <div>
            <span className="text-sm text-ink-900 font-medium">{row.formation}</span>
            <p className="text-xs text-ink-500 capitalize">{row.niveau}</p>
          </div>
        ),
      },
      {
        id: 'statut',
        label: 'Statut',
        minWidth: 140,
        align: 'center',
        render: (row) => (
          <Badge variant={getStatusColor(row.statut)} className="text-xs">
            {getStatusLabel(row.statut)}
          </Badge>
        ),
      },
      {
        id: 'documents',
        label: 'Documents',
        minWidth: 120,
        align: 'center',
        render: (row) => (
          <div className="flex items-center justify-center gap-1">
            {row.cvPath && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        window.open(row.cvPath, '_blank', 'noopener,noreferrer');
                        return false;
                      }}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-ink-100 transition-colors cursor-pointer"
                    >
                      <PictureAsPdfIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>CV</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {row.lettreMotivationPath && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        window.open(row.lettreMotivationPath, '_blank', 'noopener,noreferrer');
                        return false;
                      }}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-ink-100 transition-colors cursor-pointer"
                    >
                      <PictureAsPdfIcon className="h-4 w-4 text-brand-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Lettre de motivation</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {!row.cvPath && !row.lettreMotivationPath && (
              <span className="text-xs text-ink-400">-</span>
            )}
          </div>
        ),
      },
      {
        id: 'date',
        label: 'Date',
        minWidth: 100,
        render: (row) => (
          <span className="text-sm text-ink-600">
            {new Date(row.creeLe).toLocaleDateString('fr-FR')}
          </span>
        ),
      },
      {
        id: 'actions',
        label: 'Actions',
        minWidth: 130,
        align: 'right',
        render: (row) => (
          <TooltipProvider>
            <div className="flex justify-end gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onView(row)}
                    className="h-8 w-8"
                  >
                    <VisibilityIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voir détails</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(row)}
                    className="h-8 w-8"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Modifier statut</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(row.id)}
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <DeleteIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Supprimer</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        ),
      },
    ],
    [onView, onEdit, onDelete, onDownloadCV, onDownloadLettre]
  );

  if (loading) {
    return (
      <div className="border border-ink-100 rounded-xl overflow-hidden bg-white p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-ink-300 border-t-brand-600"></div>
          <p className="mt-2 text-ink-600">Chargement des admissions...</p>
        </div>
      </div>
    );
  }

  return (
    <DataTable<Admission>
      columns={columns}
      data={data}
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      emptyMessage={emptyMessage}
      getRowId={(row) => row.id}
    />
  );
};

export default AdmissionTable;
