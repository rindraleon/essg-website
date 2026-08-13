import { Card, CardContent, Typography, Box, Button, IconButton } from '@/components/compat/mui';
import { Filter } from 'lucide-react';
import React, { useState, useCallback } from 'react';
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
import { usePagination, useScrollToTop } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import type { User, UserFormData } from '../../types';
import { useCreateUser, useDeleteUser, useUpdateUser, useUsersQuery } from '../../hooks/queries';
import { useTitle } from '@/hooks/useTitle';

const Utilisateurs: React.FC = () => {
  useScrollToTop();
  useTitle('Utilisateurs');
  const { data = [] } = useUsersQuery();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
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
        await deleteMutation.mutateAsync(userToDelete.id);
        toast.success(`Utilisateur "${userToDelete.email}" supprimé avec succès`);
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error('Error deleting user:', error);
      }
    }
  }, [userToDelete, deleteMutation]);

  const handleFormSubmit = useCallback(
    async (formData: UserFormData) => {
      try {
        if (formMode === 'create') {
          if (!formData.motDePasse) {
            toast.error('Le mot de passe est requis');
            return;
          }

          const { avatarFile, avatar: _avatar, ...userDataWithoutAvatar } = formData;
          await createMutation.mutateAsync({
            userData: {
              email: userDataWithoutAvatar.email,
              motDePasse: userDataWithoutAvatar.motDePasse as string,
              prenom: userDataWithoutAvatar.prenom,
              nom: userDataWithoutAvatar.nom,
              role: userDataWithoutAvatar.role,
              estActif: userDataWithoutAvatar.estActif,
            },
            avatarFile,
          });
          toast.success(avatarFile ? 'Utilisateur créé avec succès avec avatar' : 'Utilisateur créé avec succès');
        } else if (selectedUser) {
          await updateMutation.mutateAsync({ id: selectedUser.id, data: formData });
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
        <Card variant="outlined">
          <CardContent className="flex flex-col items-center py-4">
            <Typography variant="h4" className="font-bold text-ink-900">
              {totalCount}
            </Typography>
            <Typography variant="body2" className="text-ink-500">
              Total utilisateurs
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="flex flex-col items-center py-4">
            <Typography variant="h4" className="font-bold text-brand-600">
              {activeCount}
            </Typography>
            <Typography variant="body2" className="text-ink-500">
              Actifs
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="flex flex-col items-center py-4">
            <Typography variant="h4" className="font-bold text-brand-600">
              {adminCount}
            </Typography>
            <Typography variant="body2" className="text-ink-500">
              Administrateurs
            </Typography>
          </CardContent>
        </Card>
      </div> */}

      {/* Search + Add Button */}
      <Card variant="outlined">
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <Typography variant="h6" className="font-bold text-ink-800 whitespace-nowrap">
                Gestion des utilisateurs
                <Box component="span" className="ml-2 text-sm font-normal text-ink-500">
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
              >
                <Filter className="size-4" />
              </IconButton>
              {isAdmin && (
                <Button
                  variant="contained"
                  onClick={handleOpenCreate}
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
