import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/api/types/api';
import ListPageHeader from '../../components/common/ListPageHeader';
import { AdmissionFilters, ConfirmDialog, AdmissionTable, AdmissionDetailDialog, AdmissionDecisionDialog, PdfPreviewDialog } from '../../components';
import { useDebounce, useScrollToTop } from '../../hooks';
import { useAdmissionsQuery, useDeleteAdmission, useUpdateAdmissionStatus } from '../../hooks/queries';
import { getAdmissionDocumentBlob } from '../../services/admissions.service';
import { useTitle } from '../../hooks/useTitle';
import type { Admission, AdmissionStatus } from '../../types/admission.types';
import { formatFullName } from '../../utils/name.utils';

const ITEMS_PER_PAGE = 10;

const Admissions = () => {
  useScrollToTop();
  useTitle('Admissions');

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [preview, setPreview] = useState<{ admission: Admission; kind: 'cv' | 'lettre' } | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<Admission | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterNiveau, setFilterNiveau] = useState('all');
  const [filterFormation, setFilterFormation] = useState('all');
  const [filterDateDebut, setFilterDateDebut] = useState('');

  const activeFilterCount = [
    filterStatus !== 'all',
    filterNiveau !== 'all',
    filterFormation !== 'all',
    Boolean(filterDateDebut),
  ].filter(Boolean).length;

  const { data, isError, error, refetch } = useAdmissionsQuery({
    page: currentPage + 1,
    limit: rowsPerPage,
    q: debouncedSearch || undefined,
    statut: filterStatus,
    niveau: filterNiveau,
    formation: filterFormation,
    dateDebut: filterDateDebut || undefined,
  });
  const updateStatusMutation = useUpdateAdmissionStatus();
  const deleteMutation = useDeleteAdmission();
  const admissions = data?.data ?? [];
  const totalItems = data?.total ?? 0;
  const niveaux = useMemo(
    () => Array.from(new Set(admissions.map((item) => item.niveau))).sort((a, b) => a.localeCompare(b)),
    [admissions],
  );
  const formations = useMemo(
    () =>
      Array.from(new Set(admissions.map((item) => item.formation))).sort((a, b) => a.localeCompare(b)),
    [admissions],
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, filterStatus, filterNiveau, filterFormation, filterDateDebut]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterNiveau('all');
    setFilterFormation('all');
    setFilterDateDebut('');
    setCurrentPage(0);
  }, []);

  const handleSaveDecision = async (payload: {
    statut: AdmissionStatus;
    commentaire?: string;
    reponseDate?: string;
    reponseHeure?: string;
    reponseLieu?: string;
    reponseInstructions?: string;
    reponseMessage?: string;
  }) => {
    if (!selectedAdmission) return;
    setUpdating(true);
    try {
      await updateStatusMutation.mutateAsync({
        id: selectedAdmission.id,
        ...payload,
      });
      setShowStatusModal(false);
      setShowDetailModal(false);
      setSelectedAdmission(null);
      toast.success(
        payload.statut === 'accepte'
          ? 'Admission validée. L’email a été transmis au candidat.'
          : 'Décision enregistrée. L’email a été transmis au candidat.',
      );
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Impossible d'envoyer l'email";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const openPreview = (admission: Admission, kind: 'cv' | 'lettre') => {
    setPreview({ admission, kind });
  };

  const loadPreview = useCallback(async () => {
    if (!preview) throw new Error('Document introuvable');
    return getAdmissionDocumentBlob(preview.admission.id, preview.kind);
  }, [preview]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Candidature supprimée avec succès');
      setDeleteTarget(null);
    } catch {
      toast.error('Une erreur est survenue lors de la suppression.');
    }
  };

  function getEmptyMessage(): string | undefined {
    const hasSearch = Boolean(searchTerm.trim());
    const hasFilters =
      filterStatus !== 'all' ||
      filterNiveau !== 'all' ||
      filterFormation !== 'all' ||
      Boolean(filterDateDebut.trim());

    if (hasSearch || hasFilters) {
      return 'Aucune admission ne correspond à votre recherche ou aux filtres appliqués.';
    }

    return 'Aucune admission enregistrée pour le moment.';
  }

  return (
    <div className="mx-auto max-w-7xl py-4 space-y-2 mx-auto min-w-0">
      <ListPageHeader
        title="Liste des admissions"
        totalCount={totalItems}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par nom, prénom, email, téléphone..."
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
        filtersOpen={filtersOpen}
      />

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
        onToggle={() => setFiltersOpen((prev) => !prev)}
        niveaux={niveaux}
        formations={formations}
      />

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : 'Erreur lors du chargement des admissions'}
          <Button variant="outline" size="sm" className="ml-3" onClick={() => void refetch()}>
            Réessayer
          </Button>
        </div>
      )}

      <AdmissionTable
        data={admissions}
        totalCount={totalItems}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(0);
        }}
        onView={(admission) => {
          setSelectedAdmission(admission);
          setShowDetailModal(true);
        }}
        onEdit={(admission) => {
          setSelectedAdmission(admission);
          setShowStatusModal(true);
        }}
        onDelete={(id) => {
          const admission = admissions.find((item) => item.id === id);
          if (admission) setDeleteTarget(admission);
        }}
        onPreviewDocument={openPreview}
        emptyMessage={getEmptyMessage()}
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
          onPreviewDocument={(kind) => openPreview(selectedAdmission, kind)}
        />
      )}

      {selectedAdmission && (
        <AdmissionDecisionDialog
          admission={selectedAdmission}
          open={showStatusModal}
          submitting={updating}
          onClose={() => setShowStatusModal(false)}
          onSubmit={handleSaveDecision}
        />
      )}

      {preview && (() => {
        const documentType = preview.kind === 'cv' ? 'CV' : 'Lettre de motivation';
        const fileName = preview.kind === 'cv' ? 'CV' : 'Lettre';
        const title = `${documentType} — ${formatFullName(preview.admission)}`;
        // L'extension réelle est déterminée par le backend d'après la
        // signature du fichier ; on n'impose plus « .pdf » ici.
        const fileNameWithExt = `${fileName}-${preview.admission.nom}`;

        return (
          <PdfPreviewDialog
            open={true}
            title={title}
            fileName={fileNameWithExt}
            loadDocument={loadPreview}
            onClose={() => setPreview(null)}
          />
        );
      })()}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer la candidature"
        message={
          deleteTarget
            ? `Êtes-vous sûr de vouloir supprimer la candidature de "${formatFullName(deleteTarget)}" ? Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        severity="error"
      />

    </div>
  );
};

export default Admissions;
