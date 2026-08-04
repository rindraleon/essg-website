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
