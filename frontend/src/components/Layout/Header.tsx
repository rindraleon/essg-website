import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import EssG from "../../assets/files/images/logo/EssG.png";

// Navigation items
const navigation = [
  { name: "Accueil", href: "/" },
  { name: "À propos", href: "/about" },
  { name: "Formations", href: "/formations" },
  { name: "Actualités", href: "/actualites" },
  { name: "Projets", href: "/projets" },
  { name: "Partenaires", href: "/partenaires" },
  
];

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = (active: boolean): string =>
    `text-sm font-medium transition-colors ${
      active ? "text-indigo-600" : "text-gray-700 hover:text-gray-900"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={EssG}
              alt="Logo ESSG"
              className="h-16 w-auto object-contain sm:h-20"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive: active }) => navLinkClass(active)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Button
              component={Link}
              to="/contact"
              variant="outlined"
              sx={{
                borderColor: "gray",
                color: "gray",
                textTransform: "none",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                },
              }}
            >
              Contact
            </Button>
            <Button
              component={Link}
              to="/admission"
              variant="contained"
              sx={{
                backgroundColor: "#2563eb",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                },
              }}
            >
              Admission
            </Button>
          </div>

          {/* Mobile menu button */}
          <IconButton
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            sx={{
              display: { lg: "none" },
              color: "gray",
            }}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive: active }) =>
                    `block px-4 py-2 text-base font-medium rounded-md transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="px-4 pt-4 space-y-2">
                <Button
                  component={Link}
                  to="/contact"
                  variant="outlined"
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    borderColor: "gray",
                    color: "gray",
                    textTransform: "none",
                  }}
                >
                  Contact
                </Button>
                <Button
                  component={Link}
                  to="/admission"
                  variant="contained"
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    backgroundColor: "#2563eb",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#1d4ed8",
                    },
                  }}
                >
                  Admission
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
