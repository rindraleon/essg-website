import {
  HeroSection,
  CertificationsSection,
  FormationsSection,
  ProjetsSection,
  PartenairesSection,
  LocalisationSection,
  AdmissionSection,
  ActualitesSection,
  RessourceHumaineSection,
} from '../../components';
import { useScrollToTop } from '../../hooks/';
import { useTitle } from '../../hooks/useTitle';

const Home = () => {
  useScrollToTop();
  useTitle('Home');
  return (
    <div>
      <HeroSection />
      <div id="contenu" className="sr-only" aria-hidden="true" />
      <CertificationsSection />
      <FormationsSection />
      <ActualitesSection />
      <ProjetsSection />
      <PartenairesSection />
      <RessourceHumaineSection />
      <LocalisationSection />
      <AdmissionSection />
    </div>
  );
};

export default Home;
