import { Card, CardContent, Typography, Box, Button } from '@/components/compat/mui';
import React, { useState, useCallback } from 'react';
import { toast, Toaster } from 'sonner';
import {
  ProjetFilters,
  ProjetForm,
  ProjetTable,
  ProjetViewDialog,
  ConfirmDialog,
  SearchInput,
} from '../../components';
import { usePagination, useProjetFilter, useScrollToTop } from '../../hooks';
import type { ProjetFormData, Projet } from '../../types';
import { useCreateProjet, useDeleteProjet, useProjetsQuery, useUpdateProjet } from '../../hooks/queries';
import { useTitle } from '@/hooks/useTitle';

const Projets: React.FC = () => {
  useScrollToTop();
  useTitle('Projets');
  // Data state
  const { data = [] } = useProjetsQuery();
  const createMutation = useCreateProjet();
  const updateMutation = useUpdateProjet();
  const deleteMutation = useDeleteProjet();
  const [searchTerm, setSearchTerm] = useState('');

  // UI state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedProjet, setSelectedProjet] = useState<Projet | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projetToDelete, setProjetToDelete] = useState<Projet | null>(null);

  // Hooks
  const { filters, filteredData, updateFilter, resetFilters, activeFilterCount } = useProjetFilter({
    data,
    searchTerm,
  });

  const {
    currentPage,
    rowsPerPage,
    paginatedData,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
  } = usePagination({ data: filteredData, initialRowsPerPage: 5 });

  // Handlers
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      resetPage();
    },
    [resetPage]
  );

  const handleOpenCreate = useCallback(() => {
    setFormMode('create');
    setSelectedProjet(null);
    setFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((projet: Projet) => {
    setFormMode('edit');
    setSelectedProjet(projet);
    setFormOpen(true);
  }, []);

  const handleView = useCallback((projet: Projet) => {
    setSelectedProjet(projet);
    setViewDialogOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((projet: Projet) => {
    setProjetToDelete(projet);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (projetToDelete) {
      try {
        await deleteMutation.mutateAsync(projetToDelete.id);
        toast.success(`"${projetToDelete.titre}" a été supprimé avec succès`);
        setDeleteDialogOpen(false);
        setProjetToDelete(null);
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error('Error deleting projet:', error);
      }
    }
  }, [projetToDelete, deleteMutation]);

  const handleFormSubmit = useCallback(
    async (formData: ProjetFormData) => {
      try {
        if (formMode === 'create') {
          await createMutation.mutateAsync(formData);
          toast.success('Projet créé avec succès');
        } else if (selectedProjet) {
          await updateMutation.mutateAsync({ id: selectedProjet.id, data: formData });
          toast.success('Projet modifié avec succès');
        }
        setFormOpen(false);
      } catch (error) {
        toast.error("Erreur lors de l'enregistrement");
        console.error('Error saving projet:', error);
      }
    },
    [formMode, selectedProjet]
  );

  const handleResetFilters = useCallback(() => {
    resetFilters();
    resetPage();
  }, [resetFilters, resetPage]);

  const handleToggleFilters = useCallback(() => {
    setFiltersOpen((prev) => !prev);
  }, []);


  return (
    <div className="space-y-2 p-2 sm:p-6 lg:p-8">
      <Toaster position="top-right" richColors />

      {/* Search + Add Button */}
      <Card variant="outlined">
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <Typography variant="h6" className="font-bold text-ink-800 whitespace-nowrap">
                Liste des projets
                <Box component="span" className="ml-2 text-sm font-normal text-ink-500">
                  ({filteredData.length} résultat{filteredData.length !== 1 ? 's' : ''})
                </Box>
              </Typography>
              <SearchInput
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Rechercher par titre, description..."
              />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Button
                variant="outlined"
                onClick={handleToggleFilters}
              >
                {filtersOpen ? 'Masquer les filtres' : 'Filtres'}
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenCreate}
              >
                + Nouveau projet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters - Full Width Below */}
      {filtersOpen && (
        <Card variant="outlined">
          <CardContent>
            <ProjetFilters
              filters={filters}
              onUpdateFilter={updateFilter}
              onResetFilters={handleResetFilters}
              activeFilterCount={activeFilterCount}
              open={filtersOpen}
              onToggle={handleToggleFilters}
            />
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <ProjetTable
        data={paginatedData}
        totalCount={filteredData.length}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onView={handleView}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteRequest}
      />

      {/* Form Dialog (Create / Edit) */}
      <ProjetForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedProjet}
        mode={formMode}
      />

      {/* View Dialog */}
      <ProjetViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        projet={selectedProjet}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer le projet"
        message={
          projetToDelete
            ? `Êtes-vous sûr de vouloir supprimer "${projetToDelete.titre}" ? Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setProjetToDelete(null);
        }}
        severity="error"
      />
    </div>
  );
};

export default Projets;
