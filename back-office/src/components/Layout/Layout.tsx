import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";
import type { LayoutProps } from '../../types/layout.types';

const Layout: React.FC<LayoutProps> = ({ children, showHeader = true, showFooter = false, showSidebar = false }) => {
    return (
        <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {showSidebar && <Sidebar />}
      
      <div className={`flex-1 flex flex-col ${showSidebar ? 'lg:ml-64' : ''}`}>
        {showHeader && <Header />}
        
        <main className="flex-1 w-full">
          <div className={`${showSidebar ? 'px-8 py-6' : 'container mx-auto px-4 sm:px-4 py-4'}`}>
            <Breadcrumb />
            {children}
          </div>
        </main>
        
        {showFooter && <Footer />}
      </div>
    </div>
    );
};

export default Layout;
