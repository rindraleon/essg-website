import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { toast, Toaster } from 'sonner';
import {
  ProjetFilters,
  ProjetForm,
  ProjetTable,
  ProjetViewDialog,
  ConfirmDialog,
  SearchInput,
  StatsCard,
} from '../../components';
import { usePagination, useProjetFilter } from '../../hooks';
import type { ProjetFormData, Projet } from '../../types';
import { getAllProjets, createProjet, updateProjet, deleteProjet } from '../../services';

const Projets: React.FC = () => {
  // Data state
  const [data, setData] = useState<Projet[]>([]);
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

  // Load data from backend
  useEffect(() => {
    const loadProjets = async () => {
      try {
        const projets = await getAllProjets();
        setData(projets);
      } catch (error) {
        console.error('Failed to load projets from backend:', error);
        toast.error('Erreur lors du chargement des projets');
      }
    };

    loadProjets();
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
        await deleteProjet(projetToDelete.id);
        setData((prev) => prev.filter((item) => item.id !== projetToDelete.id));
        toast.success(`"${projetToDelete.titre}" a été supprimé avec succès`);
        setDeleteDialogOpen(false);
        setProjetToDelete(null);
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error('Error deleting projet:', error);
      }
    }
  }, [projetToDelete]);

  const handleFormSubmit = useCallback(
    async (formData: ProjetFormData) => {
      try {
        if (formMode === 'create') {
          const newProjet = await createProjet(formData);
          setData((prev) => [newProjet, ...prev]);
          toast.success('Projet créé avec succès');
        } else if (selectedProjet) {
          const updatedProjet = await updateProjet(selectedProjet.id, formData);
          setData((prev) =>
            prev.map((item) => (item.id === selectedProjet.id ? updatedProjet : item))
          );
          toast.success('Projet modifié avec succès');
        }
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

  // Stats - Memoized
  const stats = useMemo(() => {
    const totalCount = data.length;
    const internationalCount = data.filter((p) => p.type === 'International').length;
    const rechercheCount = data.filter((p) => p.type === 'Recherche').length;
    const partenariatCount = data.filter((p) => p.type === 'Partenariat').length;
    const servicePublicCount = data.filter((p) => p.type === 'Service public').length;

    return { totalCount, internationalCount, rechercheCount, partenariatCount, servicePublicCount };
  }, [data]);

  return (
    <div className="space-y-2 p-2 sm:p-6 lg:p-8">
      <Toaster position="top-right" richColors />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Total projets" value={stats.totalCount} color="gray" />
        <StatsCard title="International" value={stats.internationalCount} color="blue" />
        <StatsCard title="Recherche" value={stats.rechercheCount} color="green" />
        <StatsCard title="Partenariat" value={stats.partenariatCount} color="amber" />
        <StatsCard title="Service public" value={stats.servicePublicCount} color="gray" />
      </div>

      {/* Search + Add Button */}
      <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <Typography variant="h6" className="font-bold text-gray-800 whitespace-nowrap">
                Liste des projets
                <Box component="span" className="ml-2 text-sm font-normal text-gray-500">
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
                + Nouveau projet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters - Full Width Below */}
      {filtersOpen && (
        <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e5e7eb' }}>
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
