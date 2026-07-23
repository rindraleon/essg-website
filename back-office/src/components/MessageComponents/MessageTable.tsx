// src/components/MessageComponents/MessageTable.tsx
import React, { useMemo } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import MailIcon from '@mui/icons-material/Mail';
import type { Message } from '../../services/messages.service';
import DataTable from '../common/DataTable';
import type { Column } from '../common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MessageTableProps {
  data: Message[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onView: (message: Message) => void;
  onDelete: (id: number) => void;
  onMarkAsRead: (id: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const getSujetLabel = (sujet: string): string => {
  const labels: Record<string, string> = {
    information: "Demande d'information",
    admission: "Admission",
    partenariat: "Partenariat",
    autre: "Autre",
  };
  return labels[sujet] || sujet;
};

const getSujetColor = (sujet: string): 'default' | 'secondary' | 'outline' => {
  switch (sujet) {
    case 'information':
      return 'default';
    case 'admission':
      return 'secondary';
    case 'partenariat':
      return 'outline';
    default:
      return 'outline';
  }
};

const MessageTable: React.FC<MessageTableProps> = ({
  data,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onDelete,
  onMarkAsRead,
  loading = false,
  emptyMessage = "Aucun message trouvé",
}) => {
  const columns = useMemo<Column<Message>[]>(() => [
    {
      id: 'expediteur',
      label: 'Expéditeur',
      minWidth: 250,
      render: (row) => (
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              row.lu ? 'bg-gray-100' : 'bg-indigo-100'
            }`}>
              <MailIcon sx={{ fontSize: 20, color: row.lu ? '#6b7280' : '#4f46e5' }} />
            </div>
            <div className="min-w-0">
              <span className={`font-semibold block ${row.lu ? 'text-gray-900' : 'text-gray-900'}`}>
                {row.prenom} {row.nom}
              </span>
              <p className="text-xs text-gray-500 truncate">{row.email}</p>
              {row.telephone && (
                <p className="text-xs text-gray-500">{row.telephone}</p>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sujet',
      label: 'Sujet',
      minWidth: 180,
      render: (row) => (
        <div>
          <Badge variant={getSujetColor(row.sujet)} className="text-xs mb-1">
            {getSujetLabel(row.sujet)}
          </Badge>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{row.message}</p>
        </div>
      ),
    },
    {
      id: 'statut',
      label: 'Statut',
      minWidth: 100,
      align: 'center',
      render: (row) => (
        row.lu ? (
          <Badge variant="secondary" className="text-xs">Lu</Badge>
        ) : (
          <Badge variant="default" className="text-xs">Nouveau</Badge>
        )
      ),
    },
    {
      id: 'date',
      label: 'Date',
      minWidth: 150,
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(row.creeLe))}
        </span>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 150,
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
              <TooltipContent>Voir</TooltipContent>
            </Tooltip>
            {!row.lu && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onMarkAsRead(row.id)}
                    className="h-8 w-8"
                  >
                    <MailIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Marquer comme lu</TooltipContent>
              </Tooltip>
            )}
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
  ], [onView, onDelete, onMarkAsRead]);

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-green-600"></div>
          <p className="mt-2 text-gray-600">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <DataTable<Message>
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

export default MessageTable;