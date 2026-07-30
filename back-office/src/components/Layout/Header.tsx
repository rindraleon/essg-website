import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
import { getImageUrl } from "../../utils/image.utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { getRecentAdmissions } from "../../services/admissions.service";
import { getRecentMessages } from "../../services/messages.service";
import type { Admission } from "../../types/admission.types";
import type { Message } from "../../services/messages.service";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [recentAdmissions, setRecentAdmissions] = useState<Admission[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated, user, username, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadRecentAdmissions();
      loadRecentMessages();
    }
  }, [isAuthenticated]);

  const loadRecentAdmissions = async () => {
    try {
      const data = await getRecentAdmissions(4);
      setRecentAdmissions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des admissions récentes:", error);
    }
  };

  const loadRecentMessages = async () => {
    try {
      const response = await getRecentMessages(4);
      setRecentMessages(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des messages récents:", error);
    }
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
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

  // Compter les admissions en attente
  const pendingAdmissionsCount = recentAdmissions.filter(a => a.statut === "en_attente").length;

  // Compter les messages non lus
  const unreadMessagesCount = recentMessages.filter(m => !m.lu).length;

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "en_cours_etude":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "accepte":
        return "bg-green-100 text-green-800 border-green-300";
      case "refuse":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return "En attente";
      case "en_cours_etude":
        return "En cours d'étude";
      case "accepte":
        return "Accepté";
      case "refuse":
        return "Refusé";
      default:
        return statut;
    }
  };

  return (
    <header className="bg-white shadow-sm z-20 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1">
        {/* Partie haute : logo, nav desktop, actions */}
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <p className="text-gray-600 text-sm">
              Bienvenue dans l'espace d'administration de l'ESSG
            </p>
          </div>

          {/* Actions à droite - Desktop */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1 lg:gap-2">

              {/* Messages */}
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger>
                        <Button
                          variant="default"
                          size="icon"
                          className="text-gray-700 hover:text-indigo-600 relative"
                          aria-label="messages"
                        >
                          <Badge
                            variant="danger"
                            className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs"
                          >
                            {unreadMessagesCount}
                          </Badge>
                          <MailIcon className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Messages</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenuContent align="end" className="w-80 shadow-none ring-0 bg-white border border-gray-200">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Messages</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {recentMessages.length === 0 ? (
                      <div className="px-3 py-4 text-sm text-gray-500 text-center">
                        Aucun message
                      </div>
                    ) : (
                      recentMessages.map((message) => (
                        <DropdownMenuItem
                          key={message.id}
                          className="flex flex-col items-start p-3 cursor-pointer"
                          onClick={() => navigate(routesStatic.contacts)}
                        >
                          <div className="flex items-start justify-between w-full">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {message.prenom} {message.nom}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {message.email}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {message.message}
                              </p>
                              {!message.lu && (
                                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                                  Non lu
                                </span>
                              )}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate(routesStatic.contacts)}
                    className="text-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Voir plus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-700 hover:text-indigo-600 relative"
                          aria-label="notifications"
                        >
                          <Badge
                            variant="danger"
                            className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs"
                          >
                            {pendingAdmissionsCount}
                          </Badge>
                          <NotificationsIcon className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Notifications</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenuContent align="end" className="w-80 shadow-none ring-0 bg-white border border-gray-200">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {recentAdmissions.length === 0 ? (
                      <div className="px-3 py-4 text-sm text-gray-500 text-center">
                        Aucune notification
                      </div>
                    ) : (
                      recentAdmissions.map((admission) => (
                        <DropdownMenuItem
                          key={admission.id}
                          className="flex flex-col items-start p-3 cursor-pointer"
                          onClick={() => navigate(routesStatic.admissions)}
                        >
                          <div className="flex items-start justify-between w-full">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {admission.prenom} {admission.nom}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Formation: {admission.formation}
                              </p>
                              <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(admission.statut)}`}>
                                {getStatusLabel(admission.statut)}
                              </span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate(routesStatic.admissions)}
                    className="text-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Voir plus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Aide */}
              {/* <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-700 hover:text-indigo-600"
                          aria-label="aide"
                        >
                          <HelpOutlineIcon className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Aide et informations</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenuContent align="end" className="w-48 shadow-none ring-0 bg-white border border-gray-200">
                  <DropdownMenuItem>Centre d'aide</DropdownMenuItem>
                  <DropdownMenuItem>Documentation</DropdownMenuItem>
                  <DropdownMenuItem>Contactez-nous</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>À propos</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}

              {/* Profil */}
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger>
                        <button
                          className="flex items-center gap-2 ml-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-colors outline-none"
                          aria-label="profil"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={avatarUrl || undefined}
                              alt={prenom}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <AvatarFallback className="bg-indigo-600 text-white text-xs">
                              {getInitials(prenom)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="hidden lg:flex flex-col items-start mr-1">
                            <p className="text-xs font-medium text-gray-900 leading-tight">
                              {prenom}
                            </p>
                          </div>
                        </button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Profil</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenuContent align="end" className="w-48 shadow-none ring-0 bg-white border border-gray-200">
                  <DropdownMenuItem
                    onClick={() => navigate(routesStatic.profil)}
                  >
                    <PersonIcon className="h-4 w-4 mr-2" />
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogoutClick}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogoutIcon className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen((s) => !s)}
              className="text-gray-700"
              aria-label="Toggle menu"
            >
              {open ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>
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
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={avatarUrl || undefined}
                      alt={prenom}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <AvatarFallback className="bg-indigo-600 text-white text-sm">
                      {getInitials(prenom)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{prenom}</p>
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
                <hr className="border-gray-200" />
                <div className="flex flex-col gap-1">

                  <button
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <NotificationsIcon fontSize="small" />
                    <span>Notifications</span>
                    <Badge
                      variant="destructive"
                      className="ml-auto px-1.5 py-0.5 text-xs"
                    >
                      {pendingAdmissionsCount}
                    </Badge>
                  </button>

                  <button
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <MailIcon fontSize="small" />
                    <span>Messages</span>
                    <Badge
                      variant="default"
                      className="ml-auto px-1.5 py-0.5 text-xs"
                    >
                      {unreadMessagesCount}
                    </Badge>
                  </button>

                  <button
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <HelpOutlineIcon fontSize="small" />
                    <span>Aide</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate(routesStatic.profil);
                      setOpen(false);
                    }}
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
                    className="flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium text-red-600 hover:bg-gray-50"
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
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 -mx-4 -mt-4 px-6 py-4 rounded-t-xl">
            <DialogTitle className="text-white text-xl font-bold">
              Confirmer la déconnexion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700">
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous
              reconnecter pour accéder à l'espace d'administration.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={handleLogoutCancel}
              className="border-2 border-gray-300 hover:bg-gray-50"
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogoutConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <LogoutIcon className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;