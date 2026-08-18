import { CircleHelp, GraduationCap } from 'lucide-react';
import React from 'react';


import type { AdmissionPageProps } from '../../types/admission.types';
import { AdmissionForm, ContactCard, CtaSection, PageHero, Breadcrumb } from '../../components';

import { SITE_HERO_IMAGE } from '../../constants/media';
import { useTitle } from '@/hooks/useTitle';

const HERO_IMAGE = SITE_HERO_IMAGE;

const AdmissionPage: React.FC<AdmissionPageProps> = (props: Readonly<AdmissionPageProps>) => {
  useTitle('Admission | ESSG');

  const {
    pageTitle = 'Admission',
    pageDescription = "Rejoignez l'ESSG et commencez votre parcours vers l'excellence en sciences géomatiques.",
  } = props;

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Les toasts sont gérés globalement par <AppToaster /> (App.tsx). */}

      <PageHero
        image={HERO_IMAGE}
        imageAlt="Admission ESSG"
        title={pageTitle}
        description={pageDescription}
        stats={[
          { value: 'Jan-Mai', label: 'Candidatures' },
          { value: 'Juin', label: 'Examens' },
          { value: 'Sept', label: 'Rentrée' },
        ]}
      />

      <Breadcrumb items={[{ label: 'Admission' }]} />

      {/* <AdmissionTimeline /> */}

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AdmissionForm />

          <div className="mt-8">
            <ContactCard
              icon={
                <CircleHelp
                />
              }
              title="Besoin d'aide ?"
              description="Si vous rencontrez des difficultés ou avez des questions sur le processus d'admission, notre équipe est là pour vous aider."
              primaryLabel="admission@essg.mg"
              primaryLink="admission@essg.mg"
              secondaryLabel="+261 34 28 085 30"
              secondaryLink="/contact"
            />
          </div>
        </div>
      </section>

      <CtaSection
        icon={<GraduationCap />}
        title="Découvrez nos formations"
        description="Explorez nos programmes d'excellence en sciences géomatiques avant de soumettre votre candidature."
        primaryLabel="Voir les formations"
        primaryLink="/formations"
        secondaryLabel="Questions fréquentes"
        secondaryLink="/faq"
      />
    </div>
  );
};

export default AdmissionPage;
