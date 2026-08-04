import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { toast, Toaster } from 'sonner';
import {
  UsersTable,
  UsersForm,
  UsersViewDialog,
  ConfirmDialog,
  SearchInput,
  UsersFilter,
} from '../../components';
import type { UserFilters } from '../../components/UsersComponent/UsersFilter';
import { usePagination } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import type { User, UserFormData } from '../../types';
import { getAllUsers, createUser, updateUser, deleteUser, uploadAvatar } from '../../services';

const Utilisateurs: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    statut: '',
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const filteredData = data.filter((user) => {
    const matchesSearch =
      filters.search === '' ||
      user.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.prenom.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());

    const matchesRole = filters.role === '' || user.role === filters.role;

    const matchesStatut =
      filters.statut === '' ||
      (filters.statut === 'actif' && user.estActif) ||
      (filters.statut === 'inactif' && !user.estActif);

    return matchesSearch && matchesRole && matchesStatut;
  });

  const {
    currentPage,
    rowsPerPage,
    paginatedData,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
  } = usePagination({ data: filteredData, initialRowsPerPage: 10 });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getAllUsers(1, 100);
      setData(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
      console.error('Error loading users:', error);
    }
  };

  const handleSearchChange = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, search: value }));
      resetPage();
    },
    [resetPage]
  );

  const handleUpdateFilter = useCallback(
    (key: keyof UserFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      resetPage();
    },
    [resetPage]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '',
      role: '',
      statut: '',
    });
    resetPage();
  }, [resetPage]);

  const handleToggleFilters = useCallback(() => {
    setFilterOpen((prev) => !prev);
  }, []);

  const activeFilterCount = useCallback(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.role) count++;
    if (filters.statut) count++;
    return count;
  }, [filters]);

  const handleOpenCreate = useCallback(() => {
    setFormMode('create');
    setSelectedUser(null);
    setFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((user: User) => {
    setFormMode('edit');
    setSelectedUser(user);
    setFormOpen(true);
  }, []);

  const handleView = useCallback((user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        setData((prev) => prev.filter((item) => item.id !== userToDelete.id));
        toast.success(`Utilisateur "${userToDelete.email}" supprimé avec succès`);
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error('Error deleting user:', error);
      }
    }
  }, [userToDelete]);

  const handleFormSubmit = useCallback(
    async (formData: UserFormData) => {
      try {
        if (formMode === 'create') {
          if (!formData.motDePasse) {
            toast.error('Le mot de passe est requis');
            return;
          }

          // Create user without avatar first
          const { avatar, avatarFile, ...userDataWithoutAvatar } = formData;
          const newUser = await createUser(
            userDataWithoutAvatar as Parameters<typeof createUser>[0]
          );

          // Upload avatar if provided
          if (avatarFile && newUser.id) {
            try {
              const updatedUser = await uploadAvatar(newUser.id, avatarFile);
              setData((prev) => [updatedUser, ...prev]);
              toast.success('Utilisateur créé avec succès avec avatar');
            } catch (error) {
              console.error("Erreur lors de l'upload de l'avatar:", error);
              setData((prev) => [newUser, ...prev]);
              toast.success('Utilisateur créé avec succès (avatar non uploadé)');
            }
          } else {
            setData((prev) => [newUser, ...prev]);
            toast.success('Utilisateur créé avec succès');
          }
        } else if (selectedUser) {
          const updatedUser = await updateUser(selectedUser.id, formData);
          setData((prev) => prev.map((item) => (item.id === selectedUser.id ? updatedUser : item)));
          toast.success('Utilisateur modifié avec succès');
        }
        setFormOpen(false);
      } catch (error) {
        toast.error("Erreur lors de l'enregistrement");
        console.error('Error saving user:', error);
      }
    },
    [formMode, selectedUser]
  );

  // const totalCount = filteredData.length;
  // const activeCount = filteredData.filter((u) => u.estActif).length;
  // const adminCount = filteredData.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-2 p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <Toaster position="top-right" richColors />

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
          <CardContent className="flex flex-col items-center py-4">
            <Typography variant="h4" className="font-bold text-gray-900">
              {totalCount}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Total utilisateurs
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
          <CardContent className="flex flex-col items-center py-4">
            <Typography variant="h4" className="font-bold text-green-600">
              {activeCount}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Actifs
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
          <CardContent className="flex flex-col items-center py-4">
            <Typography variant="h4" className="font-bold text-blue-600">
              {adminCount}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Administrateurs
            </Typography>
          </CardContent>
        </Card>
      </div> */}

      {/* Search + Add Button */}
      <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <Typography variant="h6" className="font-bold text-gray-800 whitespace-nowrap">
                Gestion des utilisateurs
                <Box component="span" className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredData.length} résultat{filteredData.length !== 1 ? 's' : ''})
                </Box>
              </Typography>
              <SearchInput
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Rechercher par nom, prénom, email..."
              />
            </div>
            <Box className="flex gap-2">
              <IconButton
                onClick={handleToggleFilters}
                sx={{
                  backgroundColor: filterOpen ? '#e5e7eb' : 'transparent',
                  '&:hover': { backgroundColor: '#e5e7eb' },
                }}
              >
                <FilterListIcon />
              </IconButton>
              {isAdmin && (
                <Button
                  variant="contained"
                  onClick={handleOpenCreate}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    backgroundColor: '#2563eb',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                    },
                  }}
                >
                  + Nouvel utilisateur
                </Button>
              )}
            </Box>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <UsersFilter
        filters={filters}
        onUpdateFilter={handleUpdateFilter}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount()}
        open={filterOpen}
        onToggle={handleToggleFilters}
      />

      {/* Table */}
      <UsersTable
        data={paginatedData}
        totalCount={filteredData.length}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onView={handleView}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteRequest}
        isAdmin={isAdmin}
      />

      {/* Form Dialog (Create / Edit) */}
      <UsersForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedUser}
        mode={formMode}
      />

      {/* View Dialog */}
      <UsersViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        user={selectedUser}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer l'utilisateur"
        message={
          userToDelete
            ? `Êtes-vous sûr de vouloir supprimer "${userToDelete.email}" ? Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setUserToDelete(null);
        }}
        severity="error"
      />
    </div>
  );
};

export default Utilisateurs;
