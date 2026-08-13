import { Button } from '@/components/compat/mui';
import React, { useState, useCallback } from 'react';
import { toast, Toaster } from 'sonner';
import {
  PartenaireFilters,
  PartenaireForm,
  PartenaireTable,
  PartenaireViewDialog,
  ConfirmDialog,
  SearchInput,
} from '../../components';
import { usePagination, usePartenaireFilter, useScrollToTop } from '../../hooks';
import type { PartenaireFormData, Partenaire } from '../../types';
import {
  useCreatePartenaire,
  useDeletePartenaire,
  usePartenairesQuery,
  useUpdatePartenaire,
} from '../../hooks/queries';
import { useTitle } from '@/hooks/useTitle';

const Partenaires: React.FC = () => {
  useScrollToTop();
  useTitle('Partenaires');
  const { data = [] } = usePartenairesQuery();
  const createMutation = useCreatePartenaire();
  const updateMutation = useUpdatePartenaire();
  const deleteMutation = useDeletePartenaire();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedPartenaire, setSelectedPartenaire] = useState<Partenaire | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partenaireToDelete, setPartenaireToDelete] = useState<Partenaire | null>(null);

  const { filters, filteredData, updateFilter, resetFilters, activeFilterCount } =
    usePartenaireFilter({
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

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      resetPage();
    },
    [resetPage]
  );

  const handleOpenCreate = useCallback(() => {
    setFormMode('create');
    setSelectedPartenaire(null);
    setFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((partenaire: Partenaire) => {
    setFormMode('edit');
    setSelectedPartenaire(partenaire);
    setFormOpen(true);
  }, []);

  const handleView = useCallback((partenaire: Partenaire) => {
    setSelectedPartenaire(partenaire);
    setViewDialogOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((partenaire: Partenaire) => {
    setPartenaireToDelete(partenaire);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (partenaireToDelete) {
      try {
        await deleteMutation.mutateAsync(partenaireToDelete.id);
        toast.success(`"${partenaireToDelete.nom}" a été supprimé avec succès`);
        setDeleteDialogOpen(false);
        setPartenaireToDelete(null);
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error('Error deleting partenaire:', error);
      }
    }
  }, [partenaireToDelete, deleteMutation]);

  const handleFormSubmit = useCallback(
    async (formData: PartenaireFormData | FormData) => {
      try {
        if (formMode === 'create') {
          await createMutation.mutateAsync(formData);
          toast.success('Partenaire créé avec succès');
        } else if (selectedPartenaire) {
          await updateMutation.mutateAsync({ id: selectedPartenaire.id, data: formData });
          toast.success('Partenaire modifié avec succès');
        }
        setFormOpen(false);
      } catch (error) {
        toast.error("Erreur lors de l'enregistrement");
        console.error('Error saving partenaire:', error);
      }
    },
    [formMode, selectedPartenaire]
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

      <div className="bg-white rounded-xl border border-ink-100 p-4 shadow-card">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            <h2 className="text-lg font-bold text-ink-800 whitespace-nowrap">
              Liste des partenaires
              <span className="ml-2 text-sm font-normal text-ink-500">
                ({filteredData.length} résultat{filteredData.length !== 1 ? 's' : ''})
              </span>
            </h2>
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Rechercher par nom, description, secteur..."
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
              + Nouveau partenaire
            </Button>
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="bg-white rounded-xl border border-ink-100 p-4 shadow-card">
          <PartenaireFilters
            filters={filters}
            onUpdateFilter={updateFilter}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
            open={filtersOpen}
            onToggle={handleToggleFilters}
          />
        </div>
      )}

      <PartenaireTable
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

      <PartenaireForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedPartenaire}
        mode={formMode}
      />

      <PartenaireViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        partenaire={selectedPartenaire}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer le partenaire"
        message={
          partenaireToDelete
            ? `Êtes-vous sûr de vouloir supprimer "${partenaireToDelete.nom}" ? Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setPartenaireToDelete(null);
        }}
        severity="error"
      />
    </div>
  );
};

export default Partenaires;
