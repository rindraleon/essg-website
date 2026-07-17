import React from 'react';
import { IconButton, Tooltip, Chip, Avatar } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getImageUrl } from '../../utils/image.utils';
import type { User } from '../../types';
import DataTable from '../common/DataTable';
import type { Column } from '../common/DataTable';

interface UsersTableProps {
  data: User[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isAdmin: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({
  data,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onEdit,
  onDelete,
  isAdmin,
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'editeur':
        return 'primary';
      case 'lecteur':
        return 'default';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'editeur':
        return 'Éditeur';
      case 'lecteur':
        return 'Lecteur';
      default:
        return role;
    }
  };

  const columns: Column<User>[] = [
    {
      id: 'avatar',
      label: 'Avatar',
      minWidth: 80,
      render: (user) => (
        <Avatar
          src={user.avatar ? getImageUrl(user.avatar) : undefined}
          alt={`${user.nom} ${user.prenom}`}
          sx={{ width: 40, height: 40 }}
        >
          {user.prenom[0]}{user.nom[0]}
        </Avatar>
      ),
    },
    {
      id: 'nom',
      label: 'Nom complet',
      minWidth: 200,
      render: (user) => (
        <div>
          <span className="font-semibold text-gray-900">
            {user.nom} {user.prenom}
          </span>
        </div>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 220,
      render: (user) => (
        <span className="text-sm text-gray-600">{user.email}</span>
      ),
    },
    {
      id: 'role',
      label: 'Rôle',
      minWidth: 140,
      render: (user) => (
        <Chip
          label={getRoleLabel(user.role)}
          color={getRoleColor(user.role) as any}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      id: 'statut',
      label: 'Statut',
      minWidth: 120,
      render: (user) => (
        <Chip
          label={user.estActif ? 'Actif' : 'Inactif'}
          color={user.estActif ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 140,
      align: 'right',
      render: (user) => (
        <div className="flex justify-end gap-1">
          <Tooltip title="Voir">
            <IconButton size="small" onClick={() => onView(user)} color="info">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <IconButton size="small" onClick={() => onEdit(user)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {isAdmin && (
            <Tooltip title="Supprimer">
              <IconButton size="small" onClick={() => onDelete(user)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable<User>
      columns={columns}
      data={data}
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      emptyMessage="Aucun utilisateur trouvé"
      getRowId={(user) => user.id}
    />
  );
};

export default UsersTable;
