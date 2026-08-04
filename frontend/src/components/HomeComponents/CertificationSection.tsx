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
    <section className="bg-green-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-white p-4 shadow-md">
            <WorkspacePremiumRoundedIcon className="text-green-600" />
            <span className="text-gray-800 font-semibold">
              Reconnaissance nationale et internationale de notre excellence
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
