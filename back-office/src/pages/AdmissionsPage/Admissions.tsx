import { useState, useEffect, useMemo, useCallback } from 'react';
import { useScrollToTop } from '../../hooks/';
import { useTitle } from '../../hooks/useTitle';
import {
  getAllAdmissions,
  updateAdmissionStatus,
  deleteAdmission,
} from '../../services/admissions.service';
import type { Admission, AdmissionStatus } from '../../types/admission.types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SearchInput, AdmissionFilters } from '../../components';
import AdmissionTable from '../../components/AdmissionComponents/AdmissionTable';
import AdmissionDetailDialog from '../../components/AdmissionComponents/AdmissionDetailDialog';
import usePagination from '../../hooks/usePagination';

const ITEMS_PER_PAGE = 10;

const Admissions = () => {
  useScrollToTop();
  useTitle('Admissions');

  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<AdmissionStatus>('en_attente');
  const [commentaire, setCommentaire] = useState('');
  const [updating, setUpdating] = useState(false);

  // Filtres
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterNiveau, setFilterNiveau] = useState('all');
  const [filterFormation, setFilterFormation] = useState('all');
  const [filterDateDebut, setFilterDateDebut] = useState('');

  const {
    currentPage,
    rowsPerPage,
    paginatedData,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
  } = usePagination({ data: admissions, initialRowsPerPage: ITEMS_PER_PAGE });

  useEffect(() => {
    loadAdmissions();
  }, []);

  useEffect(() => {
    resetPage();
  }, [searchTerm, filterStatus, filterNiveau, filterFormation, filterDateDebut, resetPage]);

  const niveaux = useMemo(() => {
    const uniqueNiveaux = Array.from(new Set(admissions.map((a) => a.niveau)));
    return uniqueNiveaux.sort((a, b) => a.localeCompare(b));
  }, [admissions]);

  const formations = useMemo(() => {
    const uniqueFormations = Array.from(new Set(admissions.map((a) => a.formation)));
    return uniqueFormations.sort((a, b) => a.localeCompare(b));
  }, [admissions]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterStatus !== 'all') count++;
    if (filterNiveau !== 'all') count++;
    if (filterFormation !== 'all') count++;
    if (filterDateDebut) count++;
    return count;
  }, [filterStatus, filterNiveau, filterFormation, filterDateDebut]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterNiveau('all');
    setFilterFormation('all');
    setFilterDateDebut('');
    resetPage();
  }, [resetPage]);

  const loadAdmissions = async () => {
    try {
      const data = await getAllAdmissions();
      setAdmissions(data);
    } catch (error) {
      console.error('Erreur lors du chargement des admissions:', error);
      toast.error('Erreur lors du chargement des admissions');
    }
  };

  const filteredAdmissions = admissions.filter((admission) => {
    const matchesSearch =
      !searchTerm ||
      admission.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.formation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || admission.statut === filterStatus;
    const matchesNiveau = filterNiveau === 'all' || admission.niveau === filterNiveau;
    const matchesFormation = filterFormation === 'all' || admission.formation === filterFormation;
    const matchesDateDebut =
      !filterDateDebut || new Date(admission.creeLe) >= new Date(filterDateDebut);

    return matchesSearch && matchesStatus && matchesNiveau && matchesFormation && matchesDateDebut;
  });

  const handleViewDetails = (admission: Admission) => {
    setSelectedAdmission(admission);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = (admission: Admission) => {
    setSelectedAdmission(admission);
    setNewStatus(admission.statut);
    setCommentaire(admission.commentaire || '');
    setShowStatusModal(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedAdmission) return;

    setUpdating(true);
    try {
      await updateAdmissionStatus(selectedAdmission.id, newStatus, commentaire);
      await loadAdmissions();
      setShowStatusModal(false);
      setSelectedAdmission(null);
      setCommentaire('');
      toast.success('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Une erreur est survenue lors de la mise à jour du statut.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      return;
    }

    try {
      await deleteAdmission(id);
      await loadAdmissions();
      toast.success('Candidature supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Une erreur est survenue lors de la suppression.');
    }
  };

  const handleDownloadCV = (admission: Admission) => {
    if (admission.cvPath) {
      window.open(admission.cvPath, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadLettre = (admission: Admission) => {
    if (admission.lettreMotivationPath) {
      window.open(admission.lettreMotivationPath, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      resetPage();
    },
    [resetPage]
  );

  const handleToggleFilters = useCallback(() => {
    setFiltersOpen((prev) => !prev);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-2 p-2 sm:p-6 lg:p-8">

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-ink-100 p-4 shadow-card">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            <h2 className="text-lg font-bold text-ink-800 whitespace-nowrap">
              Liste des admissions
              <span className="ml-2 text-sm font-normal text-ink-500">
                ({filteredAdmissions.length} résultat{filteredAdmissions.length !== 1 ? 's' : ''})
              </span>
            </h2>
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Rechercher par nom, prénom, email..."
            />
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Button variant="outline" onClick={handleToggleFilters} className="rounded-lg">
              {filtersOpen ? 'Masquer les filtres' : 'Filtres'}
            </Button>
          </div>
        </div>
      </div>

      <AdmissionFilters
        filters={{
          search: searchTerm,
          status: filterStatus,
          niveau: filterNiveau,
          formation: filterFormation,
          dateDebut: filterDateDebut,
        }}
        onUpdateFilter={(key, value) => {
          if (key === 'status') setFilterStatus(value);
          if (key === 'niveau') setFilterNiveau(value);
          if (key === 'formation') setFilterFormation(value);
          if (key === 'dateDebut') setFilterDateDebut(value);
        }}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
        open={filtersOpen}
        onToggle={handleToggleFilters}
        niveaux={niveaux}
        formations={formations}
      />

      <AdmissionTable
        data={paginatedData}
        totalCount={filteredAdmissions.length}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onView={handleViewDetails}
        onEdit={handleUpdateStatus}
        onDelete={handleDelete}
        onDownloadCV={handleDownloadCV}
        onDownloadLettre={handleDownloadLettre}
        emptyMessage={
          searchTerm ||
          filterStatus !== 'all' ||
          filterNiveau !== 'all' ||
          filterFormation !== 'all'
            ? 'Aucun résultat trouvé'
            : 'Aucune candidature trouvée'
        }
      />

      {showDetailModal && selectedAdmission && (
        <AdmissionDetailDialog
          admission={selectedAdmission}
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onEditStatus={() => {
            setShowDetailModal(false);
            setShowStatusModal(true);
          }}
        />
      )}

      {showStatusModal && selectedAdmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink-900">Modifier le statut</h2>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-ink-400 hover:text-ink-600"
                disabled={updating}
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  Candidat: {selectedAdmission.prenom} {selectedAdmission.nom}
                </label>
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  Formation: {selectedAdmission.formation}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  Nouveau statut
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AdmissionStatus)}
                  className="w-full px-4 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  disabled={updating}
                >
                  <option value="en_attente">En attente</option>
                  <option value="en_cours_etude">En cours d'étude</option>
                  <option value="accepte">Accepté</option>
                  <option value="refuse">Refusé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Ajoutez un commentaire..."
                  disabled={updating}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveStatus}
                  disabled={updating}
                  className="flex-1 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors disabled:bg-ink-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Enregistrement...
                    </>
                  ) : (
                    'Enregistrer'
                  )}
                </button>
                <button
                  onClick={() => setShowStatusModal(false)}
                  disabled={updating}
                  className="flex-1 bg-ink-100 text-ink-800 px-4 py-2 rounded-lg hover:bg-ink-300 transition-colors disabled:bg-ink-100"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admissions;
