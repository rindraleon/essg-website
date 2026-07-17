// src/components/actualites/ActualiteTable.tsx
import React from 'react';
import { IconButton, Tooltip, Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ActualiteItem } from '../../types/actualite.types';
import DataTable from '../common/DataTable';
import type { Column } from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';

interface ActualiteTableProps {
  data: ActualiteItem[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onView: (actualite: ActualiteItem) => void;
  onEdit: (actualite: ActualiteItem) => void;
  onDelete: (actualite: ActualiteItem) => void;
}

const ActualiteTable: React.FC<ActualiteTableProps> = ({
  data,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns: Column<ActualiteItem>[] = [
    {
      id: 'titre',
      label: 'Titre',
      minWidth: 200,
      render: (row) => (
        <div className="max-w-xs">
          <span className="font-semibold text-gray-900 line-clamp-1">{row.titre}</span>
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{row.contenu}</p>
        </div>
      ),
    },
    {
      id: 'categorie',
      label: 'Catégorie',
      minWidth: 120,
      render: (row) => (
        <Chip
          label={row.categorie}
          size="small"
          variant="outlined"
          sx={{ borderRadius: '6px', fontWeight: 500 }}
        />
      ),
    },
    {
      id: 'auteur',
      label: 'Auteur',
      minWidth: 130,
      render: (row) => <span className="text-sm text-gray-600">{row.auteur}</span>,
    },
    {
      id: 'date',
      label: 'Date',
      minWidth: 110,
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.date).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      id: 'statut',
      label: 'Statut',
      minWidth: 100,
      render: (row) => <StatusBadge status={row.statut} />,
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 130,
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Tooltip title="Voir">
            <IconButton size="small" onClick={() => onView(row)} color="info">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <IconButton size="small" onClick={() => onEdit(row)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton size="small" onClick={() => onDelete(row)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <DataTable<ActualiteItem>
      columns={columns}
      data={data}
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      emptyMessage="Aucune actualité trouvée"
    />
  );
};

export default ActualiteTable;