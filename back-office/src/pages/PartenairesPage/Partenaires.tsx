import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {Button } from '@mui/material';
import { toast, Toaster } from 'sonner';
import {
  PartenaireFilters,
  PartenaireForm,
  PartenaireTable,
  PartenaireViewDialog,
  ConfirmDialog,
  SearchInput,
} from '../../components';
import { usePagination, usePartenaireFilter } from '../../hooks';
import type { PartenaireFormData, Partenaire } from '../../types';
import { getAllPartenaires, createPartenaire, updatePartenaire, deletePartenaire } from '../../services';

const Partenaires: React.FC = () => {
  const [data, setData] = useState<Partenaire[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedPartenaire, setSelectedPartenaire] = useState<Partenaire | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partenaireToDelete, setPartenaireToDelete] = useState<Partenaire | null>(null);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{stats.totalCount}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 text-center">
          <div className="text-3xl font-bold text-blue-900">{stats.entrepriseCount}</div>
          <div className="text-sm text-blue-700">Entreprises</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4 text-center">
          <div className="text-3xl font-bold text-green-900">{stats.institutionCount}</div>
          <div className="text-sm text-green-700">Institutions</div>
        </div>
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 text-center">
          <div className="text-3xl font-bold text-amber-900">{stats.organisationCount}</div>
          <div className="text-sm text-amber-700">Organisations</div>
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{stats.autreCount}</div>
          <div className="text-sm text-gray-500">Autres</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            <h2 className="text-lg font-bold text-gray-800 whitespace-nowrap">
              Liste des partenaires
              <span className="ml-2 text-sm font-normal text-gray-500">
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
              className="rounded-lg"
            >
              {filtersOpen ? 'Masquer les filtres' : 'Filtres'}
            </Button>
            <Button
              onClick={handleOpenCreate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              + Nouveau partenaire
            </Button>
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
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