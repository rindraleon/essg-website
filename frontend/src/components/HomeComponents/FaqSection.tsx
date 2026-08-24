import { SectionContent, SectionCta, SectionHeader } from '../../components';
import { HOME_FAQ_ITEMS } from '@/constants';
import FaqAccordion from './FaqAccordion';

const SECTION_CTA = { label: 'Toutes les questions', link: '/faq' } as const;

const FaqSection = () => {
  return (
    <SectionContent
      isEmpty={HOME_FAQ_ITEMS.length === 0}
      emptyMessage="Aucune question fréquente disponible pour le moment."
      headerContent={
        <SectionHeader
          title="Questions Fréquentes"
          description="Les réponses aux questions les plus posées sur l'ESSG"
        />
      }
      sectionClassName="bg-gradient-to-br from-white via-brand-50/45 to-sage-50/50 py-20"
    >
      <div className="mx-auto max-w-4xl">
        <FaqAccordion faqs={HOME_FAQ_ITEMS} />
      </div>

      <SectionCta label={SECTION_CTA.label} link={SECTION_CTA.link} />
    </SectionContent>
  );
};

export default FaqSection;
