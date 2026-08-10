import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { toast, Toaster } from 'sonner';
import {
  RessourceHumaineFilters,
  RessourceHumaineForm,
  RessourceHumaineTable,
  RessourceHumaineViewDialog,
  ConfirmDialog,
  SearchInput,
} from '../../components';
import { useRessourceHumaineFilter } from '../../hooks/useRessourceHumaineFilter';
import { usePagination, useScrollToTop } from '../../hooks';
import type {
  RessourceHumaineFormData,
  RessourceHumaineItem,
  RessourceHumaineFilterOptions,
} from '../../types';
import { initialRessourcesHumaines } from '../../data/mockData';
import {
  getAllRessourcesHumaines,
  createRessourceHumaine,
  updateRessourceHumaine,
  deleteRessourceHumaine,
} from '../../services';
import { useTitle } from '@/hooks/useTitle';

const RessourcesHumaines: React.FC = () => {
  useScrollToTop();
  useTitle('Ressources humaines');
  // Data state
  const [data, setData] = useState<RessourceHumaineItem[]>(initialRessourcesHumaines);
  const [searchTerm, setSearchTerm] = useState('');

  // UI state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedRessource, setSelectedRessource] = useState<RessourceHumaineItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ressourceToDelete, setRessourceToDelete] = useState<RessourceHumaineItem | null>(null);

  // Hooks
  const { filters, filteredData, updateFilter, resetFilters, activeFilterCount } =
    useRessourceHumaineFilter({
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

  // Load data from backend
  useEffect(() => {
    const loadRessourcesHumaines = async () => {
      try {
        const ressourcesHumaines = await getAllRessourcesHumaines();
        setData(ressourcesHumaines);
      } catch (error) {
        console.error('Failed to load ressources humaines from backend:', error);
      }
    };

    loadRessourcesHumaines();
  }, []);

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
    setSelectedRessource(null);
    setFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((ressource: RessourceHumaineItem) => {
    setFormMode('edit');
    setSelectedRessource(ressource);
    setFormOpen(true);
  }, []);

  const handleView = useCallback((ressource: RessourceHumaineItem) => {
    setSelectedRessource(ressource);
    setViewDialogOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((ressource: RessourceHumaineItem) => {
    setRessourceToDelete(ressource);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (ressourceToDelete) {
      try {
        await deleteRessourceHumaine(ressourceToDelete.id.toString());
        setData((prev) => prev.filter((item) => item.id !== ressourceToDelete.id));
        toast.success(
          `"${ressourceToDelete.prenom} ${ressourceToDelete.nom}" a été supprimé(e) avec succès`
        );
        setDeleteDialogOpen(false);
        setRessourceToDelete(null);
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error('Error deleting ressource humaine:', error);
      }
    }
  }, [ressourceToDelete]);

  const handleFormSubmit = useCallback(
    async (formData: RessourceHumaineFormData) => {
      try {
        if (formMode === 'create') {
          const newRessource = await createRessourceHumaine(formData);
          setData((prev) => [newRessource, ...prev]);
          toast.success('Ressource humaine créée avec succès');
        } else if (selectedRessource) {
          const updatedRessource = await updateRessourceHumaine(
            selectedRessource.id.toString(),
            formData
          );
          setData((prev) =>
            prev.map((item) => (item.id === selectedRessource.id ? updatedRessource : item))
          );
          toast.success('Ressource humaine modifiée avec succès');
        }
      } catch (error) {
        toast.error("Erreur lors de l'enregistrement");
        console.error('Error saving ressource humaine:', error);
      }
    },
    [formMode, selectedRessource]
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
      <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <Typography variant="h6" className="font-bold text-ink-800 whitespace-nowrap">
                Liste des ressources humaines
                <Box component="span" className="ml-2 text-sm font-normal text-ink-500">
                  ({filteredData.length} résultat{filteredData.length !== 1 ? 's' : ''})
                </Box>
              </Typography>
              <SearchInput
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Rechercher par nom, prénom, poste..."
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
                + Nouvelle ressource
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters - Full Width Below */}
      {filtersOpen && (
        <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
          <CardContent>
            <RessourceHumaineFilters
              filters={filters}
              onUpdateFilter={(key: keyof RessourceHumaineFilterOptions, value: string) => {
                updateFilter(key, value);
                resetPage();
              }}
              onResetFilters={handleResetFilters}
              activeFilterCount={activeFilterCount}
              open={filtersOpen}
              onToggle={handleToggleFilters}
            />
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <RessourceHumaineTable
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
      <RessourceHumaineForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedRessource}
        mode={formMode}
      />

      {/* View Dialog */}
      <RessourceHumaineViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        ressource={selectedRessource}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer la ressource humaine"
        message={
          ressourceToDelete
            ? `Êtes-vous sûr de vouloir supprimer "${ressourceToDelete.prenom} ${ressourceToDelete.nom}" ? Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setRessourceToDelete(null);
        }}
        severity="error"
      />
    </div>
  );
};

export default RessourcesHumaines;
