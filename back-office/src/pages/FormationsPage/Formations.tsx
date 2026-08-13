import React, { useState, useCallback } from 'react';
import { toast, Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  FormationFilters,
  FormationForm,
  FormationTable,
  FormationViewDialog,
  ConfirmDialog,
  SearchInput,
} from '../../components';
import { usePagination, useFormationFilter, useScrollToTop } from '../../hooks';
import {
  useCreateFormation,
  useDeleteFormation,
  useFormationsQuery,
  useUpdateFormation,
} from '../../hooks/queries';
import type { FormationFormData, Formation } from '../../types';
import { useTitle } from '@/hooks/useTitle';

const Formations: React.FC = () => {
  useScrollToTop();
  useTitle('Formations');
  const { data = [] } = useFormationsQuery();
  const createMutation = useCreateFormation();
  const updateMutation = useUpdateFormation();
  const deleteMutation = useDeleteFormation();
  const [searchTerm, setSearchTerm] = useState('');

  // UI state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formationToDelete, setFormationToDelete] = useState<Formation | null>(null);

  // Hooks
  const { filters, filteredData, updateFilter, resetFilters, activeFilterCount } =
    useFormationFilter({
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
    setSelectedFormation(null);
    setFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((formation: Formation) => {
    setFormMode('edit');
    setSelectedFormation(formation);
    setFormOpen(true);
  }, []);

  const handleView = useCallback((formation: Formation) => {
    setSelectedFormation(formation);
    setViewDialogOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((formation: Formation) => {
    setFormationToDelete(formation);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (formationToDelete) {
      try {
        await deleteMutation.mutateAsync(formationToDelete.id);
        toast.success(`"${formationToDelete.titre}" a été supprimée avec succès`);
        setDeleteDialogOpen(false);
        setFormationToDelete(null);
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error('Error deleting formation:', error);
      }
    }
  }, [formationToDelete, deleteMutation]);

  const handleFormSubmit = useCallback(
    async (formData: FormationFormData) => {
      try {
        if (formMode === 'create') {
          await createMutation.mutateAsync(formData);
          toast.success('Formation créée avec succès');
        } else if (selectedFormation) {
          await updateMutation.mutateAsync({ id: selectedFormation.id, data: formData });
          toast.success('Formation modifiée avec succès');
        }
        // Close the dialog only after successful API call
        setFormOpen(false);
      } catch (error) {
        toast.error("Erreur lors de l'enregistrement");
        console.error('Error saving formation:', error);
      }
    },
    [formMode, selectedFormation, createMutation, updateMutation]
  );

  const handleResetFilters = useCallback(() => {
    resetFilters();
    resetPage();
  }, [resetFilters, resetPage]);

  const handleToggleFilters = useCallback(() => {
    setFiltersOpen((prev) => !prev);
  }, []);

  return (
    <div className="space-y-2 p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <Toaster position="top-right" richColors />

      {/* Search + Add Button */}
      <div className="rounded-xl border border-ink-100 bg-white p-4 shadow-card">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col items-start gap-4 sm:flex-row sm:items-center">
            <h2 className="whitespace-nowrap text-lg font-bold text-ink-800">
              Liste des formations
              <span className="ml-2 text-sm font-normal text-ink-500">
                ({filteredData.length} résultat{filteredData.length !== 1 ? 's' : ''})
              </span>
            </h2>
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Rechercher par titre, domaine..."
            />
          </div>
          <div className="flex w-full items-center gap-3 lg:w-auto">
            <Button variant="outline" onClick={handleToggleFilters}>
              {filtersOpen ? 'Masquer les filtres' : 'Filtres'}
            </Button>
            <Button onClick={handleOpenCreate}>+ Nouvelle formation</Button>
          </div>
        </div>
      </div>

      {/* Filters - Full Width Below */}
      {filtersOpen && (
        <div className="rounded-xl border border-ink-100 bg-white p-4 shadow-card">
          <FormationFilters
            filters={filters}
            onUpdateFilter={(key, value) => {
              updateFilter(key, value);
              resetPage();
            }}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
            open={filtersOpen}
            onToggle={handleToggleFilters}
          />
        </div>
      )}

      {/* Table */}
      <FormationTable
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
      <FormationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedFormation}
        mode={formMode}
      />

      {/* View Dialog */}
      <FormationViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        formation={selectedFormation}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer la formation"
        message={
          formationToDelete
            ? `Êtes-vous sûr de vouloir supprimer "${formationToDelete.titre}" ? Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setFormationToDelete(null);
        }}
        severity="error"
      />
    </div>
  );
};

export default Formations;
