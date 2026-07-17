// src/components/FormationComponents/FormationTable.tsx
import React from 'react';
import { IconButton, Tooltip, Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import type { Formation } from '../../types/formation.types';
import DataTable from '../common/DataTable';
import type { Column } from '../common/DataTable';

interface FormationTableProps {
  data: Formation[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onView: (formation: Formation) => void;
  onEdit: (formation: Formation) => void;
  onDelete: (formation: Formation) => void;
}

const FormationTable: React.FC<FormationTableProps> = ({
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
  const columns: Column<Formation>[] = [
    {
      id: 'titre',
      label: 'Formation',
      minWidth: 250,
      render: (row) => (
        <div className="max-w-md">
          <span className="font-semibold text-gray-900 line-clamp-1">{row.titre}</span>
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{row.domaine.join(', ')}</p>
        </div>
      ),
    },
    {
      id: 'niveau',
      label: 'Niveau',
      minWidth: 110,
      render: (row) => {
        const colorMap: Record<string, 'primary' | 'secondary' | 'success'> = {
          'Licence': 'primary',
          'Master': 'secondary',
          'Doctorat': 'success',
        };
        return (
          <Chip
            label={row.niveau}
            size="small"
            color={colorMap[row.niveau] || 'default'}
            sx={{ borderRadius: '6px', fontWeight: 500 }}
          />
        );
      },
    },
    {
      id: 'duree',
      label: 'Durée',
      minWidth: 100,
      render: (row) => <span className="text-sm text-gray-600">{row.duree}</span>,
    },
    {
      id: 'credits',
      label: 'Crédits',
      minWidth: 80,
      align: 'center',
      render: (row) => (
        <span className="text-sm font-medium text-gray-700">{row.credits}</span>
      ),
    },
    {
      id: 'enVedette',
      label: 'Vedette',
      minWidth: 100,
      align: 'center',
      render: (row) =>
        row.enVedette ? (
          <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
        ) : (
          <span className="text-sm text-gray-400">-</span>
        ),
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
    <DataTable<Formation>
      columns={columns}
      data={data}
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      emptyMessage="Aucune formation trouvée"
    />
  );
};

export default FormationTable;