import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@mui/material';
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
  getAllPartenaires,
  createPartenaire,
  updatePartenaire,
  deletePartenaire,
} from '../../services';
import { useTitle } from '@/hooks/useTitle';

const Partenaires: React.FC = () => {
  useScrollToTop();
  useTitle('Partenaires');
  const [data, setData] = useState<Partenaire[]>([]);
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

  useEffect(() => {
    const loadPartenaires = async () => {
      try {
        const partenaires = (await getAllPartenaires()) as Partenaire[];
        setData(partenaires);
      } catch (error) {
        console.error('Failed to load partenaires from backend:', error);
        toast.error('Erreur lors du chargement des partenaires');
      }
    };

    loadPartenaires();
  }, []);

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
        await deletePartenaire(partenaireToDelete.id);
        setData((prev) => prev.filter((item) => item.id !== partenaireToDelete.id));
        toast.success(`"${partenaireToDelete.nom}" a été supprimé avec succès`);
        setDeleteDialogOpen(false);
        setPartenaireToDelete(null);
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error('Error deleting partenaire:', error);
      }
    }
  }, [partenaireToDelete]);

  const handleFormSubmit = useCallback(
    async (formData: PartenaireFormData | FormData) => {
      try {
        if (formMode === 'create') {
          const newPartenaire = await createPartenaire(formData);
          setData((prev) => [newPartenaire, ...prev]);
          toast.success('Partenaire créé avec succès');
        } else if (selectedPartenaire) {
          const updatedPartenaire = await updatePartenaire(selectedPartenaire.id, formData);
          setData((prev) =>
            prev.map((item) => (item.id === selectedPartenaire.id ? updatedPartenaire : item))
          );
          toast.success('Partenaire modifié avec succès');
        }
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
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                whiteSpace: 'nowrap',
                borderColor: '#e5e7eb',
                color: '#374151',
                '&:hover': {
                  borderColor: '#d1d5db',
                  backgroundColor: '#f9fafb',
                },
              }}
            >
              {filtersOpen ? 'Masquer les filtres' : 'Filtres'}
            </Button>
            <Button
                variant="contained"
                onClick={handleOpenCreate}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  backgroundColor: '#2e6a5f',
                  '&:hover': {
                    backgroundColor: '#27564e',
                  },
                }}
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
