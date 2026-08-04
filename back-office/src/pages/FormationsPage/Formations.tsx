import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { toast, Toaster } from 'sonner';
import {
  FormationFilters,
  FormationForm,
  FormationTable,
  FormationViewDialog,
  ConfirmDialog,
  SearchInput,
} from '../../components';
import { usePagination, useFormationFilter } from '../../hooks';
import type { FormationFormData, Formation } from '../../types';
import {
  getAllFormations,
  createFormation,
  updateFormation,
  deleteFormation,
} from '../../services';

const Formations: React.FC = () => {
  // Data state
  const [data, setData] = useState<Formation[]>([]);
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

  // Load data from backend
  useEffect(() => {
    const loadFormations = async () => {
      try {
        const formations = await getAllFormations();
        setData(formations);
      } catch (error) {
        console.error('Failed to load formations from backend:', error);
        toast.error('Erreur lors du chargement des formations');
      }
    };

    loadFormations();
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
        await deleteFormation(formationToDelete.id);
        setData((prev) => prev.filter((item) => item.id !== formationToDelete.id));
        toast.success(`"${formationToDelete.titre}" a été supprimée avec succès`);
        setDeleteDialogOpen(false);
        setFormationToDelete(null);
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error('Error deleting formation:', error);
      }
    }
  }, [formationToDelete]);

  const handleFormSubmit = useCallback(
    async (formData: FormationFormData) => {
      try {
        if (formMode === 'create') {
          const newFormation = await createFormation(formData);
          setData((prev) => [newFormation, ...prev]);
          toast.success('Formation créée avec succès');
        } else if (selectedFormation) {
          const updatedFormation = await updateFormation(selectedFormation.id, formData);
          setData((prev) =>
            prev.map((item) => (item.id === selectedFormation.id ? updatedFormation : item))
          );
          toast.success('Formation modifiée avec succès');
        }
        // Close the dialog only after successful API call
        setFormOpen(false);
      } catch (error) {
        toast.error("Erreur lors de l'enregistrement");
        console.error('Error saving formation:', error);
      }
    },
    [formMode, selectedFormation]
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
  const featuredCount = data.filter((f) => f.enVedette).length;
  const licenceCount = data.filter((f) => f.niveau === 'Licence').length;
  const masterCount = data.filter((f) => f.niveau === 'Master').length;

  return (
    <div className="space-y-2 p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <Toaster position="top-right" richColors />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
          <CardContent className="flex flex-col items-center py-4">
            <Typography variant="h4" className="font-bold text-gray-900">
              {totalCount}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Total formations
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
          <CardContent className="flex flex-col items-center py-4">
            <Typography variant="h4" className="font-bold text-blue-600">
              {licenceCount}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Licence
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
          <CardContent className="flex flex-col items-center py-4">
            <Typography variant="h4" className="font-bold text-purple-600">
              {masterCount}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Master
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
          <CardContent className="flex flex-col items-center py-4">
            <Typography variant="h4" className="font-bold text-amber-500">
              {featuredCount}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              En vedette
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Search + Add Button */}
      <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <Typography variant="h6" className="font-bold text-gray-800 whitespace-nowrap">
                Liste des formations
                <Box component="span" className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredData.length} résultat{filteredData.length !== 1 ? 's' : ''})
                </Box>
              </Typography>
              <SearchInput
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Rechercher par titre, domaine..."
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
                  backgroundColor: '#2563eb',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  },
                }}
              >
                + Nouvelle formation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters - Full Width Below */}
      {filtersOpen && (
        <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
          <CardContent>
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
          </CardContent>
        </Card>
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
