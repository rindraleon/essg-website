import React from 'react';
import { IconButton, Tooltip, Chip, Avatar } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getImageUrl } from '../../utils/image.utils';
import type { RessourceHumaineItem } from '../../types/ressource-humaine.types';
import DataTable from '../common/DataTable';
import type { Column } from '../common/DataTable';


interface RessourceHumaineTableProps {
  data: RessourceHumaineItem[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onView: (ressource: RessourceHumaineItem) => void;
  onEdit: (ressource: RessourceHumaineItem) => void;
  onDelete: (ressource: RessourceHumaineItem) => void;
}

const RessourceHumaineTable: React.FC<RessourceHumaineTableProps> = ({
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
  const columns: Column<RessourceHumaineItem>[] = [
    {
      id: 'photo',
      label: 'Photo',
      minWidth: 60,
      render: (row) => (
        <Avatar
          src={row.photo ? getImageUrl(row.photo) : undefined}
          alt={`${row.nom} ${row.prenom}`}
          sx={{ width: 36, height: 36 }}
        >
          {row.prenom[0]}{row.nom[0]}
        </Avatar>
      ),
    },
    {
      id: 'nom',
      label: 'Nom complet',
      minWidth: 180,
      render: (row) => (
        <div>
          <span className="font-semibold text-gray-900">
            {row.nom} {row.prenom}
          </span>
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{row.poste}</p>
        </div>
      ),
    },
    {
      id: 'poste',
      label: 'Poste',
      minWidth: 140,
      render: (row) => (
        <Chip
          label={row.poste}
          size="small"
          variant="outlined"
          sx={{ borderRadius: '6px', fontWeight: 500 }}
        />
      ),
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 180,
      render: (row) => (
        <span className="text-sm text-gray-600">{row.email || '-'}</span>
      ),
    },
    {
      id: 'telephone',
      label: 'Téléphone',
      minWidth: 120,
      render: (row) => (
        <span className="text-sm text-gray-600">{row.telephone || '-'}</span>
      ),
    },
    {
      id: 'actif',
      label: 'Statut',
      minWidth: 90,
      render: (row) => (
        <Chip
          label={row.actif ? 'Actif' : 'Inactif'}
          size="small"
          color={row.actif ? 'success' : 'default'}
          sx={{ borderRadius: '6px', fontWeight: 500 }}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 110,
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
    <DataTable<RessourceHumaineItem>
      columns={columns}
      data={data}
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      emptyMessage="Aucune ressource humaine trouvée"
    />
  );
};

export default RessourceHumaineTable;