import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { routesStatic } from "../../routes";
import { useAuth } from "../../contexts/AuthContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { getImageUrl } from "../../utils/image.utils";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [helpAnchorEl, setHelpAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, username, logout } = useAuth();

  const profileOpen = Boolean(profileAnchorEl);
  const helpOpen = Boolean(helpAnchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleHelpClick = (event: React.MouseEvent<HTMLElement>) => {
    setHelpAnchorEl(event.currentTarget);
  };

  const handleHelpClose = () => {
    setHelpAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    handleProfileClose();
  };

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);
    await logout();
    setOpen(false);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  // Fonction pour générer les initiales
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Récupérer le prénom et l'avatar
  const prenom = user?.prenom || username || "Utilisateur";
  const avatarUrl = user?.avatar ? getImageUrl(user.avatar) : undefined;

  return (
    <header className="bg-white shadow-sm z-20 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Partie haute : logo, nav desktop, actions */}
        <div className="flex items-center justify-between">
          {/* Brand et nav desktop */}
          <div className="flex items-center gap-8">
            <p className="text-gray-600">Bienvenue dans l'espace d'administration de l'ESSG</p>
          </div>

          {/* Actions à droite - Desktop */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton
                  size="medium"
                  className="text-gray-700 hover:text-indigo-600"
                  aria-label="notifications"
                >
                  <Badge
                    badgeContent={3}
                    color="error"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.7rem",
                        height: 18,
                        minWidth: 18,
                      },
                    }}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Messages */}
              <Tooltip title="Messages">
                <IconButton
                  size="medium"
                  className="text-gray-700 hover:text-indigo-600"
                  aria-label="messages"
                >
                  <Badge
                    badgeContent={2}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.7rem",
                        height: 18,
                        minWidth: 18,
                      },
                    }}
                  >
                    <MailIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Aide */}
              <Tooltip title="Aide et informations">
                <IconButton
                  size="medium"
                  className="text-gray-700 hover:text-indigo-600"
                  aria-label="aide"
                  onClick={handleHelpClick}
                >
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>

              {/* Menu aide */}
              <Menu
                anchorEl={helpAnchorEl}
                open={helpOpen}
                onClose={handleHelpClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.08))",
                      mt: 1.5,
                      minWidth: 180,
                      "& .MuiMenuItem-root": {
                        fontSize: "0.875rem",
                        py: 1.25,
                      },
                    },
                  },
                }}
              >
                <MenuItem onClick={handleHelpClose}>
                  Centre d'aide
                </MenuItem>
                <MenuItem onClick={handleHelpClose}>
                  Documentation
                </MenuItem>
                <MenuItem onClick={handleHelpClose}>
                  Contactez-nous
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleHelpClose}>
                  À propos
                </MenuItem>
              </Menu>

              {/* Profil */}
              <Tooltip title="Profil">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 ml-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-colors"
                  aria-label="profil"
                >
                  <Avatar
                    src={avatarUrl}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: avatarUrl ? "transparent" : "#4f46e5",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    {!avatarUrl && getInitials(prenom)}
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start mr-1">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {prenom}
                    </p>
                    {/* <p className="text-xs text-gray-500 leading-tight">
                      Administrateur
                    </p> */}
                  </div>
                </button>
              </Tooltip>

              {/* Menu profil */}
              <Menu
                anchorEl={profileAnchorEl}
                open={profileOpen}
                onClose={handleProfileClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.08))",
                      mt: 1.5,
                      minWidth: 200,
                      "& .MuiMenuItem-root": {
                        fontSize: "0.875rem",
                        py: 1.25,
                        gap: 1.5,
                      },
                    },
                  },
                }}
              >
                <MenuItem onClick={() => { handleProfileClose(); navigate(routesStatic.profil); }}>
                  <PersonIcon fontSize="small" className="text-gray-600" />
                  Mon profil
                </MenuItem>
                <MenuItem onClick={handleProfileClose}>
                  <SettingsIcon fontSize="small" className="text-gray-600" />
                  Paramètres
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={handleLogoutClick}
                  className="text-red-600"
                >
                  <LogoutIcon fontSize="small" />
                  Déconnexion
                </MenuItem>
              </Menu>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <IconButton
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              size="medium"
              className="text-gray-700"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </div>
        </div>

      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="px-4 sm:px-6 py-4 flex flex-col gap-4">
            {/* Profil mobile */}
            {isAuthenticated && (
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={avatarUrl}
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: avatarUrl ? "transparent" : "#4f46e5",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {!avatarUrl && getInitials(prenom)}
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {prenom}
                    </p>
                    <p className="text-xs text-gray-500">Administrateur</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation mobile */}
            <nav className="flex flex-col gap-1">
              <NavLink
                to={routesStatic.home}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-2.5 px-3 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Accueil
              </NavLink>

              <NavLink
                to={routesStatic.example}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-2.5 px-3 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Example
              </NavLink>

              <NavLink
                to={routesStatic.dashboard}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-2.5 px-3 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </nav>

            {/* Actions mobile */}
            {isAuthenticated && (
              <>
                <Divider />
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon fontSize="small" />
                    </Badge>
                    <span>Notifications</span>
                  </button>

                  <button
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Badge badgeContent={2} color="primary">
                      <MailIcon fontSize="small" />
                    </Badge>
                    <span>Messages</span>
                  </button>

                  <button
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <HelpOutlineIcon fontSize="small" />
                    <span>Aide</span>
                  </button>

                  <button
                    onClick={() => { navigate(routesStatic.profil); setOpen(false); }}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <PersonIcon fontSize="small" />
                    <span>Mon profil</span>
                  </button>

                  <button
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <SettingsIcon fontSize="small" />
                    <span>Paramètres</span>
                  </button>

                   <button
                     onClick={handleLogoutClick}
                     className="flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                   >
                     <LogoutIcon fontSize="small" />
                     <span>Déconnexion</span>
                   </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Dialog de confirmation de déconnexion */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">
          Confirmer la déconnexion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à l'espace d'administration.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} variant="outlined">
            Annuler
          </Button>
          <Button onClick={handleLogoutConfirm} variant="contained" color="error" autoFocus>
            Se déconnecter
          </Button>
        </DialogActions>
      </Dialog>
    </header>
  );
};

export default Header;