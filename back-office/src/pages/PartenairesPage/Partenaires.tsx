import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { toast, Toaster } from 'sonner';
import {
  PartenaireFilters,
  PartenaireForm,
  PartenaireTable,
  PartenaireViewDialog,
  ConfirmDialog,
  SearchInput,
  StatsCard,
} from '../../components';
import { usePagination, usePartenaireFilter } from '../../hooks';
import type { PartenaireFormData, Partenaire } from '../../types';
import { getAllPartenaires, createPartenaire, updatePartenaire, deletePartenaire } from '../../services';

const Partenaires: React.FC = () => {
  // Data state
  const [data, setData] = useState<Partenaire[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // UI state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedPartenaire, setSelectedPartenaire] = useState<Partenaire | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partenaireToDelete, setPartenaireToDelete] = useState<Partenaire | null>(null);

  // Hooks
  const { filters, filteredData, updateFilter, resetFilters, activeFilterCount } = usePartenaireFilter({
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
    const loadPartenaires = async () => {
      try {
        const partenaires = await getAllPartenaires() as Partenaire[];
        setData(partenaires);
      } catch (error) {
        console.error('Failed to load partenaires from backend:', error);
        toast.error('Erreur lors du chargement des partenaires');
      }
    };

    loadPartenaires();
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
            prev.map((item) =>
              item.id === selectedPartenaire.id ? updatedPartenaire : item
            )
          );
          toast.success('Partenaire modifié avec succès');
        }
      } catch (error) {
        toast.error('Erreur lors de l\'enregistrement');
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

  // Stats - Memoized
  const stats = useMemo(() => {
    const totalCount = data.length;
    const entrepriseCount = data.filter((p) => p.type === 'Entreprise').length;
    const institutionCount = data.filter((p) => p.type === 'Institution').length;
    const organisationCount = data.filter((p) => p.type === 'Organisation').length;
    const autreCount = data.filter((p) => p.type === 'Autre').length;

    return { totalCount, entrepriseCount, institutionCount, organisationCount, autreCount };
  }, [data]);

  return (
    <div className="space-y-2 p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <Toaster position="top-right" richColors />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Total partenaires" value={stats.totalCount} color="gray" />
        <StatsCard title="Entreprises" value={stats.entrepriseCount} color="blue" />
        <StatsCard title="Institutions" value={stats.institutionCount} color="green" />
        <StatsCard title="Organisations" value={stats.organisationCount} color="amber" />
        <StatsCard title="Autres" value={stats.autreCount} color="gray" />
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
                Liste des partenaires
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
                + Nouveau partenaire
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
            <PartenaireFilters
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

      {/* Form Dialog (Create / Edit) */}
      <PartenaireForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedPartenaire}
        mode={formMode}
      />

      {/* View Dialog */}
      <PartenaireViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        partenaire={selectedPartenaire}
      />

      {/* Delete Confirmation Dialog */}
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