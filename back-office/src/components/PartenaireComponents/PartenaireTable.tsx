import React, { useMemo } from 'react';
import { IconButton, Tooltip, Chip, Avatar } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getImageUrl } from '../../utils/image.utils';
import type { Partenaire } from '../../types/partenaire.types';
import { formatDate } from '../../utils/partenaire.utils';
import { PARTENAIRE_TYPE_COLORS } from '../../constants/partenaire.constants';
import DataTable from '../common/DataTable';
import type { Column } from '../common/DataTable';

interface PartenaireTableProps {
  data: Partenaire[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onView: (partenaire: Partenaire) => void;
  onEdit: (partenaire: Partenaire) => void;
  onDelete: (partenaire: Partenaire) => void;
}

const PartenaireTable: React.FC<PartenaireTableProps> = ({
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
  const columns = useMemo<Column<Partenaire>[]>(() => [
    {
      id: 'nom',
      label: 'Partenaire',
      minWidth: 250,
      render: (row) => {
        const isImageLogo = row.logo && (row.logo.startsWith('/uploads/') || row.logo.startsWith('http'));
        return (
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Avatar
                src={isImageLogo ? getImageUrl(row.logo) : undefined}
                sx={{ width: 40, height: 40, fontSize: '1.5rem', backgroundColor: '#f3f4f6' }}
                variant="rounded"
              >
                {!isImageLogo && row.logo}
              </Avatar>
              <div>
                <span className="font-semibold text-gray-900 line-clamp-1">{row.nom}</span>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{row.secteur}</p>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: 'type',
      label: 'Type',
      minWidth: 140,
      render: (row) => (
        <Chip
          label={row.type}
          size="small"
          color={PARTENAIRE_TYPE_COLORS[row.type] || 'default'}
          sx={{ borderRadius: '6px', fontWeight: 500 }}
        />
      ),
    },
    {
      id: 'contact',
      label: 'Contact',
      minWidth: 180,
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.contact || row.siteWeb || '-'}
        </span>
      ),
    },
    {
      id: 'dateDebut',
      label: 'Date début',
      minWidth: 120,
      render: (row) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.dateDebut)}
        </span>
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
      emptyMessage="Aucun partenaire trouvé"
      getRowId={(row) => row.id}
    />
  );
};

export default PartenaireTable;