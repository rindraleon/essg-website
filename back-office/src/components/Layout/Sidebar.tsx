import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { routesStatic } from "../../routes";
import EssG from "../../assets/files/images/logo/EssG.png";
import { Article, Close, Dashboard, Logout, Menu, Folder, School, Handshake, Mail, HowToReg, People } from "@mui/icons-material";

const Sidebar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: "Tableau de bord",
      href: routesStatic.dashboard,
      icon: Dashboard,
    },
    {
      name: "Actualités",
      href: routesStatic.actualites,
      icon: Article,
    },
    {
      name: "Formations",
      href: routesStatic.formations,
      icon: School,
    },
    {
      name: "Projets",
      href: routesStatic.projets,
      icon: Folder,
    },
    {
      name: "Partenaires",
      href: routesStatic.partenaires,
      icon: Handshake,
    },
    {
      name: "Contacts",
      href: routesStatic.contacts,
      icon: Mail,
    },
    {
      name: "Admissions",
      href: routesStatic.admissions,
      icon: HowToReg,
    },
    {
      name: "Ressources Humaines",
      href: routesStatic.ressourcesHumaines,
      icon: People,
    },
    {
      name: "Utilisateurs",
      href: routesStatic.utilisateurs,
      icon: People,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center" onClick={() => setSidebarOpen(false)}>
              <img
                  src={EssG}
                  alt="Logo ESSG"
                  className="h-16 w-auto object-contain sm:h-20"
              />
          </Link>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          aria-label="Ouvrir le menu"
        >
          {sidebarOpen ? (
            <Close className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-30 lg:hidden border-0 p-0 cursor-pointer"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fermer le menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 border-b border-gray-200">
            <Link to="/" className="flex items-center" onClick={() => setSidebarOpen(false)}>
              <img
                  src={EssG}
                  alt="Logo ESSG"
                  className="h-16 w-auto object-contain sm:h-20"
              />
          </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-gray-200 p-4">
            <Link
              to={routesStatic.login}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Logout className="h-4 w-4" />
              Retour au site
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;