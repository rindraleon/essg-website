import React, { useEffect } from 'react';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import Button from '@mui/material/Button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  CtaSection,
  EmptyState,
  PageHero,
  Breadcrumb,
  FormationDetailContent,
} from '../../components';
import { GREEN } from '../../constants/colors';
import { useFormationBySlug, useScrollToTop } from '../../hooks';
import { useTitle } from '../../hooks/useTitle';
import { getFormationImage } from '../../utils/image.utils';

const FormationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { formation, loading, error } = useFormationBySlug(slug || '');
  const { setTitle } = useTitle();

  useScrollToTop();

  useEffect(() => {
    if (formation) {
      setTitle(formation.titre);
    }
  }, [formation, setTitle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
            <p className="text-ink-500">Chargement de la formation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !formation) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            icon={<AutoStoriesRoundedIcon sx={{ fontSize: 40, color: GREEN[400] }} />}
            title="Formation introuvable"
            description="La formation que vous recherchez n'existe pas ou a été supprimée."
            actionLabel="Retour aux formations"
            onAction={() => window.history.back()}
          />

          <div className="mt-8 text-center">
            <Button
              component={RouterLink}
              to="/formations"
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                borderRadius: '0.75rem',
                textTransform: 'none',
                fontWeight: 600,
                borderColor: GREEN[600],
                color: GREEN[600],
                '&:hover': {
                  borderColor: GREEN[700],
                  backgroundColor: GREEN[50],
                },
              }}
            >
              Toutes les formations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={getFormationImage(formation.image, formation.slug)}
        imageAlt={formation.titre}
        badgeIcon={<AutoStoriesRoundedIcon />}
        badgeLabel={formation.niveau}
        title={formation.titre}
        description={formation.description}
        minHeight="50vh"
      />

      {/* Fil d'Ariane */}
      <Breadcrumb
        items={[{ label: 'Formations', to: '/formations' }, { label: formation.titre }]}
      />

      {/* Contenu principal */}
      <FormationDetailContent formation={formation} />

      {/* Section CTA */}
      <CtaSection
        icon={<SchoolRoundedIcon sx={{ fontSize: 48, color: GREEN[400] }} />}
        title="Intéressé par cette formation ?"
        description="Contactez-nous pour obtenir plus d'informations ou postulez dès maintenant pour rejoindre l'ESSG."
        primaryLabel="Postuler maintenant"
        primaryLink="/admission"
        secondaryLabel="Demander des informations"
        secondaryLink="/contact"
      />
    </div>
  );
};

export default FormationDetailPage;
