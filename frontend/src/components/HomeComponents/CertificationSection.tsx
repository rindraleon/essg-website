import React from 'react';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import type { CertificationsSectionProps } from '../../types';

const CertificationsSection: React.FC<CertificationsSectionProps> = (
  props: Readonly<CertificationsSectionProps>
) => {
  const {
    title = 'Qui sommes-nous ?',
    description = "Créée en 2026 et reconnue par la Loi n° 2010-001, l'École Supérieure de Science Géomatique (ESSG) de l'Université de Fianarantsoa, Madagascar, forme les experts de demain en géomatique, topographie et aménagement du territoire. Reconnaissance nationale et internationale de notre excellence",
  } = props;

  return (
    <section className="bg-brand-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-3xl text-ink-500 leading-7">{description}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-card ring-1 ring-brand-100">
            <WorkspacePremiumRoundedIcon sx={{ color: '#2e6a5f' }} />
            <span className="text-ink-800 font-semibold">
              Reconnaissance nationale et internationale de notre excellence
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
