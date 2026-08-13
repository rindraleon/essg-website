import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable, { type Column } from '../common/DataTable';
import type { ActivityLog } from '../../services/activity-logs.service';

interface ActivityLogTableProps {
  data: ActivityLog[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onView: (log: ActivityLog) => void;
  emptyMessage?: string;
}

const METHOD_STYLES: Record<string, string> = {
  POST: 'bg-brand-50 text-brand-800 border-brand-100',
  PUT: 'bg-amber-50 text-amber-800 border-amber-100',
  PATCH: 'bg-amber-50 text-amber-800 border-amber-100',
  DELETE: 'bg-red-50 text-red-700 border-red-100',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function ActivityLogTable({
  data,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onView,
  emptyMessage = 'Aucune action trouvée',
}: ActivityLogTableProps) {
  const columns: Column<ActivityLog>[] = [
    {
      id: 'createdAt',
      label: 'Date',
      minWidth: 130,
      render: (row) => <span className="whitespace-nowrap text-sm text-ink-700">{formatDate(row.createdAt)}</span>,
    },
    {
      id: 'module',
      label: 'Module',
      minWidth: 120,
      render: (row) => <span className="font-medium text-ink-900">{row.module}</span>,
    },
    {
      id: 'action',
      label: 'Action',
      minWidth: 90,
      render: (row) => <span className="capitalize text-ink-700">{row.action}</span>,
    },
    {
      id: 'method',
      label: 'Méthode',
      minWidth: 80,
      render: (row) => (
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${METHOD_STYLES[row.method] ?? 'bg-ink-50 text-ink-700 border-ink-100'}`}
        >
          {row.method}
        </span>
      ),
    },
    {
      id: 'status',
      label: 'Statut',
      minWidth: 90,
      render: (row) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
            row.success ? 'bg-brand-50 text-brand-800' : 'bg-red-50 text-red-700'
          }`}
        >
          {row.statusCode} {row.success ? 'OK' : 'Erreur'}
        </span>
      ),
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 200,
      render: (row) => <span className="line-clamp-2 text-sm text-ink-600">{row.description}</span>,
    },
    {
      id: 'user',
      label: 'Auteur',
      minWidth: 90,
      render: (row) => (
        <span className="text-sm text-ink-600">{row.userId ? `#${row.userId}` : 'Système'}</span>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView(row)}
          aria-label="Voir le détail de l'action"
        >
          <Eye className="size-4" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
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
}
