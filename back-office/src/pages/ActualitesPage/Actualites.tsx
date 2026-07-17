import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { toast, Toaster } from 'sonner';
import { ActualiteFilters, ActualiteForm, ActualiteTable, ActualiteViewDialog, ConfirmDialog, SearchInput } from '../../components';
import { useFilter } from '../../hooks/useFilter';
import { usePagination } from '../../hooks';
import type { ActualiteFormData, ActualiteItem} from '../../types';
import { initialActualites } from '../../data/mockData';
import { getAllActualites, createActualite, updateActualite, deleteActualite } from '../../services';


const Actualites: React.FC = () => {
  // Data state
  const [data, setData] = useState<ActualiteItem[]>(initialActualites);
  const [searchTerm, setSearchTerm] = useState('');

  // UI state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedActualite, setSelectedActualite] = useState<ActualiteItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actualiteToDelete, setActualiteToDelete] = useState<ActualiteItem | null>(null);

  // Hooks
  const { filters, filteredData, updateFilter, resetFilters, activeFilterCount } = useFilter({
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
    const loadActualites = async () => {
      try {
        const actualites = await getAllActualites();
        setData(actualites);
      } catch (error) {
        console.error('Failed to load actualites from backend:', error);
        
      }
    };

    loadActualites();
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
    setSelectedActualite(null);
    setFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((actualite: ActualiteItem) => {
    setFormMode('edit');
    setSelectedActualite(actualite);
    setFormOpen(true);
  }, []);

  const handleView = useCallback((actualite: ActualiteItem) => {
    setSelectedActualite(actualite);
    setViewDialogOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((actualite: ActualiteItem) => {
    setActualiteToDelete(actualite);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (actualiteToDelete) {
      try {
        await deleteActualite(actualiteToDelete.id);
        setData((prev) => prev.filter((item) => item.id !== actualiteToDelete.id));
        toast.success(`"${actualiteToDelete.titre}" a été supprimée avec succès`);
        setDeleteDialogOpen(false);
        setActualiteToDelete(null);
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error('Error deleting actualite:', error);
      }
    }
  }, [actualiteToDelete]);

  const handleFormSubmit = useCallback(
    async (formData: ActualiteFormData) => {
      try {
        if (formMode === 'create') {
          const newActualite = await createActualite(formData);
          setData((prev) => [newActualite, ...prev]);
          toast.success('Actualité créée avec succès');
        } else if (selectedActualite) {
          const updatedActualite = await updateActualite(selectedActualite.id, formData);
          setData((prev) =>
            prev.map((item) =>
              item.id === selectedActualite.id ? updatedActualite : item
            )
          );
          toast.success('Actualité modifiée avec succès');
        }
      } catch (error) {
        toast.error('Erreur lors de l\'enregistrement');
        console.error('Error saving actualite:', error);
      }
    },
    [formMode, selectedActualite]
  );

  const handleResetFilters = useCallback(() => {
    resetFilters();
    resetPage();
  }, [resetFilters, resetPage]);

  const handleToggleFilters = useCallback(() => {
    setFiltersOpen((prev) => !prev);
  }, []);

  // Stats
  const totalCount = data.length;
  const publishedCount = data.filter((a) => a.statut === 'publie').length;
  const draftCount = data.filter((a) => a.statut === 'brouillon').length;

  return (
    <div className="space-y-2 p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      <Toaster position="top-right" richColors />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card
          variant="outlined"
          sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}
        >
          <CardContent className="flex flex-col items-center py-4">
            <Typography variant="h4" className="font-bold text-gray-900">
              {totalCount}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Total
            </Typography>
          </CardContent>
        </Card>
        <Card
          variant="outlined"
          sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}
        >
          <CardContent className="flex flex-col items-center py-4">
            <Typography variant="h4" className="font-bold text-green-600">
              {publishedCount}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Publiées
            </Typography>
          </CardContent>
        </Card>
        <Card
          variant="outlined"
          sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}
        >
          <CardContent className="flex flex-col items-center py-4">
            <Typography variant="h4" className="font-bold text-amber-500">
              {draftCount}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Brouillons
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Search + Add Button */}
      <Card
        variant="outlined"
        sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}
      >
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <Typography variant="h6" className="font-bold text-gray-800 whitespace-nowrap">
                Liste des actualités
                <Box
                  component="span"
                  className="ml-2 text-sm font-normal text-gray-500"
                >
                  ({filteredData.length} résultat{filteredData.length !== 1 ? 's' : ''})
                </Box>
              </Typography>
              <SearchInput
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Rechercher par titre, auteur..."
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
                    backgroundColor: '#f9fafb'
                  }
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
                  backgroundColor: '#2563eb',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  }
                }}
              >
                + Nouvelle actualité
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters - Full Width Below */}
      {filtersOpen && (
        <Card
          variant="outlined"
          sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}
        >
          <CardContent>
            <ActualiteFilters
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
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <ActualiteTable
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
      <ActualiteForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedActualite}
        mode={formMode}
      />

      {/* View Dialog */}
      <ActualiteViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        actualite={selectedActualite}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer l'actualité"
        message={
          actualiteToDelete
            ? `Êtes-vous sûr de vouloir supprimer "${actualiteToDelete.titre}" ? Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setActualiteToDelete(null);
        }}
        severity="error"
      />
    </div>
  );
};

export default Actualites;