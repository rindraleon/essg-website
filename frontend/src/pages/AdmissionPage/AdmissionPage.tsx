import { CircleHelp, GraduationCap } from 'lucide-react';
import React from 'react';

import { Toaster } from 'react-hot-toast';

import { GREEN } from '../../constants/colors';
import type { AdmissionPageProps } from '../../types/admission.types';
import { AdmissionForm, ContactCard, CtaSection, PageHero, Breadcrumb } from '../../components';
import { useScrollToTop } from '../../hooks';

import { SITE_HERO_IMAGE } from '../../constants/media';
import { useTitle } from '@/hooks/useTitle';

const HERO_IMAGE = SITE_HERO_IMAGE;

const AdmissionPage: React.FC<AdmissionPageProps> = (props: Readonly<AdmissionPageProps>) => {
  useScrollToTop();
  useTitle('Admission | ESSG');

  const {
    pageTitle = 'Admission',
    pageSubtitle = 'ESSG — Candidature',
    pageDescription = "Rejoignez l'ESSG et commencez votre parcours vers l'excellence en sciences géomatiques.",
  } = props;

  return (
    <div className="min-h-screen bg-ink-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '0.75rem',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: GREEN[600],
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <PageHero
        image={HERO_IMAGE}
        imageAlt="Admission ESSG"
        badgeIcon={<GraduationCap className="size-4" />}
        badgeLabel={pageSubtitle}
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
