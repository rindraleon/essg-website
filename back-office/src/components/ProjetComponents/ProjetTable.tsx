// src/components/ProjetComponents/ProjetTable.tsx
import React, { useMemo } from 'react';
import { IconButton, Tooltip, Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Projet } from '../../types/projet.types';
import { getTypeColor, formatDate } from '../../utils/projet.utils';
import DataTable from '../common/DataTable';
import type { Column } from '../common/DataTable';

interface ProjetTableProps {
  data: Projet[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onView: (projet: Projet) => void;
  onEdit: (projet: Projet) => void;
  onDelete: (projet: Projet) => void;
}

const ProjetTable: React.FC<ProjetTableProps> = ({
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
  const columns = useMemo<Column<Projet>[]>(() => [
    {
      id: 'titre',
      label: 'Projet',
      minWidth: 200,
      render: (row) => (
        <div className="max-w-xs">
          <span className="font-semibold text-gray-900 line-clamp-1">{row.titre}</span>
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{row.description}</p>
        </div>
      ),
    },
    {
      id: 'type',
      label: 'Type',
      minWidth: 120,
      render: (row) => (
        <Chip
          label={row.type}
          size="small"
          color={getTypeColor(row.type)}
          sx={{ borderRadius: '6px', fontWeight: 500 }}
        />
      ),
    },
    {
      id: 'partenaires',
      label: 'Partenaires',
      minWidth: 150,
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.partenaires.slice(0, 2).map((partenaire, index) => (
            <Chip
              key={`${row.id}-${index}`}
              label={partenaire}
              size="small"
              variant="outlined"
              sx={{ borderRadius: '4px', fontSize: '0.75rem' }}
            />
          ))}
          {row.partenaires.length > 2 && (
            <Chip
              key={`${row.id}-more`}
              label={`+${row.partenaires.length - 2}`}
              size="small"
              variant="outlined"
              sx={{ borderRadius: '4px', fontSize: '0.75rem' }}
            />
          )}
        </div>
      ),
    },
    {
      id: 'localisation',
      minWidth: 140,
      label: 'Localisation',
      render: (row) => (
        <div className="text-sm text-gray-600">
          {row.ville && <div>{row.ville}</div>}
          {row.pays && <div className="text-xs text-gray-500">{row.pays}</div>}
        </div>
      ),
    },
    {
      id: 'date',
      label: 'Date',
      minWidth: 100,
      render: (row) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.date)}
        </span>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 120,
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
  ], [onView, onEdit, onDelete]);

  return (
    <DataTable
      columns={columns}
      data={data}
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      emptyMessage="Aucun projet trouvé"
      getRowId={(row) => row.id}
    />
  );
};

export default ProjetTable;