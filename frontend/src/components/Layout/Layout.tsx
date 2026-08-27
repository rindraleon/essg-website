import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BackToTop from '../common/BackToTop';
import ScrollProgress from '../common/ScrollProgress';
import type { LayoutProps } from '@/types';
import { useScrollToTop } from '@/hooks';
import SocialLinks from '../common/SocialLinks';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useScrollToTop();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-ink-50 text-ink-900">
      <ScrollProgress />
      <Header />
      <main className="flex-1 w-full">
        <div key={location.pathname} className="page-transition">
          {children}
        </div>
      </main>
      <Footer />
      <SocialLinks fixed size={24} />
      <BackToTop />
    </div>
  );
};

export default Layout;
